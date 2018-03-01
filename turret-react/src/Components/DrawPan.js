'use strict'
import React, { Component } from 'react';
import Resource from '../config/Resource';
import jQueryRotate from '../module/jQueryRotate';
import drawLottery from '../module/drawLottery';
import { connect } from 'react-redux'

const imgReq = require.context("../assets/images", true, /^\.\/.*\.png||.jpg||.mp4$/);

import Tool from '../module/Tool';
import { cgUserData } from '../redux/actions'

var look = false;

class DrawPan extends Component {
    constructor(props) {
        super(props);

    }
    initDraw() {
        var self = this;
        var { chance, sharereward, isLottoEnd } = this.props;
        ////单次点击锁定
        if(!look){
            look = true;
            if(chance == 0 && isLottoEnd!=1){
                //未分享显示分享
                if(sharereward==0){
                    this.props.dispatch(cgUserData({
                        showPop: true,
                        show_sharePop: true
                    }));
                    look = false;
                    return false;
                }
                //已分享提示次数没了
                this.props.dispatch(cgUserData({
                    showPop: true,
                    show_timesOverPop: true
                }));
                look = false;
                return false;
            };
        
            Tool.ajaxget(Resource.AjaxUrls.lotto, 'POST', "json", {}, function(data){
                //修改剩余抽奖次数
                self.props.dispatch(cgUserData({
                    chance: chance-1,
                    lottoIndex: data.info.item_pos,
                    lottoId: data.info.item_id,
                    lottoName: data.info.item_name,
                    lottoType: data.info.item_type
                }))
                ///（36*data.info.item_pos）中间值+6 -2
                let over = 36*data.info.item_pos+ 6;
                let under = 36*data.info.item_pos-2;

                //let Angle = parseInt(Math.random()*(over-under+1) + under);
                let Angle = 36*data.info.item_pos;
                console.log("第"+(1+data.info.item_pos)+"个奖品");

                let lotter = new drawLottery({
                    type:'circle',
                    pointerId: $('#pan-zhen'),
                    prizeAngle: Angle,
                    duration: 6000,
                    circles: 6,
                    //'easing':$.easing.easeOutSine,
                    StateCallBack:function(_this){
                        //console.log(_this);
                        //console.log('开始');
                    },
                    OverCallBack:function(_this){
                        //出结果，提示用户
                        self.props.dispatch(cgUserData({
                            showPop: true,
                            show_succPop: true
                        }));
                        look = false;
                    }
                });
                lotter.start();
            },function(dd){
                alert(dd.msg);
                look = false;
            })
        }
    }
    render() {
        return (
            <div className="DrawPan" id="DrawPan">  
              <img className="pan" src={Resource.imgReq(Resource.htmlImgs.pan)} id="pan" />
              <img className="pan-zhen" src={Resource.imgReq(Resource.htmlImgs.panZhen)} id="pan-zhen" onClick={this.initDraw.bind(this)} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
       isLottoEnd: state.userData.isLottoEnd,
       sharereward: state.userData.sharereward,
       chance: state.userData.chance
  }
}

const ConnectedDrawPan = connect(mapStateToProps)(DrawPan)

export default ConnectedDrawPan