# 本地化部署前端学习路线

## 涉及到的知识点

* react语法

  * useCallback
  * useParams
  * ......

* react自定义Webpack配置

* 将md文件转化成html文件

* 基于 Fabric.js 的前端绘图组件，用于在 Canvas 上绘制一个 技术路线图

* canvas api：比如监听canvas上的点击事件

* 将 DOM 转换为图片（如下载图像）

  ```js
  import domtoimage from "dom-to-image"; // 将 DOM 转换为图片（如下载图像）
  const onDownloadImg = useCallback(() => {
    const $el = document.querySelector(".roadmap"); // 获取整个路线图容器
    const downloadName = process.label
      .replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") // 移除表情符号
      .trim();
    // 使用 domtoimage 将 DOM 转换为 JPEG 图像并下载
    domtoimage.toJpeg($el).then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = `roadmap-${downloadName}.jpeg`;
      link.href = dataUrl;
      link.click();
    });
  }, [process]);
  ```

* server-worker

## 所学

### 琐碎的东西

* `npm i `下载包，寻找的是lock文件中指定的具体版本的包

* `package.json`文件中指定的包，只会给出包的最小版本，只参考这个文件可能下载的还是较新的包

* 删除`lock`文件，执行`npm i` ，又会出现新的`lock`文件

  |                        场景                        |          依赖版本选择依据          | 是否更新 `package-lock.json` |
  | :------------------------------------------------: | :--------------------------------: | :--------------------------: |
  |  **首次安装（npm i ）**（无 `package-lock.json`）  |   根据 `package.json` 的版本范围   | 是，生成 `package-lock.json` |
  |       **常规安装**（有 `package-lock.json`）       |     严格按 `package-lock.json`     |              否              |
  | **手动升级依赖**（如 `npm install package@x.y.z`） |         强制覆盖为指定版本         | 是，更新 `package-lock.json` |
  |               **使用 `npm update`**                | 根据 `package.json` 的版本范围更新 | 是，更新 `package-lock.json` |

* 在react项目中，可以通过在`package.json`中的`homepage`字段指定基础路径：

  ```json
  {
    "homepage": "/front-end-roadmap/",
    ...
  }
  ```

  你设置了这个字段后，Create React App (CRA) 会自动调整所有静态资源（如 JavaScript、CSS 文件等）的引用路径，以确保它们相对于该基础路径正确加载。

* 如果起初把整个项目代码交给git仓库管理，并添加了提交记录（commits），添加了远程仓库，并push了几次，建立了连接，后续只想让打包后文件交给git管理，此时只需要剪切`.git`文件到打包后的文件的根目录下就好了，然后执行`git add .`，`git commit`，`git push`

* window api，滚动到指定位置：

  ```js
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  ```

* 只在某个路由组件使用的普通组件，可以直接在这个路由组件内部定义，比如`guide`组件中的`MarkDown`组件。

* `document.getElementsByTagName("a")` 返回的是一个 **HTMLCollection**，它是一个 **类数组对象**（不是真正的数组），可以使用索引访问，也有length属性，**但是不能调用数组的上的方法**，比如`forEach`。这些方法是定义在 `Array.prototype` 上的，而类数组对象通常缺乏这些原型方法。

  ```js
  console.log(links[0]); // 第一个 <a> 元素
  console.log(links.length); // 所有 <a> 元素的数量
  ```

* `import * as serviceWorker from './serviceWorker'`，**导入所有命名导出，并收集为serviceWorker对象**

### config-overrides.js

`config-overrides.js` 文件通常用于在 `Create React App (CRA) `项目中自定义` Webpack` 配置，而无需 `eject`，通过使用 `react-app-rewired` 和` customize-cra` 这两个工具，你可以在不直接修改` CRA` 内部配置的情况下扩展或覆盖默认的 Webpack 设置。

```js
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
        loader: "markdown-loader",//先调用这个
      },
    ],
  })
);
```

上述配置的意义在于将md文件转化成html文件

```jsx
function Markdown() {
  let { query } = useParams();
  const Content = require(`./md/${query}.md`);
  // markdown-loader 返回的是一个模块对象（Module），而不是纯字符串！
  return <div dangerouslySetInnerHTML={{ __html: Content.default }} />;
}
```
