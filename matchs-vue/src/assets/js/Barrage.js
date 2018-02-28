/**
 * Created by huangfahui on 2016/11/27.
 */
'use strict';
const Barrage = function(params){
    //if (! (this instanceof drawLottery)){return new drawLottery(params) ;}
    var params = params || ({});
    this.im = {
        options:{},
        //默认的弹幕类型
        popttype:{ 'leftt': 'left', 'rightt': 'right' ,'topt': 'top', 'bottomt': 'bottom'},
        defaultoptions:function(){
            var ops = {
                //容器
                popBoxId: null,
                //随机发送的文本数组
                popTxtArr:[],
                //方向
                direction:'left',
                //设置每个元素的占位
                domSpace: 40,
                //轨道数,不设置则使用计算的
                maxOrbit: 0,
                //自动计算的轨道数
                orbit: null,
                //随机生成元素的速度
                ranSpeed:1500,
                //元素移动的速度(在屏幕上生存的时间)
                liveTime:{'max':25000,'min':18000},
                //距离屏幕边缘的值
                scrnDiffer:20,
                //插入自定义的dom结构
                customDom:'',
                //最多创建10个结构
                maxDomLen: 50,
                //一次全部发送的时间
                oneAllTime: 1000,
                //移动的动画曲线
                easing:'linear',
                createDomCallBack:function(jqdom){},
                //开始滚动前回调(_this,暴露当前执行的this)
                StateCallBack:function(_this){},
                //随机发送弹幕，一轮过后回调(_this,暴露当前执行的this)
                OverCallBack:function(_this){},
                //每一个移动完成，执行一次回调(_this,暴露当前执行的this)
                oneMoveOverCallBack:function(_this){}

            };
            return ops;
        },
        //记录值的参数
        recordOps:{
            //记录定时器
            _timer:null,
            //数组索引
            _index:0,
            //纪录生成结构的个数
            emNum:0,
            //随机数纪录值
            oldy:0,
            winWid:0,
            winHei:0,
            boxWid:0,
            boxHei:0,
            of:true,
            domArr:[],
            loopDomArr:[],
            lastWidths: [],
            sX:0,
            sY:0,
            oX:0,
            oY:0,
            //保存此时方向的终点
            newEnd:0,
            oldrr:0,
            oneSet:true
        },
        //初始化参数，状态
        init:function(params) {
            var self = this;
            //重置,
            self.recordOps._index = 0;
            if(!!params){
                //使用new来保留默认参数值（对象是引用传递）
                self.options = new self.defaultoptions();

                self.options = Object.assign({}, self.options, params);
            };
            
            //初始化
            self.recordOps.winWid = parseInt($(window).width());
            self.recordOps.winHei = parseInt($(window).height());
            self.recordOps.boxWid = parseInt($(window).width());
            self.recordOps.boxHei = parseInt(self.options.popBoxId.innerHeight());
            /////通过高度判断弹幕的条数
            if(self.options.orbit == null) self.options.orbit = parseInt(self.recordOps.boxHei/self.options.domSpace);
            if(self.options.maxOrbit == 0) self.options.maxOrbit = self.options.orbit;
            //self.recordOps.boxHei = parseInt(self.options.popBoxId.height());
        },
        //初始化当前弹幕元素(接收当前dom元素)
        initPopDom:function(jq_dom,place){
            var self = this;
            //var rr1 = parseInt(Math.random()*self.options.useOrbit+0);
            var rr1 = self.recordOps.oldy;
            //防止重复位置
            if(rr1 > self.options.maxOrbit-1){
                //rr1 = parseInt(Math.random()*self.options.orbit+0);
                rr1 = 0;
            };
            //重复的元素，取前一个移动结束的轨道，尽可能的防止重叠
            /*if(!!jq_dom.attr('rr')){
                //console.log('有');
                rr1  = self.recordOps.oldrr;
            }*/
            //console.log(rr1);
            //在元素上记录轨道
            //jq_dom.attr('rr',rr1);
            ///////////通过随机数来控制每个轨道的误差值
            var randomSpace = parseInt(Math.random()*(-2-2+1) + 2);
            
            //当前y轴间距位置
            var space_y = rr1 * self.options.domSpace + randomSpace;

            //上下弹幕时，为x轴间距
            var space_x = rr1 * self.options.domSpace + randomSpace;
            //如果传入了位置，则使用
            if(place != null){
                 space_y = space_x = place * self.options.domSpace + randomSpace;
                 //console.log(place);
            }
            var thisWid = parseInt(jq_dom.innerWidth());
            var thisHei = parseInt(jq_dom.innerHeight());
            //方向判断
            if(self.options.direction == 'left'){
                self.recordOps.sX = -thisWid-self.options.scrnDiffer;
                self.recordOps.oX = self.recordOps.boxWid+self.options.scrnDiffer;
                self.recordOps.sY = space_y;
                self.recordOps.oY = space_y;
                //设置动画
                self.horizontal(jq_dom,self.recordOps.sX,self.recordOps.oX,self.recordOps.sY,self.recordOps.oY);
            }else if(self.options.direction == 'right'){
                self.recordOps.sX = self.recordOps.boxWid+self.options.scrnDiffer;
                //self.recordOps.oX = -thisWid-self.options.scrnDiffer;
                self.recordOps.oX = -thisWid-self.options.scrnDiffer-self.recordOps.boxWid;
                self.recordOps.sY = space_y;
                self.recordOps.oY = space_y;
                //设置动画
                /*(function(dom, sX, oX, sY, oY){
                    setTimeout(function(){
                        self.horizontal(dom,sX,oX,sY,oY);
                    },100);
                    
                })(jq_dom,self.recordOps.sX,self.recordOps.oX,self.recordOps.sY,self.recordOps.oY);*/
                self.horizontal(jq_dom,self.recordOps.sX,self.recordOps.oX,self.recordOps.sY,self.recordOps.oY);
            }else if(self.options.direction == 'top'){
                self.recordOps.sX = space_x;
                self.recordOps.oX = space_x;
                self.recordOps.sY = -thisHei-self.options.scrnDiffer;
                self.recordOps.oY = self.recordOps.boxHei+self.options.scrnDiffer;

                //设置动画
                self.lengthways(jq_dom,self.recordOps.sX,self.recordOps.oX,self.recordOps.sY,self.recordOps.oY);
            }else if(self.options.direction == 'bottom'){
                self.recordOps.sX = space_x;
                self.recordOps.oX = space_x;
                self.recordOps.sY = self.recordOps.boxHei+self.options.scrnDiffer;
                self.recordOps.oY = -thisHei-self.options.scrnDiffer;
                //设置动画
                self.lengthways(jq_dom,self.recordOps.sX,self.recordOps.oX,self.recordOps.sY,self.recordOps.oY);
            };

            //记录复制之间重复
            self.recordOps.oldy = rr1+1;
        },
        //横向位置控制及动画
        horizontal:function(jqobj,sX,oX,sY,oY,callback){
            var self = this;
            //随机的速度
            //var ran_speed = parseInt(Math.random()*self.options.liveTime.max+self.options.liveTime.min);
            var ran_speed = parseInt(Math.random()*(self.options.liveTime.max-self.options.liveTime.min) + self.options.liveTime.min);

            //设置初始位置
            jqobj.css({left:sX,top:sY});
            //保存结束位置到属性中
            //jqobj.attr({'oX':oX,'oY':oY,'sX':sX,'sY':sY});
            //jqobj.newEnd = {left:oX+"px",top:oY+"px"};
            var timer2 = null;
            //设置动画效果(show是为了判断当前加载完成)
            jqobj.show(function(){
                //使用css3的动画效果
                jqobj.css({
                    opacity: 1,
                    transform: 'translate('+ oX +'px, 0)',
                    transition: '-webkit-transform '+ ran_speed +'ms '+ self.options.easing
                });

                //clearTimeout(timer2);
                timer2 = setTimeout(function(){
                    //一个结构移动结束后回调
                    self.options.oneMoveOverCallBack.call(self,self);
                    //self.recordOps.oldrr = $(this).attr('rr');
                    //保存在对象池中
                    jqobj.remove();
                }, ran_speed);
            });

            if(!!callback){
                callback.call(self,self);
            };
        },
        //纵向位置控制及动画
        lengthways:function(jqobj,sX,oX,sY,oY,callback){
            var self = this;
            //随机的速度
            var ran_speed = parseInt(Math.random()*(self.options.liveTime.max-self.options.liveTime.min) + self.options.liveTime.min);

            //设置初始位置
            jqobj.css({left:sX,top:sY});

            jqobj.attr({'oX':oX,'oY':oY,'sX':sX,'sY':sY});

            //设置动画效果(show是为了判断当前加载完成)
            jqobj.show(function(){
                jqobj.animate({left:oX +"px",top:oY + 'px'},ran_speed,self.options.easing,function(){
                    //一个结构移动结束后回调
                    self.options.oneMoveOverCallBack.call(self,self);
                    
                    //保存在对象池中
                    self.recordOps.loopDomArr.push(jqobj);
                });
            });

            if(!!callback){
                callback.call(self,self);
            };
        },
        addData: function(arr){
            var self = this;
            //保存每次传入的数组
            self.options.popTxtArr = self.options.popTxtArr.concat(arr);
            ////超过两百条则删除前面的100
            /*if(self.options.popTxtArr.length>=200){
                self.recordOps._index -= 100;
                self.options.popTxtArr.splice(0,100);
            }*/
            console.log(self.options.popTxtArr.length)
        },
        //随机发送弹幕事件
        ranPopEven:function(arr){
            var self = this;
            var ii = 1,
                len = arr.length,
                times = parseInt(len/self.options.orbit) + ((len%self.options.orbit==0)? 0: 1),
                oneTime = parseInt(self.options.oneAllTime/times)-10;
            /*console.log(times)
            console.log(oneTime)*/
            //重置轨道
            self.recordOps.oldy = 0;
            //通过条数判断
            //第一次执行才会首先插入
            /*if(self.recordOps.oneSet){
                self.recordOps.oneSet = false;
                //初始调用一次
                self.initRanPop();
            };*/

            //clearInterval(self.recordOps._timer);
            for(let i = 0;i<self.options.orbit;i++){
                self.initRanPop(arr[i]);
            };
           /* clearInterval(self.recordOps._timer);
            self.recordOps._timer = setInterval(function(){
                if(ii>=times){
                    clearInterval(self.recordOps._timer);
                    return false;
                };
                for(let i = 0;i<self.options.orbit;i++){
                    let idx = self.options.orbit*ii + i;
                    self.initRanPop(arr[idx]);
                };
                ii++;
            }, oneTime);*/
            
        },
        ranOnePopEven: function(arr){
            var self = this;
            var self = this;
            var ii = 1,
                len = arr.length,
                oneTime = parseInt(self.options.oneAllTime/len)-5;

            if(len < self.options.orbit) self.recordOps.oldy = 0;
            clearInterval(self.recordOps._timer);
            //////如果一次发射的弹幕数量超过了轨道数，那不重置轨道，否则每次都重置
            

            self.initRanPop(arr[0]);
            self.recordOps._timer = setInterval(function(){
                if(ii>=len){
                    clearInterval(self.recordOps._timer);
                    return false;
                };
                self.initRanPop(arr[ii]);

                ii++;
            }, oneTime);
        },
        //生成结构isAuto
        createDom:function(txt, csss, callback){
            var self = this;
            var div;
            //最多生成10个对象,除非手动发射
            /*if(self.recordOps.domArr.length>=self.options.maxDomLen){
            //if(self.recordOps.loopDomArr.length>0){
                //使用已经生成过的数组
                div = self.recordOps.loopDomArr[0];
                div.html(txt);
                //在对象池删除当前
                self.recordOps.loopDomArr.splice(0,1);
            }else{*/
                //self.recordOps.emNum++;
                div = $('<div class="ppt idx'+ self.recordOps.emNum +'" style="'+ (!!csss? csss: "") +'">'+ txt + self.options.customDom +'</div>');
                //生成的元素插入
                self.options.popBoxId.append(div);
                self.options.createDomCallBack.call(self,self,div);
                //存到数组中
                //self.recordOps.domArr.push(div);
            //};
            if(!!callback){
                callback.call(self,self);
            };
            return div;
        },
        //随机发送弹幕
        initRanPop:function(text){
            var self = this;
            //console.log(index);
            //var text = self.options.popTxtArr[self.recordOps._index];

            //当已经生成10个，且对象池没有时，则不添加弹幕
            if(!!!text){
                return false;
            }
            //获取dom结构
            var div = self.createDom(text);
            //初始化当前生产的dom
            self.initPopDom(div);

            //轮寻整个数组
            /*if(self.options.popTxtArr.length<1){
                //数组轮寻一遍后回调
                self.options.OverCallBack.call(self,self);
                self.recordOps._index = 0;
            }else{
                self.recordOps._index++;
            };*/
        },
        
        //手动发送弹幕
        userSetPop:function(text, css, place){
            var self = this;
            //获取dom结构
            var div = self.createDom(text, css);

            //调用初始化弹幕
            self.initPopDom(div,place);
        },
        //清空随机发送(iscl),清空dom
        clearFlipPop:function(iscl){
            var self = this;
            clearInterval(self.recordOps._timer);
            if(!!iscl){
                self.options.popBoxId.empty();
            }
        },
        //一个参数，自动判断类型。两个参数，第一个是ops，第二个是callback
        reset:function(){
            var self = this;
            self.clearFlipPop(true);

            var params = null,callback = null;
            if(arguments.length>1){
                params = arguments[0];
                callback = arguments[1];
            }else if(arguments.length == 1){
                //判断参数类型，如果为函数，则是回调
                if(typeof arguments[0] == 'function'){
                    callback = arguments[0];
                }else{
                    //是参数
                    params = arguments[0];
                };
            };
            //重置计数器
            self.recordOps._index = 0;
            self.recordOps.domArr = [];
            self.init(params);
            //释放开始按钮
            self.recordOps.of = true;
            if(!!callback){
                callback.call(self,self);
            }
        },
        pause:function(callback){
            var self = this;
            //暂停随机发射
            clearInterval(self.recordOps._timer);
            //暂停动画
            /*for(var i = 0;i<self.recordOps.domArr.length;i++){
                self.recordOps.domArr[i].stop();
            }*/
            self.options.popBoxId.children().stop();
            if(!!callback){
                callback.call(self,self);
            }
        },
        ctinue:function(callback){
            var self = this;
            clearInterval(self.recordOps._timer);
            self.ranPopEven();

            for(var i = 0;i<self.recordOps.domArr.length;i++){
                //随机的速度
                //var ran_speed = parseInt(Math.random()*self.options.liveTime.max+self.options.liveTime.min)/2;
                //获取未移动完成的元素
                var cur = self.recordOps.domArr[i].not(".sp");
                /*cur = if($.inArray(cur,self.recordOps.loopDomArr)){
                    continue;
                };*/
                //var cur = self.recordOps.domArr[i];
                //获取当前里终点的值  和 全部的路程
                var linesp = parseInt(cur.attr('oX'))-parseInt(cur.css('left'))+parseInt(cur.attr('oY'))-parseInt(cur.css('top'));
                var dfsp = parseInt(cur.attr('oX'))-parseInt(cur.attr('sX'))+parseInt(cur.attr('oY'))-parseInt(cur.attr('sY'));
                //按剩余路程的比例*最快的速度
                var speed = parseInt(self.options.liveTime.min*linesp/dfsp);
                //通过jq的prevObject来获取记录结束的位置值
                cur.stop().animate({'left':cur.attr('oX') +'px','top':cur.attr('oY') +'px'},speed,self.options.easing,function(){
                    //设置为已经移动完成
                    $(this).addClass('sp');
                    //一个结构移动结束后回调
                    self.options.oneMoveOverCallBack.call(self,self);
                    //保存在对象池中
                    self.recordOps.loopDomArr.push($(this));
                });
            };
            
            self.of = false;
            if(!!callback){
                callback.call(self,self);
            }
        },
        //开始
        start:function(callback){
            var self = this;
            //单次抽奖控制
            if (self.recordOps.of) {
                self.recordOps.of = false;
                //游戏开始前回调
                self.options.StateCallBack.call(self,self);
                //开始
                self.ranPopEven();
            };
            if(!!callback){
                callback.call(self,self);
            }
        }
    };
    //传参数
    this.im.init(params);
    //返回当前抽奖方法
    return this.im;
};

export default Barrage