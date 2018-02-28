(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/CollisionBox.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7c4c6Rwi4tIC4UMBgYL4231', 'CollisionBox', __filename);
// script/CollisionBox.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // 获取刚体左边界
    getLeft: function getLeft() {
        return this.node.x - this.node.width / 2;
    },

    // 获取刚体右边界
    getRight: function getRight() {
        return this.node.x + this.node.width / 2;
    },

    // 获取刚体的世界坐标
    getWorldPoint: function getWorldPoint(target) {
        return target.convertToWorldSpaceAR(this.node.getPosition());
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
        //# sourceMappingURL=CollisionBox.js.map
        