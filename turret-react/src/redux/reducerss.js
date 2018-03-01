'use strict'

import { createStore, combineReducers, applyMiddleware } from 'redux'
//中间件
//import promiseMiddleware from './promise-middleware'


///合并多个 reducer
var initialTimeState = {
  isLogin: false,
  isLottoEnd: 0,
  //0未分享，1已分享
  sharereward: 0,
  chance: 0,
  //绑定的角色名
  charname: "",
  zonename: "",
  //绑定的通行证账号名
  accountname: "",
  //邀请链接
  inviteurl: "http://xx2.ztgame.com/act/zp/index.php",
  showPop: false,
  show_loginPop: false,
  show_regPop: false,
  show_serverPop: false,
  show_succRgPop: false,
  show_npcPop: false,
  show_timesOverPop: false,
  show_succPop: false,
  show_sharePop: false,
  show_confirmPop: false,

  //奖品位置索引
  lottoIndex: 0,
  //物品id
  lottoId: 0,
  //物品名称
  lottoName: "",
  //物品类型
  lottoType: 0,

  //显示已经的绑定
  show_bind: false,

  prizelogs: [],
  serverList: [],
  zoneid: 0,
  //临时变量
  _zoneid: 0,
  roleList: [{charid: 0, charname: "选择角色"}],
  charid: 0,
  //临时变量
  _charid: 0,
  //当前操作的对象
  _data: {},


  //注册链接，线上的
  regUrl: "http://reg.ztgame.com/fast?source=xx2_site&regtype=phone&alerttype=1&returntype=1&returnurl=f1e80feafceca9e6789e7cdd1fb9d60283ea295aeb6d5c202d1c6a5d9f6e4c4c81321c8a5b4e9eee0657c4c5dd08407e&cssurl=f1e80feafceca9e6789e7cdd1fb9d60283ea295aeb6d5c204a8d5caf94119d0446bdcdb9d749173f21ec95d37614af0d&sign=9268797963bfccd4d3f43fdcf1ec606a",
  //登陆链接
  loginUrl: "/act/zp/api.php?a=login"
}

let reData ={
  showPop: false,
  show_loginPop: false,
  show_regPop: false,
  show_serverPop: false,
  show_succRgPop: false,
  show_npcPop: false,
  show_timesOverPop: false,
  show_succPop: false,
  show_sharePop: false,
  show_confirmPop: false
}

//用户数据
const userData = (state=initialTimeState, action)=>{
    switch(action.type){
        case "CG":
          return Object.assign({}, state, reData, action.data);

        default: 
          return state
    }
}


var reducer = combineReducers({
  userData
})


export default reducer;
/*export default function(data) {
    //合并多个reducers 对象
  var reducer = combineReducers(reducers)
  //添加中间件
  var finalCreateStore = applyMiddleware(promiseMiddleware)(createStore)
  //createStore store
  var store = finalCreateStore(reducer, data)

  return store
}
*/


