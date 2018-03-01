/**
 * Created by huangfahui on 2016/11/22.
 */

const drawLottery = function(params){
        //if (! (this instanceof drawLottery)){return new drawLottery(params) ;}
        var params = params || ({});
        this.im = {
            activeObj:null,
            //默认的抽奖类型
            lttype:{ 'cutType': 'cut', 'circleType': 'circle' },
            //当前激活的参数
            activeoptions:{},
            defaultoptions :{
                cutoptions:function(){
                    var im = {
                        type:'cut',
                        //第几奖;
                        prizeid: 1,
                        //第几圈出奖;
                        ff: 8,
                        //控制速度;
                        speed: 300,
                        //加速的最大速度
                        maxSpeed: 50,
                        //减速的速度
                        minSpeed: 300,
                        //控制第几减速
                        indexSpeedDown: 48,
                        //控制第几加速
                        indexSpeedUp: 16,
                        startIndex:1,
                        //奖品父容器
                        gfBox: null,
                        //开始滚动前回调(_this,暴露当前执行的this)
                        StateCallBack:function(_this){},
                        //抽奖结束回调，出结果(_this,暴露当前执行的this)
                        OverCallBack:function(_this){},
                    }

                    return im;
                },
                circleoptions:function(){
                    var im = {
                        type:'circle',
                        //旋转的对象id
                        pointerId:null,
                        //旋转的角度
                        prizeAngle:0,
                        //旋转起始角度
                        startAngle:0,
                        //旋转时间
                        duration:3000,
                        //旋转圈数-1
                        circles:6,
                        ///旋转动画曲线
                        easing:$.easing.easeOutSine,
                        //开始滚动前回调(_this,暴露当前执行的this)
                        StateCallBack:function(_this){},
                        //抽奖结束回调，出结果(_this,暴露当前执行的this)
                        OverCallBack:function(_this){},
                    };
                    return im;
                }
            },

            init:function(options) {
                var self = this;
                //判断抽奖类型
                //切换抽奖
                if (options.type == self.lttype.cutType || !options.type) {
                    //当前抽奖对象
                    self.activeObj = self.cutLotter;

                    self.activeoptions = new self.defaultoptions.cutoptions();
                    //合并参数
                    self.activeoptions = $.extend(true, self.activeoptions, options);
                    //初始化当前类型的抽奖
                    self.cutLotter.init(self.activeoptions,self);
                };
                //转盘抽奖
                if (options.type == self.lttype.circleType) {
                    self.activeObj = self.circleLotter;
                    self.activeoptions = new self.defaultoptions.circleoptions();
                    //合并参数
                    self.activeoptions = $.extend(true, self.activeoptions, options);
                    self.circleLotter.init(self.activeoptions,self);
                };
            },
            //切换抽奖
            cutLotter:{
                _parent:null,
                options:{},
                //单次点击
                of:true,
                //位置
                defaultIndex:[],
                timer:null,
                allDom:null,
                //当前位置
                ii:1,
                //当前圈数
                T:1,
                init:function(options,_parent){
                    var self = this;
                    self._parent = _parent;
                    this.options = options;
                    //图片轮播开始
                    self.ii = self.options.startIndex;
                    
                },
                //获取当前dom结构的顺序
                getIndex:function(){
                    var self = this;
                    var len = self.allDom.length;
                    for(var i = 0;i<len;i++){
                        var tdom = self.allDom.eq(i);
                        var idx = tdom.attr('idx');
                        self.defaultIndex[idx-1] = tdom;
                    }

                },
                doDraw:function(uid) {
                    var self = this;

                    (function playStar() {
                        self.timer = setTimeout(playStar, self.options.speed);
                        //此处为图片的滚动
                        self.allDom.removeClass('on');
                        self.defaultIndex[self.ii-1].addClass('on');

                        //第SpeedUp开始加速
                        if (8 * self.T >= self.options.indexSpeedUp) {
                            self.options.speed = self.options.maxSpeed;
                        }
                        //第SpeedUp开始减速
                        if (8 * self.T >= self.options.indexSpeedDown) {
                            self.options.speed = self.options.minSpeed;
                        };
                        

                        //当滚动ff圈后开始出奖
                        if (self.T == self.options.ff) {
                            //在第几个图片停下来（下面以此类推）
                            if (self.ii == uid) {
                                clearTimeout(self.timer);
                                self.of = true;
                                //设置为获奖状态
                                self.options.OverCallBack.call(self,self);
                            }
                        };

                        self.ii++;
                        //控制图片轮播的范围（8张图片）
                        if (self.ii > self.defaultIndex.length) {
                            self.ii = 1;
                            self.T++;
                        };
                        
                    })();
                },
                pause:function(callback){
                    var self = this;
                    clearTimeout(self.timer);
                    if(!!callback){
                        callback.call(self,self);
                    }
                },
                ctinue:function(callback){
                    var self = this;
                    clearTimeout(self.timer);
                    self.of = false;
                    //开始
                    self.doDraw(self.options.prizeid);
                    if(!!callback){
                        callback.call(self,self);
                    }
                },
                //开始
                start:function(prizeid,callback){
                    var self = this;
                    if(!!prizeid){
                        self.options.prizeid = prizeid;
                    };
                    //获取当前抽奖元素
                    self.allDom = self.options.gfBox.children('[idx]');
                    //单次抽奖控制
                    if (self.of) {
                        self.of = false;
                        //获取当前顺序
                        self.getIndex();
                        //游戏开始前回调
                        self.options.StateCallBack.call(self,self);
                        //开始
                        self.doDraw(self.options.prizeid);
                    };
                    if(!!callback){
                        callback.call(self,self);
                    }
                }
            },
            //转盘抽奖
            circleLotter:{
                _parent:null,
                options:{},
                //单次点击
                of:true,
                timer:null,
                init:function(options,_parent){
                    var self = this;
                    self._parent = _parent;
                    this.options = options;
                    
                },
                //设置指针默认位置
                defaultAngle:function(ag){
                    var self = this;
                    self.options.pointerId.rotate(ag);
                },
                //设置初始转动的角度
                doDraw:function(angle){
                    var self = this;
                    var ops = {
                        //转动时间 
                        duration:self.options.duration, 
                        //起始角度
                        angle: self.options.startAngle,
                        //转动圈数+角度
                        animateTo:(360*self.options.circles) + self.options.prizeAngle, 
                        easing: self.options.easing, 
                        callback: function(){
                            self.of = true;   
                            //游戏结束后回调
                            self.options.OverCallBack.call(self,self);
                            return false; 
                        }
                    };
                    self.options.pointerId.rotate(ops);

                },
                pause:function(callback){
                    var self = this;
                    //停止旋转
                    self.options.pointerId.stopRotate();
                    //修改旋转的起始角度为当前对象的角度
                    self.options.startAngle = self.options.pointerId.getRotateAngle();
                    if(!!callback){
                        callback.call(self,self);
                    }
                },
                ctinue:function(callback){
                    var self = this;
                    self.of = false;
                    //继续
                    self.doDraw(self.options.prizeAngle);
                    if(!!callback){
                        callback.call(self,self);
                    }
                },
                //开始
                start:function(prizeAngle,callback){
                    var self = this;
                    if(!!prizeAngle && !(typeof prizeAngle == 'function')){
                        self.options.prizeAngle = prizeAngle;
                    };
                    //单次抽奖控制
                    if (self.of) {
                        self.of = false;
                        //设置默认位置
                        //self.defaultAngle(self.options.startAngle);
                        //游戏开始前回调
                        self.options.StateCallBack.call(self,self);
                        //开始
                        self.doDraw(self.options.prizeAngle);
                    };
                    if(!!callback){
                        callback.call(self,self);
                    }
                }
            }
        };
        //传参数
        this.im.init(params);
        //返回当前抽奖方法
        return this.im.activeObj;
    };

export default drawLottery