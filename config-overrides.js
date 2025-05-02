/**
 * /* config-overrides.js
 *
 * @format
 */
// config-overrides.js 文件通常用于在 Create React App (CRA) 项目中自定义 Webpack 配置，而无需 eject
// 通过使用 react-app-rewired 和 customize-cra 这两个工具，
// 你可以在不直接修改 CRA 内部配置的情况下扩展或覆盖默认的 Webpack 设置。

const { override, addWebpackModuleRule } = require("customize-cra");

module.exports = override(
  addWebpackModuleRule({
    // 这里的正则表达式匹配所有以 .md 结尾的文件（包括没有扩展名但实际上是 Markdown 格式的文件）。
    // 匹配以 .m 或 .md 结尾的字符串
    test: /\.md?$/,
    use: [
      {
        loader: "html-loader",
      },
      {
        loader: "markdown-loader",
      },
    ],
  })
);
