"use strict";
cc._RFpush(module, 'f81cdY3hlNAza/JwLtsWk2O', 'TimeManager');
// script\TimeManager.js

var Global = require('Global');
cc.Class({
    'extends': cc.Component,

    properties: {
        proBar: cc.ProgressBar,
        //游戏计时
        maxTime: 0,
        //篮筐计时后几秒开始移动
        timeToMove: 0,
        addtime: 0
    },

    init: function init(game) {
        this.game = game;
        this.time = this.maxTime;
        this.residueTime = 1;
        this.isTimeToMove = false;
        this.counting = true;
    },
    /*
        _callback: function(){
            this.counting = false;
            this.game.basket.count.string = '00  00';
            this.game.stopMoveBasket();
            this.game.gameOver();
        },
    
        stopCounting: function () {
            this.unschedule(this._callback);
            this.time = this.maxTime;
        },
    
        oneSchedule: function () {
            this.stopCounting();
            this.scheduleOnce(this._callback, this.maxTime);
            this.counting = true;
        },*/
    addTime: function addTime() {
        this.time += this.addtime;
        if (this.time > this.maxTime) {
            this.time = this.maxTime;
        }
    },
    // called every frame
    update: function update(dt) {
        if (Global.W_GAME_STATE == Global.R_GAME_STATE.DEAD) {
            return false;
        };
        this.time -= dt;
        this.residueTime = (this.time / this.maxTime).toFixed(2);
        //判断时间 控制篮筐移动
        /*if(this.maxTime - this.timeToMove >= this.time && !this.isTimeToMove){
            this.isTimeToMove = true;
            cc.log("移动了！");
            this.game.startMoveBasket();
        }*/
        this.proBar.progress = this.residueTime;
        var text = this.time.toFixed(2);
        if (text.length === 4) {
            text = '0' + text;
        }
        this.game.basket.count.string = text.replace('.', '  ');

        if (this.residueTime <= 0) {
            Global.W_GAME_STATE = Global.R_GAME_STATE.DEAD;
            this.game.gameOver();
        };
    }
});

cc._RFpop();