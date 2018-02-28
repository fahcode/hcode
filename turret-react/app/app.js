'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {createHashHistory, useBasename} from 'history'
import { Router, Route, hashHistory, Link, IndexRoute, Redirect, useRouterHistory} from 'react-router';
//import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { syncHistory, routeReducer } from 'redux-simple-router'

import Style from "../css/index.scss";
// 所有创建 store 的具体代码在 ./Redux.js 中
import reducerss from './reducerss'
const req = require.context("../images", true, /^\.\/.*\.png$/);

import Home from './Components/Home'
import Index from './Components/Index'
import Info from './Components/Info'
import Prizelog from './Components/Prizelog'


const reduxRouterMiddleware = syncHistory(hashHistory)
//添加中间件
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware)(createStore)
//创建store
const store = createStoreWithMiddleware(reducerss)
// Required for replaying actions from devtools to work 
//reduxRouterMiddleware.listenForReplays(store)

/////////////分段加载导致页面加载卡顿，所以去掉分段加载
/*路由设置*/ 
/*let prizelog = {
    path: '/prizelog',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require("./Components/Prizelog").default)
        }, "Prizelog")
    }
}
let Info = {
    path: '/info',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require("./Components/Info").default)
        }, "Info")
    }
}

let indexRoute = {
    path: '/index',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require("./Components/Index").default)
        }, "Index")
    }
}


let rootRoute = {
  path: '/',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require("./Components/Home").default)
    }, "Home")
  },
  indexRoute: indexRoute,
  childRoutes: [
    indexRoute,
    prizelog,
    Info
  ]
}



ReactDOM.render((
  <Provider store={store}>
      <Router 
        history={hashHistory}
        routes={rootRoute}
      />
  </Provider>
), document.getElementById('app'));*/


ReactDOM.render((
  <Provider store={store}>
      <Router history={hashHistory}> 
        <Route path="/" component={Home}>
          <IndexRoute component={Index}/>
          <Route path="index" component={Index}/>
          <Route path="info" component={Info}/>
          <Route path="prizelog" component={Prizelog}/>
        </Route>
      </Router>
  </Provider>
), document.getElementById('app'));

//////////////添加assign方法兼容
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}