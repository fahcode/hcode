"use strict";
cc._RF.push(module, '403b5GGRt5LYYNN87LqlnM7', 'Shadow');
// script/Shadow.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        showTime: 0, // 生成篮球显示动画时间
        shadow2: cc.Node
    },

    init: function init(game) {
        this.node.setScale(1);
        this._showAnim();
    },

    // 显示动画
    _showAnim: function _showAnim() {
        this.node.opacity = 0;
        this.shadow2.active = true;
        var fadeAnim = cc.fadeIn(this.showTime);
        this.node.runAction(fadeAnim);
    },

    dimiss: function dimiss() {
        this._dismissAnim();
    },

    _dismissAnim: function _dismissAnim() {
        this.shadow2.active = false;
        var fadeAnim = cc.fadeOut(this.showTime);
        var scaleAnim = cc.scaleTo(this.showTime, 0.5);
        var spawnAnim = cc.spawn(fadeAnim, scaleAnim);
        var func = cc.callFunc(this._callBack.bind(this));

        this.node.runAction(cc.sequence(spawnAnim, func));
    },

    // 动画结束回调
    _callBack: function _callBack() {
        this.node.stopAllActions();
        this.node.removeFromParent();
        cc.pool.putInPool(this);
    }
});

cc._RF.pop();