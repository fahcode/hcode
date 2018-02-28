require=function t(e,i,o){function n(s,a){if(!i[s]){if(!e[s]){var r="function"==typeof require&&require;if(!a&&r)return r(s,!0);if(c)return c(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var l=i[s]={exports:{}};e[s][0].call(l.exports,function(t){var i=e[s][1][t];return n(i||t)},l,l.exports,t,e,i,o)}return i[s].exports}for(var c="function"==typeof require&&require,s=0;s<o.length;s++)n(o[s]);return n}({Ball:[function(t,e,i){"use strict";cc._RF.push(e,"05d6195d99B06zz0IIi6csv","Ball");var o=cc.Enum({BEGEN:-1,ENDED:-1,CANCEL:-1}),n=cc.Enum({FLY:-1,DOWN:-1,NONE:-1}),c=t("Global");cc.Class({extends:cc.Component,properties:{emitSpeed:0,gravity:0,scale:0,showTime:0,ballRatio:0,ballSpeedX:cc.p(0,0)},init:function(t){this.game=t,this.valid=!1,this.time_i=0,this.status=o.CANCEL,this.currentHorSpeed=0,this.currentVerSpeed=0,this.target=cc.p(0,0),this.node.setScale(1),this.node.rotation=0,this.hitIn=!1,this.dribble=this.game.people.getChildByName("dribble"),this.shoot=this.game.people.getChildByName("shoot")},showAnim:function(){this.node.opacity=0;var t=cc.fadeIn(this.showTime);this.node.runAction(t)},doShoot:function(t){var e=this;this.time_i=t,e.node.active=!0,e.status=o.ENDED,e.enableInput(!1,e.game.shootBtn),e.currentVerSpeed=e.emitSpeed,e.currentHorSpeed=2*(e.ballSpeedX.x+Math.random()*(e.ballSpeedX.y-e.ballSpeedX.x)),e.game.soundMng.playFlySound(),e.doAnim()},enableInput:function(t,e){t?cc.eventManager.resumeTarget(e):cc.eventManager.pauseTarget(e)},doAnim:function(){var t=cc.scaleTo(1,this.scale),e=cc.randomMinus1To1(),i=cc.rotateBy(2,1080*e),o=cc.spawn(t,i);this.node.runAction(o)},update:function(t){c.W_GAME_STATE!=c.R_GAME_STATE.DEAD&&this._updatePosition(t)},_checkValid:function(t){if(this.ballStatus===n.DOWN&&!this.valid){var e=this.game.node;if(null!=e){var i=this.game.basket,o=i.left,c=i.right,s=this.node.getBoundingBoxToWorld().width/2,a=(e.convertToWorldSpaceAR(this.node.getPosition()).x,e.convertToWorldSpaceAR(this.node.getPosition()).x,e.convertToWorldSpaceAR(this.node.getPosition()).x),r=e.convertToWorldSpaceAR(this.node.getPosition()).y,h=e.convertToWorldSpaceAR(i.linePreNode.getPosition()).y-s,l=i.node.convertToWorldSpaceAR(o.getPosition()).x,d=i.node.convertToWorldSpaceAR(c.getPosition()).x,u=i.node.convertToWorldSpaceAR(o.getPosition()).y-2*s;r<h&&r>u&&a>l&&a<d&&(this.valid=!0,this.game.score.addScore(),this.game.basket.playNetAnim(),this.hitIn?this.game.soundMng.playHitBoardInSound():this.game.soundMng.playBallInSound(),this.game.timeMng.addTime())}}},bindShadow:function(t){this.shadow=t},_updatePosition:function(t){var e=this;if(this.node.x+=t*this.currentHorSpeed,this.currentVerSpeed-=t*this.gravity,this.node.y+=t*this.currentVerSpeed,this._changeBallStatus(this.currentVerSpeed),this.ballStatus===n.NONE&&this._isOutScreen())return this.node.removeFromParent(),this.game.desPipe(this.node),this.valid=!1,e.dribble.getComponent(cc.Animation).play(),e.dribble.active=!0,e.shoot.active=!1,e.shoot.getComponent(cc.Animation).stop("shoot"),e.enableInput(!0,e.game.shootBtn),void this.game.newBall()},_isOutScreen:function(){return this.node.y<-800},_changeBallStatus:function(t){0===t||this._isOutScreen()?this.ballStatus=n.NONE:t>0?(this.ballStatus=n.FLY,this.game.basket.switchMaskLineShow(!1)):(this.ballStatus=n.DOWN,this.game.basket.switchMaskLineShow(!0))},onCollisionEnter:function(t,e){if(this.ballStatus!==n.FLY){if(cc.log(t.tag),666==t.tag&&this.ballStatus==n.DOWN)return cc.log("赢了"),this.valid=!0,this.game.score.addScore(),this.game.basket.playNetAnim(),this.hitIn?this.game.soundMng.playHitBoardInSound():this.game.soundMng.playBallInSound(),this.game.timeMng.addTime(),!1;var i=t.node.getComponent("CollisionBox"),o=i.getLeft(),c=i.getRight(),s=e.world,a=s.radius,r=this.node.parent.convertToWorldSpaceAR(e.node.getPosition()),h=this.game.basket.node.convertToWorldSpaceAR(t.node.getPosition()),l=0,d=0;d=(r.y-h.y)/a,l=Math.abs(h.x-r.x)/a;var u=this.currentHorSpeed/Math.abs(this.currentHorSpeed)*150;("right"===t.node.name&&this.node.x<=o||"left"===t.node.name&&this.node.x>=c)&&(this.hitIn?this.currentHorSpeed=this.currentHorSpeed*this.ballRatio*l+u:(this.currentHorSpeed=-1*this.currentHorSpeed*this.ballRatio*l+u,this.hitIn=!0)),("right"===t.node.name&&this.node.x>c||"left"===t.node.name&&this.node.x<o)&&(this.currentHorSpeed=this.currentHorSpeed*this.ballRatio*l+u),this.currentVerSpeed=-1*this.currentVerSpeed*d*.8,this.game.soundMng.playHitBoardSound();s.aabb,s.preAabb,s.transform,s.radius,s.position}}}),cc._RF.pop()},{Global:"Global"}],Basket:[function(t,e,i){"use strict";cc._RF.push(e,"ac9fdFyp49GVKHUgk9/FVli","Basket"),cc.Class({extends:cc.Component,properties:{line:cc.Node,left:cc.Node,right:cc.Node,linePre:cc.Prefab,count:cc.Label,backetMove:cc.p(0,0),moveTimes:0},init:function(t){this.game=t,this.state=!1,this._createMaskLine(),this._doMoveAnim()},startMove:function(){this._doMoveAnim()},stopMove:function(){this.node.stopAllActions(),this._resetPosition()},_resetPosition:function(){this.node.setPositionX(0)},_doMoveAnim:function(){var t=this,e=cc.moveBy(t.moveTimes,cc.p(t.backetMove.x,0)),i=cc.moveBy(t.moveTimes,cc.p(t.backetMove.y,0)),o=cc.repeatForever(cc.sequence(e,i,i,e));this.node.runAction(o)},_createMaskLine:function(){this.linePreNode=cc.instantiate(this.linePre),this.game.node.addChild(this.linePreNode),this.state=!0},switchMaskLineShow:function(t){t?this.linePreNode.setLocalZOrder(100):this.linePreNode.setLocalZOrder(1)},playNetAnim:function(){if(this.linePreNode){var t=cc.scaleTo(.1,1,1.1),e=cc.scaleTo(.3,1,.9),i=cc.scaleTo(.2,1,1),o=cc.sequence(t,e,i);this.linePreNode.getChildByName("net").runAction(o)}},update:function(t){this.line;var e=this.node.convertToWorldSpaceAR(this.line.getPosition()),i=this.node.parent.parent.convertToNodeSpaceAR(e);if(!this.state)return!1;this.linePreNode.setPosition(cc.p(this.node.x-3,i.y))}}),cc._RF.pop()},{}],CollisionBox:[function(t,e,i){"use strict";cc._RF.push(e,"7c4c6Rwi4tIC4UMBgYL4231","CollisionBox"),cc.Class({extends:cc.Component,properties:{},getLeft:function(){return this.node.x-this.node.width/2},getRight:function(){return this.node.x+this.node.width/2},getWorldPoint:function(t){return t.convertToWorldSpaceAR(this.node.getPosition())}}),cc._RF.pop()},{}],GameManager:[function(t,e,i){"use strict";cc._RF.push(e,"7b066H36KxCVr0SNDZka91/","GameManager");var o=t("Basket"),n=(t("Ball"),t("Shadow")),c=t("Score"),s=t("SoundManager"),a=t("TimeManager"),r=t("animShoot"),h=t("Global");cc.Class({extends:cc.Component,properties:{ball:cc.Prefab,shadow:cc.Prefab,basket:o,startPosition:cc.Vec2,score:c,soundMng:s,timeMng:a,shootAnim:r,shootBtn:cc.Node,people:cc.Node,overLayer:cc.Node,proBar:cc.ProgressBar,overPop:cc.Label},onLoad:function(){this.init(),this.newBall(),this.basket.init(this),this.score.init(this),this.timeMng.init(this),this.initCollisionSys(),this.score.setScore(0),h.W_GAME_STATE=h.R_GAME_STATE.NORMAL},init:function(){this.ballComp=null,this.time_i=1,this.ballBox=this.people.getChildByName("ballBox"),this.dribble=this.people.getChildByName("dribble"),this.shoot=this.people.getChildByName("shoot"),this.ballPool=new cc.NodePool;for(var t=0;t<3;t++)this.ballPool.put(cc.instantiate(this.ball));this.enableInput(!0,this.shootBtn),this.shootBtnControl()},initCollisionSys:function(){this.collisionManager=cc.director.getCollisionManager(),this.collisionManager.enabled=!0,cc.director.setDisplayStats(!0)},newBall:function(){this.ballComp=this.ballPool.get(),this.ballBox.addChild(this.ballComp),this.ballComp.setPosition(this.startPosition),this.people.setLocalZOrder(100),this.ballComp.setLocalZOrder(100),this.ballComp.active=!1,this.ballComp.getComponent("Ball").init(this)},newShadow:function(t){var e=null;(e=cc.pool.hasObject(n)?cc.pool.getFromPool(n).node:cc.instantiate(this.shadow)).setLocalZOrder(2),this.node.addChild(e),e.setPosition(this.startPosition);var i=e.getComponent("Shadow");t.bindShadow(i),i.init(this)},shootBtnControl:function(){function t(){e.time_i++}var e=this;e.shootBtn.on("touchstart",function(i){return e.time_i=1,e.schedule(t,.1),!0}),e.shootBtn.on("touchend",function(i){e.unschedule(t),e.enableInput(!1,e.shootBtn),cc.log(e.time_i),e.shootAnim.init(e.ballComp.getComponent("Ball"),e.time_i),e.dribble.getComponent(cc.Animation).stop(),e.dribble.active=!1,e.shoot.active=!0,e.shoot.getComponent(cc.Animation).play("shoot")})},startMoveBasket:function(){this.basket.startMove()},stopMoveBasket:function(){this.basket.stopMove()},enableInput:function(t,e){t?cc.eventManager.resumeTarget(e):cc.eventManager.pauseTarget(e)},desPipe:function(t){this.ballPool.put(t)},gameOver:function(){cc.log("结束了哦！"),this.enableInput(!1,this.shootBtn),this.overPop.string="比赛结束，你的得分是"+h.SCORE+"，恭喜获得《街篮》限量礼包，点击领取解锁游戏更多内容，分享至朋友圈还可邀请好友一起比拼！",this.overLayer.active=!0},startGame:function(){cc.director.loadScene("menu")}}),cc._RF.pop()},{Ball:"Ball",Basket:"Basket",Global:"Global",Score:"Score",Shadow:"Shadow",SoundManager:"SoundManager",TimeManager:"TimeManager",animShoot:"animShoot"}],Global:[function(t,e,i){"use strict";cc._RF.push(e,"5577ahIGdlM/o4xDIN8+eQw","Global");var o=cc.Enum({NONE:0,NORMAL:1,SUPER:2,DEAD:3});e.exports={W_GAME_STATE:o.NONE,R_GAME_STATE:o,SCORE:0},cc._RF.pop()},{}],Line:[function(t,e,i){"use strict";cc._RF.push(e,"00dcby5FcZIh5P10wPcfVGt","Line"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){}}),cc._RF.pop()},{}],Score:[function(t,e,i){"use strict";cc._RF.push(e,"0dbad8nuMBK8L4YWla50RjT","Score");var o=t("Global");cc.Class({extends:cc.Component,properties:{scoreText:cc.Label},init:function(t){this.game=t,this._score=0},getScore:function(){return _score},setScore:function(t){this._score=t,o.SCORE=this._score,this._updateScore()},addScore:function(){this._score+=1,o.SCORE=this._score,this._updateScore()},_updateScore:function(){this.scoreText.string=this._score}}),cc._RF.pop()},{Global:"Global"}],Shadow:[function(t,e,i){"use strict";cc._RF.push(e,"403b5GGRt5LYYNN87LqlnM7","Shadow"),cc.Class({extends:cc.Component,properties:{showTime:0,shadow2:cc.Node},init:function(t){this.node.setScale(1),this._showAnim()},_showAnim:function(){this.node.opacity=0,this.shadow2.active=!0;var t=cc.fadeIn(this.showTime);this.node.runAction(t)},dimiss:function(){this._dismissAnim()},_dismissAnim:function(){this.shadow2.active=!1;var t=cc.fadeOut(this.showTime),e=cc.scaleTo(this.showTime,.5),i=cc.spawn(t,e),o=cc.callFunc(this._callBack.bind(this));this.node.runAction(cc.sequence(i,o))},_callBack:function(){this.node.stopAllActions(),this.node.removeFromParent(),cc.pool.putInPool(this)}}),cc._RF.pop()},{}],SoundManager:[function(t,e,i){"use strict";cc._RF.push(e,"3495eBx+i1PlrOKcbTaqUD6","SoundManager"),cc.Class({extends:cc.Component,properties:{toggleAudio:!0,scoreAudio:{default:null,url:cc.AudioClip},ballInAudio:{default:null,url:cc.AudioClip},hitBoardInAudio:{default:null,url:cc.AudioClip},hitBoardAudio:{default:null,url:cc.AudioClip},flyAudio:{default:null,url:cc.AudioClip}},init:function(t){},playScoreSound:function(){this.playSound(this.scoreAudio)},playBallInSound:function(){this.playSound(this.ballInAudio)},playHitBoardSound:function(){this.playSound(this.hitBoardAudio)},playHitBoardInSound:function(){this.playSound(this.hitBoardInAudio)},playFlySound:function(){this.playSound(this.flyAudio)},playSound:function(t){this.toggleAudio&&cc.audioEngine.playEffect(t,!1)}}),cc._RF.pop()},{}],TimeManager:[function(t,e,i){"use strict";cc._RF.push(e,"f81cdY3hlNAza/JwLtsWk2O","TimeManager");var o=t("Global");cc.Class({extends:cc.Component,properties:{proBar:cc.ProgressBar,maxTime:0,timeToMove:0,addtime:0},init:function(t){this.game=t,this.time=this.maxTime,this.residueTime=1,this.isTimeToMove=!1,this.counting=!0},addTime:function(){this.time+=this.addtime,this.time>this.maxTime&&(this.time=this.maxTime)},update:function(t){if(o.W_GAME_STATE==o.R_GAME_STATE.DEAD)return!1;this.time-=t,this.residueTime=(this.time/this.maxTime).toFixed(2),this.proBar.progress=this.residueTime;var e=this.time.toFixed(2);4===e.length&&(e="0"+e),this.game.basket.count.string=e.replace(".","  "),this.residueTime<=0&&(o.W_GAME_STATE=o.R_GAME_STATE.DEAD,this.game.gameOver())}}),cc._RF.pop()},{Global:"Global"}],animShoot:[function(t,e,i){"use strict";cc._RF.push(e,"68810UWGidHuIB8gk8ZX/Rd","animShoot"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){},init:function(t,e){this.ballComp=t,this.time_i=e},animShoot:function(){this.ballComp.doShoot(this.time_i)}}),cc._RF.pop()},{}],load:[function(t,e,i){"use strict";cc._RF.push(e,"cd448BCDodN8INcE/ySjDz3","load"),cc.Class({extends:cc.Component,properties:{ball:cc.Node,txt:cc.Label,rotateTime:0,jumpTime:0,moveY:0},onLoad:function(){this.doLoad(),this.ballAnim(),cc.director.preloadScene("menu"),cc.director.preloadScene("Game")},doLoad:function(){var t=0;this.schedule(function e(){t+=.01,this.txt.string=parseInt(100*t)+"%",t>.99&&(cc.director.loadScene("menu"),this.unschedule(e))},.1)},ballAnim:function(){var t=cc.rotateBy(1,360),e=cc.moveBy(.6,0,this.moveY).easing(cc.easeCubicActionOut()),i=cc.moveBy(.6,0,-this.moveY).easing(cc.easeCubicActionIn()),o=cc.sequence(e,i),n=cc.repeatForever(t),c=cc.repeatForever(o);this.ball.runAction(n),this.ball.runAction(c)}}),cc._RF.pop()},{}],menu:[function(t,e,i){"use strict";cc._RF.push(e,"d58d3cbxspEVqX93Tf3MS3X","menu"),cc.Class({extends:cc.Component,properties:{backet:cc.Node,people:cc.Node,slogan:cc.Node,startBtn:cc.Node},onLoad:function(){this.animas()},playGame:function(){cc.director.loadScene("Game")},animas:function(){var t=this,e=cc.p(this.backet.width/2-cc.winSize.width/2,this.backet.y),i=cc.p(this.slogan.x,this.slogan.y),o=cc.p(this.startBtn.x,this.startBtn.y);this.backet.x=-this.backet.width/2-cc.winSize.width/2,this.slogan.x=this.slogan.width/2+cc.winSize.width/2,this.startBtn.y=-this.startBtn.height/2-cc.winSize.height/2;var n=cc.moveTo(.5,cc.p(e.x,e.y)).easing(cc.easeCubicActionIn()),c=cc.moveTo(.5,cc.p(i.x,i.y)).easing(cc.easeCubicActionIn()),s=cc.moveTo(.3,cc.p(o.x,o.y)).easing(cc.easeCubicActionIn()),a=cc.callFunc(function(){t.startBtn.runAction(s)},this),r=cc.callFunc(function(){var t=cc.sequence(c,a);this.slogan.runAction(t)},this),h=cc.sequence(n,r);this.backet.runAction(h)},enableInput:function(t){t?cc.eventManager.resumeTarget(this.node):cc.eventManager.pauseTarget(this.node)}}),cc._RF.pop()},{}]},{},["Ball","Basket","CollisionBox","GameManager","Global","Line","Score","Shadow","SoundManager","TimeManager","animShoot","load","menu"]);