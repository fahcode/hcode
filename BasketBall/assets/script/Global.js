var STATE = cc.Enum({
    NONE:0,
    //普通状态
    NORMAL:1,
    SUPER:2,
    DEAD:3
});
module.exports = {
    //预设只读
    W_GAME_STATE:STATE.NONE,
    R_GAME_STATE:STATE,
    
    SCORE:0
};