'use strict'
import React, { Component } from 'react';
import { Router, Route, hashHistory, Link} from 'react-router';
import { connect } from 'react-redux'
import Resource from '../Resource';
import Tool from '../Tool';
import jQueryRotate from '../jQueryRotate';
import drawLottery from '../drawLottery';

import { cgUserData } from '../actions'

class Pops extends Component {
    constructor(props) {
        super(props);

    }
    closePop(){
        let show_succPop = this.props.show_succPop;
        /////关闭弹窗，如果次数奖品弹窗是显示的，则关闭后重置弹窗
        if(show_succPop){
            let lotter2 = new drawLottery({
                type:'circle',
                pointerId: $('#pan-zhen'),
                prizeAngle: 0,
                duration: 500,
                circles: 1,
                //'easing':$.easing.easeOutSine,
                StateCallBack:function(_this){
                },
                OverCallBack:function(_this){
                    //console.log('重置')
                }
            });
            lotter2.start();
        }
        this.props.dispatch(cgUserData({
            showPop: false
        }))
    }
    submitFn(){
        var self = this;
        var { _zoneid, _charid } = this.props;
        //console.log(zoneid);
        //console.log(charid);
        if(_zoneid==0||_charid==0){
            alert('请选择服务器和角色！');
            return false;
        }
        Tool.ajaxget(Resource.AjaxUrls.charbind, 'GET', "json", {zoneid: _zoneid, charid: _charid}, function(data){
            //绑定
            self.props.dispatch(cgUserData({
                show_bind: true,
                showPop: false,
                charname: data.charname,
                zonename: data.zonename,
                //保存当前绑定
                zoneid: _zoneid,
                charid: _charid
            }))
        }, function(dd){
            alert(dd.msg);
        });
    }
    getRoleList(e){
        var self = this;
        let _zoneid = e.target.value;

        var old = [{charid: 0, charname: "选择角色"}];

        if(_zoneid==0) {
            //重置角色列表
            self.props.dispatch(cgUserData({
                roleList: old,
                showPop: true,
                show_serverPop: true
            }))
            return false;
        };
        //保存当前选中的值
        self.props.dispatch(cgUserData({
            _zoneid: _zoneid,
            _charid: 0,
            roleList: old,
            showPop: true,
            show_serverPop: true
        }))
        
        Tool.ajaxget(Resource.AjaxUrls.charlist, 'GET', "json", {zoneid: _zoneid}, function(data){
            self.props.dispatch(cgUserData({
                roleList: old.concat(data.list),
                //默认第一个选中
                //charid: ((data.list.length>=1)? (data.list[0].charid): 0),
                showPop: true,
                show_serverPop: true
            }))
        });
    }
    surelingqu(){
        var self = this;
        var { accountname,zonename,charname, zoneid, charid, logid, _data } = this.props;
        Tool.ajaxget(Resource.AjaxUrls.getprize, 'GET', "json", {logid: _data.logid, zoneid: zoneid, charid: charid}, function(data){
            //按钮置灰
            _data.target.className = _data.target.className + " hide";
            self.props.dispatch(cgUserData({
                showPop: false,
                show_confirmPop: false
            }))
            alert(data.msg);
        }, function(dd){
            alert(dd.msg)
        });
    }
    render() {
        var { accountname,zonename,charname,lottoName, showPop, show_loginPop,show_regPop,show_serverPop,show_succRgPop,show_npcPop,show_timesOverPop,show_succPop,show_sharePop,show_confirmPop, regUrl,loginUrl, serverList, roleList } = this.props;
        var shareTips = Resource.htmlImgs.shareTips;
        //判断使用的分享提示图片
        if(lottoName!="") shareTips = Resource.htmlImgs.shareTips1;

        return (
            <div className={showPop? 'Pops on': 'Pops'} ref="Pops">
                <div className="popbg" onClick={this.closePop.bind(this)}></div>
                {/*登陆弹窗*/}
                <div className={show_loginPop? 'pop loginPop on': 'pop loginPop'} id="loginPop" ref="loginPop">
                    <a href="javascript:;" className="closePop" onClick={this.closePop.bind(this)}></a>
                    <p className="tit">登录</p>
                    <a href="javascript:;" className="btn loginBtn" onClick={()=>(
                        this.props.dispatch(cgUserData({
                            showPop: true,
                            show_regPop: true
                        }))
                    )}>注册</a>
                    <div className="iframeBox">
                        <iframe src={loginUrl} frameborder="0" allowtransparency="true" scrolling="no" width="100%" height="100%"></iframe>
                    </div>
                </div>
                {/*注册弹窗*/}
                <div className={show_regPop? 'pop registerPop on': 'pop registerPop'} id="registerPop" ref="registerPop">
                    <a href="javascript:;" className="closePop" onClick={this.closePop.bind(this)}></a>
                    <p className="tit">注册</p>
                    <a href="javascript:;" className="btn loginBtn" onClick={()=>(
                        this.props.dispatch(cgUserData({
                            showPop: true,
                            show_loginPop: true
                        }))
                    )}>登录</a>
                    <div className="iframeBox">
                        <iframe src={regUrl} frameborder="0" allowtransparency="true" scrolling="no" width="100%" height="100%" id="regUrl"></iframe>
                    </div>
                </div>
                {/*选择服务器*/}
                <div className={show_serverPop? 'pop serverPop on': 'pop serverPop'} id="serverPop" ref="serverPop" >
                    <a href="javascript:;" className="closePop" onClick={this.closePop.bind(this)}></a>
                    <div className="from">
                        <ul>
                            <li><select name="" id="serv" onChange={this.getRoleList.bind(this)}>
                                <option value="0">选择服务器</option>
                                {serverList.map(x=>{
                                    return (<option value={x.zoneid}>{x.zonename}</option>)
                                })}
                            </select></li>
                            <li><select name="" id="rolev" onChange={(e)=>{
                                this.props.dispatch(cgUserData({
                                    _charid: e.target.value,
                                    showPop: true,
                                    show_serverPop: true
                                }))
                            }}>
                                {
                                    roleList.map((x, index)=>{
                                        return (<option value={x.charid}>{x.charname}</option>)
                                    })
                                }
                            </select></li>
                        </ul>
                        <button className="submitBnt" onClick={this.submitFn.bind(this)}>确定</button>
                    </div>
                </div>
                {/*完成注册*/}
                <div className={show_succRgPop? 'pop tipsPop succRgPop on': 'pop tipsPop succRgPop'} id="succRgPop" ref="succRgPop" >
                    <a href="javascript:;" className="closePop" onClick={this.closePop.bind(this)}></a>
                    <p className="tit">恭喜您已完成注册</p>
                    <p className="t">请至电脑端官网（xianxia2.com)下载游戏，并创建角色，再来领取！</p>
                </div>
                {/*npc*/}
                <div className={show_npcPop? 'pop tipsPop npcPop on': 'pop tipsPop npcPop'} id="npcPop" ref="npcPop" >
                    <a href="javascript:;" className="closePop" onClick={this.closePop.bind(this)}></a>
                    <p className="t">亲爱的<span className="userName">{accountname}</span>：<br/>您的奖品已发送至您填写的游戏角色下，请登录游戏，在十方镇<em>NPC（姜乐儿）</em>处查收，谢谢~</p>
                </div>
                {/*次数用完*/}
                <div className={show_timesOverPop? 'pop tipsPop timesOverPop on': 'pop tipsPop timesOverPop'} id="timesOverPop" ref="timesOverPop" >
                    <a href="javascript:;" className="closePop" onClick={this.closePop.bind(this)}></a>
                    <p className="t">今日次数已用完<br/>请明日再来</p>
                </div>
                {/*二次确认是否领取*/}
                <div className={show_confirmPop? 'pop tipsPop confirmPop on': 'pop tipsPop confirmPop'} id="confirmPop" ref="confirmPop" >
                    <a href="javascript:;" className="closePop" onClick={this.closePop.bind(this)}></a>
                    <p className="t">确认领取到&quot;{zonename}&quot;下的&quot;{charname }&quot;角色里吗?</p>
                    <div className="btns">
                        <a href="javascript:;" className="btn closeBtn" onClick={this.closePop.bind(this)}>取消</a>
                        <a href="javascript:;" className="btn sureBtn" onClick={this.surelingqu.bind(this)}>确认</a>
                    </div>
                </div>
                {/*恭喜弹窗*/}
                <div className={show_succPop? 'pop succPop on': 'pop succPop'} id="succPop" ref="succPop">
                    <a href="javascript:;" className="closePop" onClick={this.closePop.bind(this)}></a>
                    <p className="t">您已获得<span id="rs_pz">{lottoName}</span><br/>请至“我的奖品”栏中领取</p>
                </div>
                {/*分享弹窗*/}
                <div className={show_sharePop? 'pop sharePop on': 'pop sharePop'} id="sharePop" ref="sharePop" onClick={this.closePop.bind(this)}>
                    <img src={Resource.imgReq(shareTips)} alt="shareTips"/>
                    <p className={(lottoName=="")? "t": "t on"}>您已获得<span id="rs_pz">{lottoName}</span>,请至“我的奖品”栏中领取</p>
                    <p className={(lottoName!="")? "t": "t on"}>今日次数已用完</p>
                    <p className="tips">立即分享朋友圈，可再启动一次转盘</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.userData.isLogin,
    accountname: state.userData.accountname,
    charname: state.userData.charname,
    zonename: state.userData.zonename,
    lottoName: state.userData.lottoName,
    showPop: state.userData.showPop,
    show_loginPop: state.userData.show_loginPop,
    show_regPop: state.userData.show_regPop,
    show_serverPop: state.userData.show_serverPop,
    show_succRgPop: state.userData.show_succRgPop,
    show_npcPop: state.userData.show_npcPop,
    show_timesOverPop: state.userData.show_timesOverPop,
    show_succPop: state.userData.show_succPop,
    show_sharePop: state.userData.show_sharePop,
    show_confirmPop: state.userData.show_confirmPop,
    regUrl: state.userData.regUrl,
    loginUrl: state.userData.loginUrl,
    serverList: state.userData.serverList,
    roleList: state.userData.roleList,
    logid: state.userData.logid,
    zoneid: state.userData.zoneid,
    _zoneid: state.userData._zoneid,
    charid: state.userData.charid,
    _charid: state.userData._charid,
    _data: state.userData._data
  }
}

const ConnectedPops = connect(mapStateToProps)(Pops)

export default ConnectedPops