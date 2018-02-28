"use strict";
cc._RFpush(module, 'ac9fdFyp49GVKHUgk9/FVli', 'Basket');
// script\Basket.js

cc.Class({
    'extends': cc.Component,

    properties: {
        line: cc.Node,
        left: cc.Node,
        right: cc.Node,
        linePre: cc.Prefab,
        count: cc.Label,
        backetMove: cc.p(0, 0),
        //篮筐移动的时间
        moveTimes: 0
    },

    init: function init(game) {
        this.game = game;
        this.state = false;
        this._createMaskLine();
        //不使用定时控制
        this._doMoveAnim();
    },

    startMove: function startMove() {
        this._doMoveAnim();
    },

    stopMove: function stopMove() {
        this.node.stopAllActions();
        this._resetPosition();
    },

    _resetPosition: function _resetPosition() {
        this.node.setPositionX(0);
    },

    // 篮筐移动动画
    _doMoveAnim: function _doMoveAnim() {
        var self = this;
        var moveRight = cc.moveBy(self.moveTimes, cc.p(self.backetMove.x, 0));
        var moveLeft = cc.moveBy(self.moveTimes, cc.p(self.backetMove.y, 0));

        var repeat = cc.repeatForever(cc.sequence(moveRight, moveLeft, moveLeft, moveRight));
        this.node.runAction(repeat);
    },

    // 创建篮筐遮罩
    _createMaskLine: function _createMaskLine() {
        this.linePreNode = cc.instantiate(this.linePre);
        this.game.node.addChild(this.linePreNode);
        this.state = true;

        // 修改遮罩位置，先进行坐标转换       
        /*var worldPot = this.node.convertToWorldSpaceAR(this.line.getPosition());
        var nodePot = this.node.parent.convertToNodeSpaceAR(worldPot);
        //设置栏网的位置
        this.linePreNode.setPosition(cc.p(this.node.x-3, nodePot.y));*/
    },

    // 切换篮筐遮罩层级
    switchMaskLineShow: function switchMaskLineShow(flag) {
        if (flag) {
            this.linePreNode.setLocalZOrder(100);
        } else {
            this.linePreNode.setLocalZOrder(1);
        }
    },

    // 球网动画
    playNetAnim: function playNetAnim() {
        if (this.linePreNode) {
            var scaleLong = cc.scaleTo(0.1, 1, 1.1);
            var scaleShort = cc.scaleTo(0.3, 1, 0.9);
            var scaleNomal = cc.scaleTo(0.2, 1, 1);

            var anim = cc.sequence(scaleLong, scaleShort, scaleNomal);
            this.linePreNode.getChildByName('net').runAction(anim);
        }
    },
    //篮筐在位移的时候才执行定位
    update: function update(dt) {
        if (this.line) {}
        // 修改遮罩位置，先进行坐标转换       
        var worldPot = this.node.convertToWorldSpaceAR(this.line.getPosition());
        var nodePot = this.node.parent.parent.convertToNodeSpaceAR(worldPot);
        //设置栏网的位置
        //this.linePreNode.setPosition(cc.p(this.node.x-3, nodePot.y));
        //在元素创建成功的情况下
        if (!this.state) {
            return false;
        };
        this.linePreNode.setPosition(cc.p(this.node.x - 3, nodePot.y));
    }
});

cc._RFpop();