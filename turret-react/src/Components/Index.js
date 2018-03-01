'use strict'
import React, { Component } from 'react';
import { Router, Route, hashHistory, Link} from 'react-router';
import { connect } from 'react-redux'
import 'whatwg-fetch'

import Resource from '../config/Resource';
import Tool from '../module/Tool';
import DrawPan from './DrawPan';

import { cgUserData } from '../redux/actions'

class Index extends Component {
    constructor(props) {
        super(props);
    }
    //将要插入dom
    componentWillMount(){

    }
    prizelog(){
        //切换到列表
        hashHistory.push("/prizelog");
    }
    render() {
        var { chance } = this.props;

        return (
            <div className="page Index">
                <div className="slogan">
                    <img src={Resource.imgReq(Resource.htmlImgs.slogan)} alt="slogan"/>
                </div>
                <div className="times">今日剩余<span>{chance}</span>次</div>
                <DrawPan />
                <div className="people"></div>
                <div className="i_btns">
                    <Link to="/info" className="btn b_info" title="活动详情">活动详情</Link>
                    <a href="javascript:;" className="btn b_prize"title="我的奖品" onClick={this.prizelog.bind(this)}>我的奖品</a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
       chance: state.userData.chance
  }
}

const ConnectedIndex = connect(mapStateToProps)(Index)

export default ConnectedIndex
