## 老项目分析
### 技术栈
该项目是一个采用 React + TypeScript + Dva + Craco 技术栈构建的后台管理系统。
- React 是一个开源的 JavaScript 库，用于构建用户界面。
- TypeScript 是一种强类型的 JavaScript 编程语言，具有更好的代码组织和编译错误提示。
- Dva 是一个基于 React 和 Redux 的应用框架，用于管理应用状态和数据流。
- Cra 是React的官网推荐的脚手架，内部集成了webpack。
- Craco 是一个 Create React App 的配置加载器，可以轻松扩展和修改项目中webpack的配置。

node版本: 14.10.1    
react-scripts版本: 4.0.3  
webpack版本: 4.4.22  
craco版本: 6.1.1

### 目前存在的问题
- 启动项目慢，300s～360s
- 热更新慢，10s～30s
- 打包时间久 8min～9min
- 部署时间久 20min

### 改造方案
 #### **方案一：webpack优化**
 使用optimization.splitChunks方式优化webpack
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b4c2885d42544d5909e844b5daafddd~tplv-k3u1fbpfcp-watermark.image?)
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01ef513e2cd0481d9de973b221998d5b~tplv-k3u1fbpfcp-watermark.image?)

![P3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3152a908765b40ef9efba6257cb54175~tplv-k3u1fbpfcp-watermark.image?)
虽然打包体积变小了很多，但是构建时间并未有明显的减少。
 
 #### **方案二：webpack升级**
 
  目前的项目中的webpack4是依赖于cra脚手架中的react-script包的，而一些额外的配置是在craco包完成的，要想升级到webpack5需要先将craco和react-script升级到最新版本。我在尝试升级到最新版本过程中，在craco社区发现其中讨论vite有很多，其中有一句话让我记忆颇深```Vite may be the future, but Webpack is the present.```可见就算webpack升级到webpack5，在未来也难与vite争锋。
 
#### **方案三：webpack转vite**  
数据对比

|              |  webpack   |     vite     |
|  ----        |  ----      |     ----     |
| 项目启动时间   | 300s～360s |       10s    |
| 热更新时间     | 10s～30s   |       3s     |
| 打包大小      | 41.6MB      |     11.3MB   |
| 打包时间      |  8min～9min |   3min～4min  |

## webpack转vite

### 1. 安装vite
```
// 老项目的node版本14.10.1,vite版本应该在3.0以内
npm install vite@2.9.15 -D
// 安装react插件
npm install @vitejs/plugin-react@1.0.8 -D
```
### 2. 根目录下新建vite.config.ts
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
})
```
### 3. src/index.js 修改
 src/index.js 修改成 src/main.js

### 4. 入口文件修改
- 把 public/index.html 移动到项目根目录，把文件中的 %PUBLIC_URL% 去掉
- 在index.html中引入main.ts
```
 <script type="module" src="/src/main.js"></script>
```
### 5. 修改package.json脚手架启动方式
修改前：
```
...
    "build": "npm run build:dev",
    "build:dev": "cross-env REACT_APP_ENV=dev GENERATE_SOURCEMAP=false craco build",
    "build:pre": "cross-env REACT_APP_ENV=pre GENERATE_SOURCEMAP=false craco build",
    "build:view": "cross-env GENERATE_SOURCEMAP=false REACT_APP_ENV=pre ANALYZER=true craco build",
    "start": "npm run start:dev",
    "dev": "npm run start",
    "start:dev": "cross-env REACT_APP_ENV=dev craco start",
    "start:pre": "cross-env REACT_APP_ENV=pre craco start"
...
 ```
修改后：
```
...

    "build": "npm run build:dev",
    "build:dev": "cross-env REACT_APP_ENV=dev GENERATE_SOURCEMAP=false vite build ",
    "build:pre": "cross-env REACT_APP_ENV=pre GENERATE_SOURCEMAP=false vite  build",
    "build:view": "cross-env GENERATE_SOURCEMAP=false REACT_APP_ENV=pre ANALYZER=true vite build",
    "start": "npm run start:dev",
    "dev": "npm run start",
    "start:dev": "cross-env REACT_APP_ENV=dev vite",
    "start:pre": "cross-env REACT_APP_ENV=pre vite",
