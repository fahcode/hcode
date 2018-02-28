(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Score.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0dbad8nuMBK8L4YWla50RjT', 'Score', __filename);
// script/Score.js

'use strict';

var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        scoreText: cc.Label
    },

    init: function init(game) {
        this.game = game;
        this._score = 0;
    },

    // 获取分数
    getScore: function getScore() {
        return _score;
    },

    // 设置分数
    setScore: function setScore(score) {
        this._score = score;
        Global.SCORE = this._score;
        this._updateScore();
    },

    // 增加分数
    addScore: function addScore() {
        this._score += 1;
        Global.SCORE = this._score;
        this._updateScore();

        //this.game.soundMng.playScoreSound();
    },

    // 更新分数
    _updateScore: function _updateScore() {
        this.scoreText.string = this._score;
    }

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Score.js.map
        