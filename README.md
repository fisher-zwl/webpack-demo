# Webpack配置详解
#### 配置详解
```javascript
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
  // source-map 在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度；一般可用于生产环境
  // cheap-module-source-map不带列映射的map,提高了打包速度，开发者工具调试不方便；
  // eval-source-map可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患,建议用到开发环境
  // cheap-module-eval-source-map打包速度最快，没有映射列，同时拥有cheap-module-source-map和eval-source-map相似缺点
  // devtool: 'eval-source-map', // 生成Source Maps,需要配置devTool

  entry:  __dirname + "/src/main.js",//已多次提及的唯一入口文件
  output: {
    path: path.resolve(__dirname, './dist'),//打包后的文件存放的地方
    // filename: "bundle.js"//打包后输出文件的文件名
    filename: "bundle-[hash].js", // 内容改变，名称相应改变, 添加了哈希值
  },
  // 插件配置，webpack强大的插件机制
  plugins: [ // 数组里每一项都是一个要使用的 Plugin 的实例，Plugin 需要的参数通过构造函数传入
    new webpack.BannerPlugin('版权所有，翻版必究'), // 版权声明插件
    // 依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html
    // 注：在每次生成的js文件名称不同时非常有用（比如添加了hash值）
    new HtmlWebpackPlugin({
      template: __dirname + "/src/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
    }),
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    //   chunkFilename: '[id].css',
    // }),

    // 所有页面都会用到的公共代码提取到 common 代码块中
    // new CommonsChunkPlugin({
    //   name: 'common',
    //   chunks: ['a', 'b']
    // }),
  ],
  // 构建本地服务器，可监听代码的修改
  devServer: {
    port: 9000, // 服务端口
    contentBase: path.join(__dirname, '/dist'),//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html, 比如404
    inline: true, // 内联模式，设置为true，一段处理实时重载的脚本将被插入你的包（bundle）中，并且自动构建消息将会出现到浏览器控制台，即自动刷新页面内容

    //必须有 webpack.HotModuleReplacementPlugin 才能完全启用 HMR。如果 webpack 或 webpack-dev-server 是通过 --hot 选项启动的，那么这个插件会被自动添加，
    // 所以你可能不需要把它添加到 webpack.config.js 中。关于更多信息，请查看 HMR 概念 页面
    hot: true, // 模块热替换，

    overlay: { errors: true }, // 出现编译器错误或警告时，在浏览器中显示全屏覆盖层
  },
  module: { // 配置如何处理模块
     // 配置模块的读取和解析规则，通常用来配置 Loader。其类型是一个数组，数组里每一项都描述了如何去处理部分文件
    rules: [ // 创建模块时，匹配请求的规则数组
      {
        test: /(\.jsx|\.js)$/, // Rule.test 是 Rule.resource.test 的简写,资源校验，这里是检测jsx和js文件
        use: { // 每个入口(entry)指定使用一个 loader。
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/env", "@babel/react"
            ]
          }
        },
        // 排除 node_modules 目录下的文件
        exclude: path.resolve(__dirname, 'node_modules'), // 也可以是路径数组 数组里的每项之间是或的关系，即文件路径符合数组中的任何一个条件就会被命中
      },
      {
        test: /\.css$/,
        use: [ // 下面俩者可把样式表嵌入webpack打包后的JS文件
          {
              loader: "style-loader" // css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能
          }, 
          {
            loader: "css-loader", // style-loader将所有的计算后的样式加入页面中
            options: {
              // 被称为CSS modules的技术意在把JS的模块化思想带入CSS中来，通过CSS模块，所有的类名，动画名默认都只作用于当前模块
              // 这里的配置可以直接把CSS的类名传递到组件的代码中，这样做有效避免了全局污染
              modules: true, // 指定启用css modules
              // localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      }
    ]
  },
  // 插件配置，webpack强大的插件机制
  plugins: [ // 数组里每一项都是一个要使用的 Plugin 的实例，Plugin 需要的参数通过构造函数传入
    new webpack.BannerPlugin('版权所有，翻版必究'), // 版权声明插件
    // 依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html
    // 注：在每次生成的js文件名称不同时非常有用（比如添加了hash值）
    new HtmlWebpackPlugin({
      template: __dirname + "/src/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
    }),

    new CleanWebpackPlugin(),

    // 加快开发速度 原理：
    // 1、保留在完全重新加载页面期间丢失的应用程序状态。
    // 2、只更新变更内容，以节省宝贵的开发时间。
    // 3、在源代码中对 CSS/JS 进行修改，会立刻在浏览器中进行更新
    new webpack.HotModuleReplacementPlugin()//热加载插件
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    //   chunkFilename: '[id].css',
    // }),

    // 所有页面都会用到的公共代码提取到 common 代码块中
    // new CommonsChunkPlugin({
    //   name: 'common',
    //   chunks: ['a', 'b']
    // }),
  ],
}
```
