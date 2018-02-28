(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/load.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cd448BCDodN8INcE/ySjDz3', 'load', __filename);
// script/load.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        ball: cc.Node,
        txt: cc.Label,
        rotateTime: 0,
        jumpTime: 0,
        moveY: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.doLoad();
        //篮球添加动画
        this.ballAnim();
        cc.director.preloadScene('menu');
        cc.director.preloadScene('Game');
    },
    doLoad: function doLoad() {
        var i = 0;
        var load = function load() {
            //十次过后加载下一场景
            i += 0.01;
            this.txt.string = parseInt(i * 100) + '%';
            if (i > 0.99) {
                cc.director.loadScene("menu");
                this.unschedule(load);
            }
        };
        this.schedule(load, 0.1);
    },
    ballAnim: function ballAnim() {
        var rotateAnim = cc.rotateBy(1, 360);

        var move1 = cc.moveBy(0.6, 0, this.moveY).easing(cc.easeCubicActionOut());
        var move2 = cc.moveBy(0.6, 0, -this.moveY).easing(cc.easeCubicActionIn());
        var sequence1 = cc.sequence(move1, move2);

        var seq1 = cc.repeatForever(rotateAnim);
        var seq2 = cc.repeatForever(sequence1);

        this.ball.runAction(seq1);
        this.ball.runAction(seq2);
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
        //# sourceMappingURL=load.js.map
        