"use strict";
cc._RFpush(module, '05d6195d99B06zz0IIi6csv', 'Ball');
// script\Ball.js

var TouchStatus = cc.Enum({
    BEGEN: -1, // 按下
    ENDED: -1, // 结束
    CANCEL: -1 // 取消
});

var BallStatus = cc.Enum({
    FLY: -1, // 飞
    DOWN: -1, // 落
    NONE: -1 // 静止
});
var Global = require('Global');

cc.Class({
    'extends': cc.Component,

    properties: {
        emitSpeed: 0, // 发射速度
        gravity: 0, // 重力速度
        scale: 0, // 缩放系数
        showTime: 0, // 生成篮球显示动画时间
        ballRatio: 0, // 球弹力，
        //篮球在x轴的偏移速度
        ballSpeedX: cc.p(0, 0)
    },

    init: function init(game) {
        this.game = game;
        //this.registerInput();

        //this.showAnim();
        // 是否进球了
        this.valid = false;
        this.time_i = 0;
        this.status = TouchStatus.CANCEL;
        this.currentHorSpeed = 0;
        this.currentVerSpeed = 0;
        this.target = cc.p(0, 0);
        this.node.setScale(1);
        this.node.rotation = 0;
        this.hitIn = false;
        this.dribble = this.game.people.getChildByName('dribble');
        this.shoot = this.game.people.getChildByName('shoot');
    },

    // 显示篮球
    showAnim: function showAnim() {
        //设置篮球初始位置
        //this.game.people.node.x
        this.node.opacity = 0;
        var fade = cc.fadeIn(this.showTime);
        this.node.runAction(fade);
    },

    // 注册事件监听
    /*registerInput: function(){
        this.listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) { // 触摸事件开始
                this.began = touch.getLocation();
                this.status = TouchStatus.BEGEN;
                return true;
            }.bind(this),
             onTouchEnded: function (touch, event) { // 触摸事件结束
                this.ended = touch.getLocation();
                var distance = cc.pDistance(this.began, this.ended);
                //移动值大于100 并且是往上
                if(distance > 100 && this.began.y < this.ended.y){
                    this.status = TouchStatus.ENDED;
                    this.enableInput(false,this.game.shootBtn);
                    
                    this.currentVerSpeed = this.emitSpeed;
                    // 记录最后触摸点,转换为父节点的坐标，根据触摸点偏移计算速度
                    this.target =  this.node.parent.convertToNodeSpaceAR(this.ended); 
                    this.currentHorSpeed = this.target.x * 2;
                    cc.log(this.currentHorSpeed);
                    
                    this.game.soundMng.playFlySound();
                     this.doAnim();
                    this.game.newBall();
                    //控制阴影
                    //if(this.shadow){
                        //this.shadow.dimiss();
                    //}
                }else{
                    this.status = TouchStatus.CANCEL;
                }
            }.bind(this),
             onTouchCancelled: function (touch, event) { // 触摸事件取消
                this.status = TouchStatus.CANCEL;
            }.bind(this)
        },
        cc.eventManager.addListener(this.listener, this.node);
    },*/

    //球发射
    doShoot: function doShoot(time_i) {
        var self = this;
        this.time_i = time_i;

        self.node.active = true;
        //在按按钮结束后，控制发射动作和碰撞检测
        self.status = TouchStatus.ENDED;
        self.enableInput(false, self.game.shootBtn);

        //当前发射速度
        self.currentVerSpeed = self.emitSpeed;
        //通过判断当前按压的时间来控制
        self.currentHorSpeed = (self.ballSpeedX.x + Math.random() * (self.ballSpeedX.y - self.ballSpeedX.x)) * 2;

        self.game.soundMng.playFlySound();
        self.doAnim();
        //self.game.newBall();
    },
    // 控制事件是否生效
    enableInput: function enableInput(enable, node_) {
        if (enable) {
            cc.eventManager.resumeTarget(node_);
        } else {
            cc.eventManager.pauseTarget(node_);
        }
    },

    // 篮球动画
    doAnim: function doAnim() {
        var scaleAnim = cc.scaleTo(1, this.scale);
        // 随机得到一个0-1
        var rotateValue = cc.randomMinus1To1();
        var rotateAnim = cc.rotateBy(2, 3 * 360 * rotateValue);
        var anim = cc.spawn(scaleAnim, rotateAnim);
        this.node.runAction(anim);
    },

    update: function update(dt) {
        if (Global.W_GAME_STATE == Global.R_GAME_STATE.DEAD) {
            return;
        };

        this._updatePosition(dt);
        //this._checkValid(dt);
    },

    _checkValid: function _checkValid(dt) {
        //篮球状态不为下落，或者已经进球
        if (this.ballStatus !== BallStatus.DOWN || this.valid) {
            return;
        }

        var parent = this.game.node;
        if (parent != null) {
            //获取篮筐对象
            var basket = this.game.basket;
            var left = basket.left;
            var right = basket.right;
            var ballRadius = this.node.getBoundingBoxToWorld().width / 2;

            /** 统一转换成世界坐标计算进球逻辑 */
            // 篮球的边界和中心
            var ballLeft = parent.convertToWorldSpaceAR(this.node.getPosition()).x - ballRadius;
            var ballRight = parent.convertToWorldSpaceAR(this.node.getPosition()).x + ballRadius;
            var ballX = parent.convertToWorldSpaceAR(this.node.getPosition()).x;
            var ballY = parent.convertToWorldSpaceAR(this.node.getPosition()).y;

            // 有效进球范围
            var validTop = parent.convertToWorldSpaceAR(basket.linePreNode.getPosition()).y - ballRadius;
            var validLeft = basket.node.convertToWorldSpaceAR(left.getPosition()).x;
            var validRight = basket.node.convertToWorldSpaceAR(right.getPosition()).x;
            var validBot = basket.node.convertToWorldSpaceAR(left.getPosition()).y - ballRadius * 2;
            //进球了
            if (ballY < validTop && ballY > validBot && ballX > validLeft && ballX < validRight) {
                this.valid = true;
                this.game.score.addScore();
                //网缩放动画
                this.game.basket.playNetAnim();
                //碰到篮筐
                if (this.hitIn) {
                    this.game.soundMng.playHitBoardInSound();
                } else {
                    this.game.soundMng.playBallInSound();
                };
                //进球添加进度时间
                this.game.timeMng.addTime();
                //cc.director.loadScene('menu');
            }
        }
    },

    // 篮球绑定自己的影子
    bindShadow: function bindShadow(shadow) {
        this.shadow = shadow;
    },

    // 更新篮球位置
    _updatePosition: function _updatePosition(dt) {
        var self = this;
        this.node.x += dt * this.currentHorSpeed;

        this.currentVerSpeed -= dt * this.gravity;
        this.node.y += dt * this.currentVerSpeed;

        this._changeBallStatus(this.currentVerSpeed);

        if (this.ballStatus === BallStatus.NONE && this._isOutScreen()) {
            // if(!this.valid){ // 没进球将分数重置
            //     this.game.score.setScore(0);
            // }
            this.node.removeFromParent();
            //回收后重新生成
            this.game.desPipe(this.node);
            //this.node.stopAllActions();
            this.valid = false;
            //回收后重新生成
            //cc.pool.putInPool(this);

            //隐藏当前投篮人物，显示运球
            var anim1 = self.dribble.getComponent(cc.Animation);
            anim1.play();
            self.dribble.active = true;
            self.shoot.active = false;
            var anim2 = self.shoot.getComponent(cc.Animation);
            anim2.stop();

            self.enableInput(true, self.game.shootBtn);

            this.game.newBall();
            return;
        }
    },

    _isOutScreen: function _isOutScreen() {
        return this.node.y < -800;
    },

    // 更改篮球状态
    _changeBallStatus: function _changeBallStatus(speed) {
        if (speed === 0 || this._isOutScreen()) {
            this.ballStatus = BallStatus.NONE;
        } else if (speed > 0) {
            this.ballStatus = BallStatus.FLY;
            this.game.basket.switchMaskLineShow(false);
        } else {
            this.ballStatus = BallStatus.DOWN;
            this.game.basket.switchMaskLineShow(true);
        }
    },

    onCollisionEnter: function onCollisionEnter(other, self) {

        if (this.ballStatus === BallStatus.FLY) {
            // 篮球上升过程中不进行碰撞检测
            return;
        };
        cc.log(other.tag);
        if (other.tag == 666 && this.ballStatus == BallStatus.DOWN) {
            //篮球状态为下落
            cc.log("赢了");
            this.valid = true;
            this.game.score.addScore();
            //网缩放动画
            this.game.basket.playNetAnim();
            //碰到篮筐
            if (this.hitIn) {
                this.game.soundMng.playHitBoardInSound();
            } else {
                this.game.soundMng.playBallInSound();
            };
            //进球添加进度时间
            this.game.timeMng.addTime();
            return false;
        } else {
            var box = other.node.getComponent('CollisionBox');
            var left = box.getLeft();
            var right = box.getRight();

            // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
            var world = self.world;
            var radius = world.radius;

            // 换算物体世界坐标系坐标
            var selfWorldPot = this.node.parent.convertToWorldSpaceAR(self.node.getPosition());
            var otherWorldPot = this.game.basket.node.convertToWorldSpaceAR(other.node.getPosition());
            var ratioHor = 0; // 横向弹性系数
            var ratioVer = 0; // 纵向弹性系数

            // 计算竖直偏移系数，即竖直方向弹性系数
            ratioVer = (selfWorldPot.y - otherWorldPot.y) / radius;
            // 计算水平偏移系数，即水平方向弹性系数
            ratioHor = Math.abs(otherWorldPot.x - selfWorldPot.x) / radius;
            // 水平方向碰撞初速度
            var horV = this.currentHorSpeed / Math.abs(this.currentHorSpeed) * 150;

            // 篮球碰到篮筐内，改变篮球横向速度为反方向
            if (other.node.name === 'right' && this.node.x <= left || other.node.name === 'left' && this.node.x >= right) {
                if (!this.hitIn) {
                    this.currentHorSpeed = this.currentHorSpeed * -1 * this.ballRatio * ratioHor + horV;
                    this.hitIn = true;
                } else {
                    this.currentHorSpeed = this.currentHorSpeed * this.ballRatio * ratioHor + horV;
                }
            }

            // 篮球碰到篮筐外，增大横向速度
            if (other.node.name === 'right' && this.node.x > right || other.node.name === 'left' && this.node.x < left) {
                this.currentHorSpeed = this.currentHorSpeed * this.ballRatio * ratioHor + horV;
            }
            this.currentVerSpeed = this.currentVerSpeed * -1 * ratioVer * 0.8;
            this.game.soundMng.playHitBoardSound();

            // 碰撞组件的 aabb 碰撞框
            var aabb = world.aabb;

            // 上一次计算的碰撞组件的 aabb 碰撞框
            var preAabb = world.preAabb;

            // 碰撞框的世界矩阵
            var t = world.transform;

            // 以下属性为圆形碰撞组件特有属性
            var r = world.radius;
            var p = world.position;
        }
    }

});

cc._RFpop();