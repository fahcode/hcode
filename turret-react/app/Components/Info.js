'use strict'
import React, { Component } from 'react';
import { Router, Route, hashHistory, Link} from 'react-router';
import Resource from '../Resource';
import Tool from '../Tool';


class Info extends Component {
    constructor(props) {
        super(props);
    }
    //将要插入dom
    componentWillMount(){
    }
    //已经插入dom
    componentDidMount() {
        //console.log('App did mount');
    }
    render() {
        return (
            <div className="page Info">
                <Link to="/index" className="backBtn" title="index" />
                <Link to="/index" className="closeInfo" title="index" />
                <div className="wrap_line">
                    <p className="tit"></p>
                    <ul className="txts">
                        <li>
                            <span className="n">活动时间</span>
                            <p className="t">10月1日-10月8日</p>
                        </li>
                        <li>
                            <span className="n">活动规则</span>
                            <p className="t">1. 大转盘每天可启动一次，分享朋友圈当天可再获得一次转动机会；<br/>2. 在“我的奖品”栏中，须绑定巨人通行证，并选择服务器及角色才能领取奖励；<br/>3. 领取奖品后，玩家可至游戏内十方镇NPC“姜乐儿”处查收奖品；<br/>4. 1个巨人通行证只能绑定1个微信号进行领奖；<br/>5. 本次活动的最终解释权归《仙侠世界2》运营团队所有。
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}


export default Info