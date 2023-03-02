### Rollup、Esbuild区别
Rollup 和 Esbuild 都是 JavaScript 模块打包器，它们的作用是将多个 JavaScript 模块合并成一个或多个文件。它们的区别如下：

Rollup 是一款比较成熟的模块打包器，它支持多种 JavaScript 模块规范，包括 CommonJS、AMD、ES6 等等。Rollup 的主要特点是支持 Tree Shaking，可以去除无用代码，生成更小的文件。

Esbuild 是一个新兴的模块打包器，它主要的特点是速度非常快，比 Rollup 和 Webpack 快得多。Esbuild 的特点是采用 Go 语言编写，具有非常高的并发性能，可以快速地将 JavaScript 模块打包成一个或多个文件。

Rollup 支持插件机制，可以通过插件扩展其功能。它的插件库非常丰富，支持多种插件，例如 Babel、Typescript、PostCSS 等等。

Esbuild 的功能相对来说比较简单，只支持基本的 JavaScript 模块打包功能，不支持插件扩展。但是它的速度非常快，可以快速地将 JavaScript 模块打包成一个或多个文件，可以用来构建大型的前端项目。

综上所述，Rollup 和 Esbuild 在功能和特点上有一些区别，可以根据具体的需求选择合适的模块打包器。如果需要支持多种 JavaScript 模块规范和插件扩展，可以选择 Rollup；如果追求速度和简单的打包功能，可以选择 Esbuild。

### vite是怎么集成 Rollup和Esbuild的 

Vite 在开发模式下使用 Esbuild，而在生产模式下使用 Rollup。

在开发模式下，Vite 通过 Esbuild 构建代码。Esbuild 具有非常快的编译速度，可以实现即时编译，并提供了 HMR 功能，可以在修改代码后快速重新加载。同时，由于 Esbuild 采用 Go 语言编写，具有非常高的并发性能，可以快速地进行代码打包。

在生产模式下，Vite 通过 Rollup 进行代码打包。Rollup 具有很好的 Tree Shaking 功能，可以去除无用代码，生成更小的文件。同时，Rollup 也支持多种插件，可以通过插件扩展其功能。

Vite集成Esbuild和Rollup的具体实现是通过内部的插件机制来实现的。Vite在内部集成了Esbuild和Rollup的相关插件，并通过这些插件来实现对应的构建功能。例如，在开发模式下，Vite会使用@vitejs/plugin-vue插件来解析Vue单文件组件，并使用@vitejs/plugin-legacy插件来实现ES5的转换和兼容性处理。而在生产模式下，Vite会使用@vitejs/plugin-legacy插件来生成ES5的代码，使用rollup-plugin-terser插件来压缩代码等等。

总之，Vite的集成方式是通过内部的插件机制来实现的，这也是Vite可以快速切换不同打包工具的一个重要原因。由于内部插件的灵活性和可扩展性，我们可以通过编写自定义插件来满足我们项目中的特定需求，这也是Vite所具有的一个优势。