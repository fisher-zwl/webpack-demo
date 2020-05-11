const path = require('path');

module.exports = {
  // source-map 在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度；一般可用于生产环境
  // cheap-module-source-map不带列映射的map,提高了打包速度，开发者工具调试不方便；
  // eval-source-map可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患,建议用到开发环境
  // cheap-module-eval-source-map打包速度最快，没有映射列，同时拥有cheap-module-source-map和eval-source-map相似缺点
  // devtool: 'eval-source-map', // 生成Source Maps,需要配置devTool
  entry:  __dirname + "/src/main.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  },
  // 构建本地服务器，可监听代码的修改
  devServer: {
    port: 9000, // 服务端口
    contentBase: path.join(__dirname, '/public'),//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html, 比如404
    inline: true, // 设置为true，当源文件改变时会自动刷新页面
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
  }
}