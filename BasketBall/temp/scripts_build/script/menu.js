"use strict";
cc._RFpush(module, 'd58d3cbxspEVqX93Tf3MS3X', 'menu');
// script\menu.js

cc.Class({
    'extends': cc.Component,

    properties: {
        backet: cc.Node,
        people: cc.Node,
        slogan: cc.Node,
        startBtn: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.playGame();
        this.animas();
    },
    //触发按钮开始游戏
    playGame: function playGame() {
        //this.node.on('clcik',function(eve){
        cc.director.loadScene('Game');

        //}.bind(this));
    },
    animas: function animas() {
        //
        var self = this;
        var backetXY = cc.p(this.backet.width / 2 - cc.winSize.width / 2, this.backet.y);
        var sloganXY = cc.p(this.slogan.x, this.slogan.y);
        var startBtnXY = cc.p(this.startBtn.x, this.startBtn.y);

        this.backet.x = -this.backet.width / 2 - cc.winSize.width / 2;
        this.slogan.x = this.slogan.width / 2 + cc.winSize.width / 2;
        this.startBtn.y = -this.startBtn.height / 2 - cc.winSize.height / 2;

        // 左边进入
        var leftIn = cc.moveTo(0.5, cc.p(backetXY.x, backetXY.y)).easing(cc.easeCubicActionIn());
        //右边进入
        var rightIn = cc.moveTo(0.5, cc.p(sloganXY.x, sloganXY.y)).easing(cc.easeCubicActionIn());
        //底下往上
        var bottomIn = cc.moveTo(0.3, cc.p(startBtnXY.x, startBtnXY.y)).easing(cc.easeCubicActionIn());

        var callback2 = cc.callFunc(function () {
            self.startBtn.runAction(bottomIn);
        }, this);

        var callback1 = cc.callFunc(function () {
            var anim2 = cc.sequence(rightIn, callback2);
            this.slogan.runAction(anim2);
        }, this);

        var anim1 = cc.sequence(leftIn, callback1);

        this.backet.runAction(anim1);
    },
    // 控制事件是否生效
    enableInput: function enableInput(enable) {
        if (enable) {
            cc.eventManager.resumeTarget(this.node);
        } else {
            cc.eventManager.pauseTarget(this.node);
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();