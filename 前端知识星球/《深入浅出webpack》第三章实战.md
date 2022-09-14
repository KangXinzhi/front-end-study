文章来源：[深入浅出webpack](https://github.com/gwuhaolin/dive-into-webpack)

# 第三章：实战

## 3-1 使用 ES6 语言

    通常我们需要把采用 ES6 编写的代码转换成目前已经支持良好的 ES5 代码，这包含2件事：

    1.把新的 ES6 语法用 ES5 实现，例如 ES6 的 class 语法用 ES5 的 prototype 实现。
    
    2.给新的 API 注入 polyfill ，例如项目使用 fetch API 时，只有注入对应的 polyfill 后，才能在低版本浏览器中正常运行。

### Babel  

  Babel 可以方便的完成以上2件事。 Babel 是一个 JavaScript 编译器，能将 ES6 代码转为 ES5 代码，让你使用最新的语言特性而不用担心兼容性问题，并且可以通过插件机制根据需求灵活的扩展。 在 Babel 执行编译的过程中，会从项目根目录下的 .babelrc 文件读取配置。.babelrc 是一个 JSON 格式的文件，内容大致如下：
```
{
  "plugins": [
    [
      "transform-runtime",
      {
        "polyfill": false
      }
    ]
   ],
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ],
    "stage-2",
    "react"
  ]
}
```

### Plugins

  plugins 属性告诉 Babel 要使用哪些插件，插件可以控制如何转换代码。

  以上配置文件里的 transform-runtime 对应的插件全名叫做 babel-plugin-transform-runtime，即在前面加上了 babel-plugin-，要让 Babel 正常运行我们必须先安装它：
  npm i -D babel-plugin-transform-runtime

  babel-plugin-transform-runtime 是 Babel 官方提供的一个插件，作用是减少冗余代码。 Babel 在把 ES6 代码转换成 ES5 代码时通常需要一些 ES5 写的辅助函数来完成新语法的实现，例如在转换 class extent 语法时会在转换后的 ES5 代码里注入 _extent 辅助函数用于实现继承：
```
  function _extent(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

```
这会导致每个使用了 class extent 语法的文件都被注入重复的_extent 辅助函数代码，babel-plugin-transform-runtime 的作用在于不把辅助函数内容注入到文件里，而是注入一条导入语句：
```
var _extent = require('babel-runtime/helpers/_extent');
```
这样能减小 Babel 编译出来的代码的文件大小。


### Presets  
presets 属性告诉 Babel 要转换的源码使用了哪些新的语法特性，一个 Presets 对一组新语法特性提供支持，多个 Presets 可以叠加。 Presets 其实是一组 Plugins 的集合，每一个 Plugin 完成一个新语法的转换工作。  
分类：
1. 已经被写入 ECMAScript 标准里的特性，
2. 被社区提出来的但还未被写入 ECMAScript 标准里特性
3. 为了支持一些特定应用场景下的语法，和 ECMAScript 标准没有关系，例如 babel-preset-react 是为了支持 React 开发中的 JSX 语法。

### webpack 接入 Babel
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
    ]
  },
  // 输出 source-map 方便直接调试 ES6 源码
  devtool: 'source-map'
};
```
---
## 3-2 使用 TypeScript 语言

TypeScript 官方提供了能把 TypeScript 转换成 JavaScript 的编译器。 你需要在当前项目根目录下新建一个用于配置编译选项的 tsconfig.json 文件，编译器默认会读取和使用这个文件，配置文件内容大致如下：

```
{
  "compilerOptions": {
    "module": "commonjs", // 编译出的代码采用的模块规范
    "target": "es5", // 编译出的代码采用 ES 的哪个版本
    "sourceMap": true // 输出 Source Map 方便调试
  },
  "exclude": [ // 不编译这些目录里的文件
    "node_modules"
  ]
}
```

通过 npm install -g typescript 安装编译器到全局后，你可以通过 tsc hello.ts 命令编译出 hello.js 和 hello.js.map 文件。

### 减少代码冗余
TypeScript 编译器会有和在 3-1 使用ES6语言中 Babel 一样的问题：在把 ES6 语法转换成 ES5 语法时需要注入辅助函数， 为了不让同样的辅助函数重复的出现在多个文件中，可以开启 TypeScript 编译器的 importHelpers 选项，修改 tsconfig.json 文件如下：
```
{
  "compilerOptions": {
    "importHelpers": true
  }
}
```
该选项的原理和 Babel 中介绍的 babel-plugin-transform-runtime 非常类似，会把辅助函数换成如下导入语句：
```
var _tslib = require('tslib');
_tslib._extend(target);
```
这会导致编译出的代码依赖 tslib 这个迷你库，但避免了代码冗余.

### 集成 Webpack
要让 Webpack 支持 TypeScript，需要解决以下2个问题：
1. 通过 Loader 把 TypeScript 转换成 JavaScript。
2. Webpack 在寻找模块对应的文件时需要尝试 ts 后缀。  

对于问题1，社区已经出现了几个可用的 Loader，推荐速度更快的 awesome-typescript-loader。    
对于问题2，根据2-4 Resolve 中的 extensions 我们需要修改默认的 resolve.extensions 配置项。

```
const path = require('path');

module.exports = {
  // 执行入口文件
  entry: './main',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    // 先尝试 ts 后缀的 TypeScript 源码文件
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  devtool: 'source-map',// 输出 Source Map 方便在浏览器里调试 TypeScript 代码
};
```

## 3-3 使用 Flow 检查器
- todo
## 3-4 使用 SCSS 语言
- todo
## 3-5 使用 PostCSS
- todo
## 3-6 使用 React 框架
JSX 语法是无法在任何现有的 JavaScript 引擎中运行的，所以在构建过程中需要把源码转换成可以运行的代码，例如：
```
// 原 JSX 语法代码
return <h1>Hello,Webpack</h1>

// 被转换成正常的 JavaScript 代码
return React.createElement('h1', null, 'Hello,Webpack')
```

### React 与 Babel
