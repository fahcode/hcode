(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5577ahIGdlM/o4xDIN8+eQw', 'Global', __filename);
// script/Global.js

"use strict";

var STATE = cc.Enum({
    NONE: 0,
    //普通状态
    NORMAL: 1,
    SUPER: 2,
    DEAD: 3
});
module.exports = {
    //预设只读
    W_GAME_STATE: STATE.NONE,
    R_GAME_STATE: STATE,

    SCORE: 0
};

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
        //# sourceMappingURL=Global.js.map
        