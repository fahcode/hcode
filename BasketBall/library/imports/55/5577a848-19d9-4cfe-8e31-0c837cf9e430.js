"use strict";
cc._RF.push(module, '5577ahIGdlM/o4xDIN8+eQw', 'Global');
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