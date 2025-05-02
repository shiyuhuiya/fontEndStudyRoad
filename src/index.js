import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route,Routes } from "react-router-dom";
import './App.css';
import Index from './page/index';
import Guide from './page/guide';
import Header from './components/header'
// serviceWorker.js文件有2个命名导出，通过这样的导入方式作用就是导入所有的命名导出，并收集为一个对象
// import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Header />
    <Router>
    {/* Routes注册的地方，就是一级路由出口，这个项目中只有一级路由 */}
      <Routes>
       <Route exact path="/" element={<Index />} />
       {/* 动态路由传参 */}
       <Route path="/guide/:query" element={<Guide />} />
      </Routes>
    </Router>
  </>
);
// If you want your app to work offline（离线） and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
