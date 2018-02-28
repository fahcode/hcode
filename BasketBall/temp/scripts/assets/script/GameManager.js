"use strict";
cc._RFpush(module, '7b066H36KxCVr0SNDZka91/', 'GameManager');
// script\GameManager.js

var Basket = require('Basket');
var Ball = require('Ball');
var Shadow = require('Shadow');
var Score = require('Score');
var SoundManager = require('SoundManager');
var TimeManager = require('TimeManager');
//var shootControl = require('shootControl');
var animShoot = require('animShoot');
var Global = require('Global');

cc.Class({
    'extends': cc.Component,

    properties: {
        ball: cc.Prefab,
        shadow: cc.Prefab,
        basket: Basket,
        startPosition: cc.Vec2,
        score: Score,
        soundMng: SoundManager,
        timeMng: TimeManager,
        //投篮动画对象
        shootAnim: animShoot,
        //点击按钮控制发球
        shootBtn: cc.Node,
        //打球人物
        people: cc.Node,
        overLayer: cc.Node,
        proBar: cc.ProgressBar,
        //弹窗分数
        overPop: cc.Label
    },

    onLoad: function onLoad() {
        //初始化
        this.init();
        //创建篮球
        this.newBall();

        this.basket.init(this);
        this.score.init(this);
        this.timeMng.init(this);

        //初始化碰撞系统
        this.initCollisionSys();
        //不通过此方法判断
        //this.timeMng.oneSchedule();
        this.score.setScore(0);

        Global.W_GAME_STATE = Global.R_GAME_STATE.NORMAL;
    },
    init: function init() {
        this.ballComp = null,
        //计时
        this.time_i = 1;

        this.ballBox = this.people.getChildByName('ballBox');
        this.dribble = this.people.getChildByName('dribble');
        this.shoot = this.people.getChildByName('shoot');

        this.ballPool = new cc.NodePool();
        //在两个对象池创建2个对象
        for (var i = 0; i < 3; i++) {
            this.ballPool.put(cc.instantiate(this.ball));
        };

        this.enableInput(true, this.shootBtn);
        //初始化发射控制按钮
        this.shootBtnControl();
    },
    // 初始化碰撞系统
    initCollisionSys: function initCollisionSys() {
        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        //this.collisionManager.enabledDebugDraw = true// 开启debug绘制

        cc.director.setDisplayStats(true);
    },

    // 生成篮球
    newBall: function newBall() {
        /*if(cc.pool.hasObject(Ball)){
            child = cc.pool.getFromPool(Ball).node;
        }else{
            child = cc.instantiate(this.ball);
        }*/
        this.ballComp = this.ballPool.get();

        //child.setLocalZOrder(1);
        this.ballBox.addChild(this.ballComp);
        //this.node.addChild(this.ballComp);

        this.ballComp.setPosition(this.startPosition);

        this.people.setLocalZOrder(100);
        this.ballComp.setLocalZOrder(100);

        this.ballComp.active = false;

        //this.ballComp = child.getComponent('Ball');
        this.ballComp.getComponent('Ball').init(this); // 启动篮球逻辑
        //去掉影子
        //this.newShadow(ballComp);
    },

    newShadow: function newShadow(ball) {
        var ballShadow = null;
        if (cc.pool.hasObject(Shadow)) {
            ballShadow = cc.pool.getFromPool(Shadow).node;
        } else {
            ballShadow = cc.instantiate(this.shadow);
        }

        ballShadow.setLocalZOrder(2);
        this.node.addChild(ballShadow);
        ballShadow.setPosition(this.startPosition);
        var shadowComp = ballShadow.getComponent('Shadow');
        ball.bindShadow(shadowComp);
        shadowComp.init(this); // 启动影子逻辑
    },
    shootBtnControl: function shootBtnControl() {
        var self = this;

        var began, ended;
        //计数器
        function cur_() {
            self.time_i++;
        };
        // 注册事件监听
        self.shootBtn.on('touchstart', function (event) {
            self.time_i = 1;
            //开始计数
            self.schedule(cur_, 0.1);
            return true;
        });
        self.shootBtn.on('touchend', function (event) {
            //暂停计数
            self.unschedule(cur_);
            //此时禁用按钮
            self.enableInput(false, self.shootBtn);
            //传递当前计数器
            cc.log(self.time_i);
            //初始化投篮动画
            self.shootAnim.init(self.ballComp.getComponent('Ball'), self.time_i);

            //隐藏当前运球人物，先手投篮动作
            var anim1 = self.dribble.getComponent(cc.Animation);
            anim1.stop();
            self.dribble.active = false;
            self.shoot.active = true;
            var anim2 = self.shoot.getComponent(cc.Animation);
            anim2.play('shoot');
        });
    },
    startMoveBasket: function startMoveBasket() {
        this.basket.startMove();
    },

    stopMoveBasket: function stopMoveBasket() {
        this.basket.stopMove();
    },
    // 控制事件是否生效
    enableInput: function enableInput(enable, node_) {
        if (enable) {
            cc.eventManager.resumeTarget(node_);
        } else {
            cc.eventManager.pauseTarget(node_);
        }
    },
    //水管，回收
    desPipe: function desPipe(node) {
        this.ballPool.put(node);
    },
    // 游戏结束
    gameOver: function gameOver() {
        cc.log('结束了哦！');
        //此时禁用按钮
        this.enableInput(false, this.shootBtn);
        //恢复篮网层级
        //this.basket.switchMaskLineShow(false);
        //暂停所有动画
        //cc.director.stopAllActions();
        //设置弹窗分数
        this.overPop.string = "比赛结束，你的得分是" + Global.SCORE + "，恭喜获得《街篮》限量礼包，点击领取解锁游戏更多内容，分享至朋友圈还可邀请好友一起比拼！";
        this.overLayer.active = true;
    },
    startGame: function startGame() {
        cc.director.loadScene('menu');
    }

});

cc._RFpop();