...
 ```
 ### 6. 配置别名
 报错：**Failed to resolve import "@/config" from "src/main.ts". Does the file exist?**   
 原因：未配置别名   
 修改vite.config.ts
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    // 路径相关配置项
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: 'src',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
    extensions: ['.js', '.json', '.ts', '.tsx', '.jsx', '.less'],
  },
})
```

### 7. 报错**The JSX syntax extension is not currently enabled**
报错：**The JSX syntax extension is not currently enabled**  
原因：项目中存在大量的js文件，jsx文件，ts文件，tsx文件，旧的js文件中可能存在jsx语法，所以报错。  
解决方案：  
    方案一：[社区找到的高赞方法](https://github.com/vitejs/vite/discussions/3448)   
    方案二：https://juejin.cn/post/7018128782225571853  
    方案三：将报错的js修改成jsx  
 其中方案一：会在之后的运行中报错。详情见我提的这个[discussions](https://github.com/vitejs/vite/discussions/11951)
 
 这里更推荐方案三
### 8. 报错**Internal server error: '~antd/lib/style/themes/default.less' wasn't found.**
报错：**Internal server error: '~antd/lib/style/themes/default.less' wasn't found.**  
原因: 无法识别～符号  
解决方案： [issues](https://github.com/ant-design/pro-components/issues/4880#top)
```
 css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^~/, 
        replacement: '',
      },
    ],
  }
```

### 9. 报错**ReferenceError: global is not defined.**
报错：**ReferenceError: global is not defined.**    
原因: 未找到global  
解决方案：  
在入口文件index.html中添加
```
<script>
    if(!window.global){
      window.global = window
    }
</script>
```

### 10. 报错**Uncaught ReferenceError: require is not defined.** 
报错：**Uncaught ReferenceError: require is not defined.**    
原因: vite不支持require语法  
解决方案： [csdn](https://blog.csdn.net/m0_51431448/article/details/124398609?spm=1001.2101.3001.6650.5&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-5-124398609-blog-124843043.pc_relevant_multi_platform_whitelistv6&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-5-124398609-blog-124843043.pc_relevant_multi_platform_whitelistv6&utm_relevant_index=6)   
```
npm i vite-plugin-require-transform -D
```
```
 // vite.config.ts
import requireTransform from 'vite-plugin-require-transform'
  ...
   plugins: [
      requireTransform({
        fileRegex: /src\/.*\.[tj]sx?$/,
      }),
    ]
```

### 11. 报错**React is not defined**
报错：**Uncaught ReferenceError: require is not defined.**    
原因: 项目中有些地方未导入react
解决方案：
```
npm i @rollup/plugin-inject -D
```
 ```
 // vite.config.ts
import inject from '@rollup/plugin-inject'
  ...
  plugins: [
    inject({
      React: 'react',
      include: /src\/.*\.[tj]sx?$/,
    }),
  ],
```


### 12.报错**regeneratorRuntime is not defined**
报错：**regeneratorRuntime is not defined**      
原因: regeneratorRuntime is not defined 这个报错表面上是由于 async function 语法被 babel 转译之后的代码使用了 regeneratorRuntime 这个变量，但是这个变量在最终的代码里未定义造成的报错。  
解决方案：[issues](https://github.com/vitejs/vite/issues/10497)
```
npm i --save regenerator-runtime
```
```
// src/main.tsx中导入
import 'regenerator-runtime/runtime.js'
```

---
到此为止项目中没有报错，可以正常运行了。  

打包成功后大小对比：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0d0489a5d8240338e5dc837bbd7e531~tplv-k3u1fbpfcp-watermark.image?)