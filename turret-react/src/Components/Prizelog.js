'use strict'
import React, { Component } from 'react';
import { Router, Route, hashHistory, Link} from 'react-router';
import { connect } from 'react-redux'
import Resource from '../config/Resource';
import Tool from '../module/Tool';

import { cgUserData } from '../redux/actions'

class Prizelog extends Component {
    constructor(props) {
        super(props);

        this.getListData();
    }
    //将要插入dom
    componentWillMount(){
    }
    //已经插入dom
    componentDidMount() {
    }
    getListData(){
        var self = this;
        Tool.ajaxget(Resource.AjaxUrls.prizelog, 'GET', "json", {}, function(data){
            self.props.dispatch(cgUserData({
                prizelogs: data.list
            }))
            ////添加滚动
            self.createScrollLoad(self, '#p_list', '', Resource.AjaxUrls.prizelog, {})
        });
    }
    ///先请求服务器数据
    getSelectData(){
        var self = this;
        
        Tool.ajaxget(Resource.AjaxUrls.zonelist, 'GET', "json", {}, function(data){
            self.props.dispatch(cgUserData({
                serverList: data.list,
                showPop: true,
                show_serverPop: true
            }))
        });
    }
    doBind(){
        var { accountname, show_bind } = this.props;
        //判断是否登陆
        if(accountname!=""){
            //未绑定
            if(!show_bind){
                ///先请求服务器和角色数据
                this.getSelectData();
                //弹出绑定窗口
                this.props.dispatch(cgUserData({
                    showPop: true,
                    show_serverPop: true
                }))
                return false;
            }
        }else{
            //未登陆
            this.props.dispatch(cgUserData({
                showPop: true,
                show_loginPop: true
            }))
            return false;
        }
        /////
        return true;
    }
    //领取
    lingqu(logid, event){
        var self = this;
        var _target = event.target;
        //判断返回值
        if(this.doBind()){
            //只有确认才会去领取
            self.props.dispatch(cgUserData({
                showPop: true,
                show_confirmPop: true,
                _data: {target: _target, logid: logid}
            }))
        };
    }
    render() {
        var self = this;
        var {charname, zonename, accountname, isLogin, show_bind, show_cgbind, prizelogs, serverList, roleList} = this.props;

        return (
            <div className="page Prize">
                <Link to="/index" className="backBtn" title="index" />
                <div className="tit"></div>
                <div className="p_list" id="p_list">
                    <ul>
                        {prizelogs.map(x=>{
                            return (
                                <li data-id={x.id}>
                                    <div className="txt">{x.item_name}</div>
                                    <div className="im">
                                        <img src={x.item_pic} alt=""/>
                                    </div>
                                    {x.reward_status==1? (<div className="bb"><a href="javascript:;" className="btn getBtn hide" title="已领取" ></a></div>): (<div className="bb"><a href="javascript:;" className="btn getBtn" title="领取" onClick={self.lingqu.bind(self, x.id)}></a></div>)}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="userBind">
                    <div className={isLogin? "btn bindBtn": "btn bindBtn on"} onClick={this.doBind.bind(this)} ref="bindBtn">
                        <p className="t">立即绑定</p>
                        <p className="t1">领取奖品，请先绑定游戏账号，选择角色</p>
                    </div>
                    {/*绑定的展示*/}
                    <div className={isLogin? "u_box su_box on": "u_box su_box"} ref="sbindBox">
                        <a href="javascript:;" className="loginOut" onClick={()=>{
                            this.props.dispatch(cgUserData({
                                showPop: true,
                                show_loginPop: true
                            }))
                        }}>切换账号</a>
                        <a href="javascript:;" className={(charname=="")? "roleOut": "roleOut on"} onClick={()=>{
                            ///先请求服务器和角色数据
                            this.getSelectData();
                            this.props.dispatch(cgUserData({
                                showPop: true,
                                show_serverPop: true,
                                _zoneid: 0,
                                _charid: 0
                            }))
                        }}>切换角色</a>
                        <ul onClick={this.doBind.bind(this)}>
                            <li><span className="n">账 号：</span><p className="t">{accountname}</p></li>
                            <li className="s">
                                <span className="n">服务器：</span>
                                <p className="t">{zonename}</p>
                            </li>
                            <li className="s">
                                <span className="n">角色名：</span>
                                <p className="t">{charname}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
    //新闻列表页面和视频列表页 添加无限滚动
    createScrollLoad(self, box, parentbox, url, ops, callback) {
        
        var self = this;
        // 加载flag
        var _off = true;
        // 最多可加载的页数
        var over = false;
        //当前页数
        var pageIdx = 2;
        var boxdom = $(box);
        if (!!parentbox) {
            var parentbox = $(parentbox);
        } else {
            var parentbox = boxdom;
        };
        var ops = ops;
        //加载的序号
        var lastIndex = parentbox.children('ul').children().length;
        // 注册'infinite'事件处理函数
        var boxHeight = boxdom[0].clientHeight;
        var boxbodyHeight = boxdom[0].scrollHeight;
        var st = 0;
        var space = 20;
        var timer = null,
            timers = null,
            ht = "";

        ///插入加载结构
        /*var ht = $('<div class="scroll-preloader" style="">加载中...</div>');
        parentbox.children('.scroll-preloader').remove();
        parentbox.append(ht);*/

        boxdom.off();
        boxdom.on('scroll', function() {
            boxbodyHeight = boxdom[0].scrollHeight;
            st = this.scrollTop;
            if ((boxHeight + st) >= (boxbodyHeight - space)) {
                if (_off) {
                    _off = false;
                    if (over) return false;
                    //console.log(page1);
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        
                        doload();
                    }, 200);

                };
            }
        });

        function doload() {
            ops.page = pageIdx;
            //只有滚动后第一次才会插入内容
            
            if(pageIdx==2){
                ///插入加载结构
                ht = $('<div class="scroll-preloader" style="">加载中...</div>');
                parentbox.children('.scroll-preloader').remove();
                parentbox.append(ht);
                ht.show();
            }
            //类型，第几页，当前是第几条请求，模版id
            Tool.ajaxget(url, 'GET', 'json', ops, function(data) {
                
                doplay(data.list);
            });
            // 模拟1s的加载过程
            function doplay(data) {
                //内容已经请求完毕
                if (data.length < 1) {
                    //隐藏加载
                    ht.html('没有更多了');
                    over = true;
                    boxdom.off();
                    return false;
                };
                var prizelogs = self.props.prizelogs;
                // 新增数组
                self.props.dispatch(cgUserData({
                    prizelogs: prizelogs.concat(data)
                }))
                pageIdx++;
                // 重置加载flag
                _off = true;
            };
        };
    }
}


const mapStateToProps = (state) => {
  return {
       isLogin: state.userData.isLogin,
       charname: state.userData.charname,
       zonename: state.userData.zonename,
       accountname: state.userData.accountname,
       show_bind: state.userData.show_bind,
       show_cgbind: state.userData.show_cgbind,
       prizelogs: state.userData.prizelogs,
       serverList: state.userData.serverList,
       roleList: state.userData.roleList,
       zoneid: state.userData.zoneid,
       charid: state.userData.charid
  }
}

const ConnectedPrizelog = connect(mapStateToProps)(Prizelog)


export default ConnectedPrizelog