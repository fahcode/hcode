'use strict'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import Tool from '../Tool';

import Pops from './Pops';
import Resource from '../Resource';

import { cgUserData } from '../actions'


class Home extends Component {
    constructor(props) {
        super(props);

        this.fetchInitData();
        this.state = {
            refs: {}
        }
    }
    //将要插入dom
    componentWillMount(){
        var self = this;
        let { regUrl, loginUrl } = this.props;
        //登陆回调loginBack(1, msg, isFirst);
        window.loginBack = function(dd){

            //重置url
            self.props.dispatch(cgUserData({
                showPop: false,
                loginUrl: loginUrl+ "&t="+ Math.random()
            }));

            
            if(dd.status != 1){
                alert(dd.msg);
                return false;
            }
            //console.log('登陆成功！')
            self.fetchInitData();
            
            //显示弹窗
            self.doBind();
        }
        window.regBack = function(dd){
            //重置
            self.props.dispatch(cgUserData({
                showPop: false,
                //regUrl: regUrl+ "&t="+ Math.random()
            }));
            $('#regUrl').attr('src', regUrl);

            if(dd.status != 1){
                alert(dd.msg);
                return false;
            }
            //console.log('注册成功！')
            self.fetchInitData();
        }
        ///////修改测试环境注册地址
        if(window.location.href.indexOf('.web.') != -1){
            self.props.dispatch(cgUserData({
                regUrl: Resource.AjaxUrls.test_regUrl
            }));
        }
    }
    //已经插入dom
    componentDidMount() {
        //设置宽高
        Tool.setWinHei();
        this.weixin();
    }
    //将要更新
    componentWillUpdate(prevProps, prevState) {
        //console.log('App Will receive props');
    }
    //更新完成
    componentDidUpdate(prevProps, prevState) {
        //console.log('更新完成');
    }
    //将要移出真实 DOM
    componentWillUnmount(){

    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        //console.log('App Will receive props');
    }
    //组件判断是否重新渲染时调用
    /*shouldComponentUpdate(){

    }*/
    //获取初始化数据
    fetchInitData(){
        var self = this;
        Tool.ajaxget(Resource.AjaxUrls.userinfo, 'GET', "json", {}, function(data){
            //修改剩余抽奖次数
            self.props.dispatch(cgUserData({
                sharereward: data.info.sharereward,
                chance: data.info.chance,
                charname: data.info.charname,
                zonename: data.info.zonename,
                accountname: data.info.accountname,
                isLogin: (data.info.accountname!=""? true: false),
                isLottoEnd: data.info.isLottoEnd,
                
                inviteurl: data.info.inviteurl,
                zoneid: data.info.zoneid,
                charid: data.info.charid,
                //是否已绑定账号
                show_bind: (data.info.charname!=""? true: false)
            }))
            

        }, function(dd){
            //微信授权
            /*if(dd.status == -10){
                window.location.href = Resource.AjaxUrls.wxauth;
            }*/
            //通行证账号未绑定
            if(dd.status == -20){
                self.props.dispatch(cgUserData({
                    showPop: true,
                    show_loginPop: true
                }))
            }
        })
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
    weixin(shareDesc){
        var self = this;
        var chance = self.props.chance,
            inviteurl = self.props.inviteurl;

        var shareImg = Resource.htmlImgs.shareImg;
        requirejs(["weixin/main"], function(weixin) {
            //与当前域名、公共号对应的appid，必须有效。
            var appid = 'wx0fcf7f47419c8171';
            //wx对像就基本等同于官方的weixin对像，包含所有官网api
            var wx = new weixin(appid,function(){
                //朋友圈 全境飞行，仙侠巨作。《仙侠世界2》线上福利连发8天！国庆就要乐~
                wx.onMenuShareTimeline({
                    title: '《仙侠世界2》百万宝珠、灵魂宝石、紫装礼包 领取处！ 国庆连领8天，不要停~', // 分享标题
                    link: inviteurl, // 分享链接
                    imgUrl: shareImg, // 分享图标
                    success: function () {
                        //console.log('分享给朋友圈');
                        chance = self.props.chance;
                        Tool.ajaxget(Resource.AjaxUrls.shareback, 'GET', "json", {type: 1}, function(data){
                            self.props.dispatch(cgUserData({
                                chance: chance+1,
                                sharereward: 1
                            }));
                        })
                    },
                    cancel: function () {
                        chance = self.props.chance;
                        Tool.ajaxget(Resource.AjaxUrls.shareback, 'GET', "json", {type: 1, cancel: 1}, function(data){
                            self.props.dispatch(cgUserData({
                                chance: chance+1,
                                sharereward: 1
                            }));
                        })
                    }
                });
                //朋友
                wx.onMenuShareAppMessage({
                    title: '《仙侠世界2》百万宝珠、灵魂宝石、紫装礼包 领取处', // 分享标题
                    //desc: '我是' + window.qsResult.res + "，你，有多少战斗力？", // 分享描述
                    desc: "国庆连领8天，不要停~",
                    link: inviteurl, // 分享链接
                    imgUrl: shareImg, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        //console.log('分享给朋友')
                        chance = self.props.chance;
                        Tool.ajaxget(Resource.AjaxUrls.shareback, 'GET', "json", {type: 2}, function(data){
                            self.props.dispatch(cgUserData({
                                chance: chance+1,
                                sharereward: 1
                            }));
                        })
                    },
                    cancel: function () {
                        chance = self.props.chance;
                        // 用户取消分享后执行的回调函数
                        Tool.ajaxget(Resource.AjaxUrls.shareback, 'GET', "json", {type: 2, cancel: 1}, function(data){
                            self.props.dispatch(cgUserData({
                                chance: chance+1,
                                sharereward: 1
                            }));
                        })
                    }
                });
            });
        });
    }
    render() {
        /*let childrenDom = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                //把父组件的props.name赋值给每个子组件
                Parent: this.state.refs
            })
        });*/
        
        return (
            <div className="views" id="setWinHei" ref="views">
                <div className="pages" id="pages" >  
                  {this.props.children}
                </div>
                <Pops ref="_Pops" Parent={this.state.refs}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.userData.isLogin,
    sharereward: state.userData.sharereward,
    chance: state.userData.chance,
    accountname: state.userData.accountname,
    show_loginPop: state.userData.show_loginPop,
    show_regPop: state.userData.show_regPop,
    show_bind: state.userData.show_bind,
    regUrl: state.userData.regUrl,
    loginUrl: state.userData.loginUrl
  }
}

const ConnectedHome = connect(mapStateToProps)(Home)

export default ConnectedHome