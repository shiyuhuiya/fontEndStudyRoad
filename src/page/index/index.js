import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; // 第三方下拉选择组件
import domtoimage from "dom-to-image"; // 将 DOM 转换为图片（如下载图像）
import Switch from "rc-switch"; // 开关控件,一个组件就是一个包?
import "rc-switch/assets/index.css"; // rc-switch 样式
import drawRoadmap from "./drawRoadmap"; // 自定义函数：绘制路线图
import * as roadMap from "./roadmap"; // 导入所有阶段数据（JSON 对象）
import "./style.css"; // 当前页面样式文件

const options = [
  { value: "all", label: "完整路线", canvasHeight: 5000 },
  { value: "p1", label: "👶🏻 阶段1", canvasHeight: 2000 },
  { value: "p2", label: "👦🏻 阶段2", canvasHeight: 3000 },
  { value: "p3", label: "👨🏻 阶段3", canvasHeight: 2000 },
  //   { value: "p10000", label: "👴🏻 养生路线" },  // 这个也挺重要的，哈哈！(手动狗头
];

function Index() {
  const navigate = useNavigate();

  const [process, setProcess] = useState(options[0]);
  // const [height, setHeight] = useState(options[0].canvasHeight);
  const [showTag, setShowTag] = useState(true);

  useEffect(() => {
    // 使用 drawRoadmap 函数绘制当前阶段的路线图
    const canvas = drawRoadmap(`roadmapCanvas`, roadMap[process.value], showTag);
    
    // 监听 Canvas 上的点击事件，用于跳转到对应的 Markdown 页面
    const canvasMouseDownHandler = (options) => {
      if (options.target && options.target.link) {
        window.__GO_TO_MARKDOWN__ = true;
        navigate(`/guide${options.target.link}`); // 跳转至对应路径
      }
    };

    canvas.on("mouse:down", canvasMouseDownHandler); // 注册监听器

    return () => {
      canvas.off("mouse:down", canvasMouseDownHandler); // 清除监听器，防止内存泄漏
    };
  }, [process, showTag, navigate]);

  const onShowTag = useCallback((value) => {
    setShowTag(value);
  }, []);
  
  //点击下载路线图,这个函数就会被触发
  const onDownloadImg = useCallback(() => {
    const $el = document.querySelector(".roadmap"); // 获取整个路线图容器,不只是canvas
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

  return (
    <div className="roadmap-container">
      <div className="process-select-container">
        <div className="tag-switch">
          <span>展示标签</span>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            defaultChecked
            onChange={onShowTag}
          />
        </div>
        <Select
          options={options}
          defaultValue={options[0]}
          onChange={setProcess}
          placeholder="请选择"
          className="process-select"
        />
        <div className="download" onClick={onDownloadImg}>
          下载路线图
        </div>
      </div>

      <div className="roadmap">
        {showTag && (
          <div className="desc-container">
            <div className="explain-square">
              <div className="explain-content">
                <div>
                  1.{" "}
                  <span role="img" aria-label="recommend">
                    ⭐️
                  </span>{" "}
                  - 推荐使用
                </div>
                <div>
                  2.{" "}
                  <span role="img" aria-label="prepare">
                    ✅
                  </span>{" "}
                  - 备选方案
                </div>
                <div>
                  3.{" "}
                  <span role="img" aria-label="no recommend">
                    ❎
                  </span>{" "}
                  - 不推荐学习（技术已过时或其他原因）
                </div>
                <div>
                  4.
                  <span className="grey-card">xxxx</span> - 需要时再学
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <canvas id={`roadmapCanvas`} height="5000px" width="1000px" />
        </div>
      </div>
    </div>
  );
}

export default Index;
