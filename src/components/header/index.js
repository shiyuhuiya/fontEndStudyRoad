import React from "react";
import LOGO from "../../assets/logo.jpeg";
export default function Header() {
  return (
    <div className="header">
      <div className="top">
        <img
          src={LOGO}
          alt="logo"
          onClick={() => {
            // 点击跳转到首页
            window.location.href = "/";
          }}
        />
      </div>
      <div className="title">
        <span className="text">
          前端学习路线
          <span className="emoji">
            <span role="img" aria-label="line">🧶</span>
            <span role="img" aria-label="road">🦌</span>
          </span>
        </span>
      </div>
      <div className="sub-title">
        <span role="img" aria-label="workholic">👨🏻‍💻</span>
        好好学习，天天敲代码
        <span role="img" aria-label="workholic">👨🏻‍💻</span>
      </div>
    </div>
  );
}
