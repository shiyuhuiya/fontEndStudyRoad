import React, { useEffect } from "react";
import {useNavigate, useParams } from "react-router-dom";
import "./style.css";

export default function Guide() {
  let { query } = useParams();
  const navigate = useNavigate();
  
  // 简单处理: router => detail page set scrollTop
  useEffect(() => {
    // 每次组件加载都滚动到页面顶部
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    //将所有a标签设置为在新页面打开
    Array.from(document.getElementsByTagName("a")).forEach((el) => {
      el.setAttribute("target", "_blank");
    });
  }, [query]);

  return (
    <div className="guide-container">
      <div className="go-home" onClick={()=>{navigate(-1)}}>
        <span>{"<- 返回"}</span>
      </div>
      <>
        <Markdown />
        <div className="go-github-edit">
          <a
            href={`https://github.com/ObjTube/front-end-roadmap/edit/master/src/page/guide/md/${query}.md`}
          >
            想要补充，点击这里
            <span role="img" aria-label="cool">
              📝
            </span>
          </a>
        </div>
        <div className="github-contributors">
          <div className="github-contributors-title">贡献人员</div>
          <div className="github-contributors-info">
          贡献人员不见了
          </div>
        </div>
      </>
    </div>
  );
}


function Markdown() {
  // <Route path="/guide/:query" element={<Guide />} />
  let { query } = useParams();
  const Content = require(`./md/${query}.md`);
  // markdown-loader 返回的是一个模块对象（Module），而不是纯字符串！
  return <div dangerouslySetInnerHTML={{ __html: Content.default }} />;
}
