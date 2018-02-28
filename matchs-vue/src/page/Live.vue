<template>
<div class="view live">
	<div class="lv_video" :class="{'max': ws_switch==0}">
		<div class="lv_tit">
			<p class="ti"><i class="ic vd"></i>{{title}}</p>
			
			<div class="rightfunc" v-show="ws_switch==1">
				<p class="numt" >
					<span>{{count}}</span>
					人正在观看
				</p>
				<div class="switch" :class="{'on': openBarrage}" @click="doswitch()">
					<div class="sbox" >
						<i class="chunk"></i>
						<span class="l" v-show="!openBarrage">弹幕关</span>
						<span class="r" v-show="openBarrage">弹幕开</span>
					</div>
				</div>
			</div>
		</div>
		<div class="lv_box">
			<video width="100%" height="100%" v-if="showLive" ref="video" :src="live | isstr" preload="auto" x5-playsinline="" playsinline="" webkit-playsinline="" x-webkit-airplay="true" :poster="unstartimg" ></video>
			<button ref="videoBtn" class="videoPlay" :class="{'dostop': vstart}" @click.stop="videoPlay($event.target)"></button>
			<div ref="barrage" class="barrage j_barrage" id="barrage" v-show="openBarrage"  @click="videoState()">
			</div>
		</div>
	</div>
	<!-- 公共的按钮 -->
	<div class="lc_toggle_btns">
		<button class="b1 on" @click="showView()">观赛领奖</button>
		<button class="b2" @click="goRouter()">赛程介绍</button>
	</div>
	<div class="lv_control" v-show="ws_switch==1">
		
		<div class="lc_content" v-model="content_active" swipeable="true">
			<div class="lc_bscreen" id="bscreen">
				<p class="bl_info">请各位球友文明观赛，传播任何违法、低俗等不良信息将被禁言。祝您观赛愉快！</p>
				<div class="hbox">
					<ul class="pop_texts" ref="pop_texts">
						<li v-for="item in showBarrages">
							<span class="n">{{item.split(':')[0]}}</span>：
							<span class="t" >{{item.split(':')[1]}}</span>
						</li>
					</ul>
				</div>
				<div class="bl_push">
					<div class="input_b">
						<input type="text" placeholder="请输入弹幕" :value="barrageText" @input="updateValue($event.target, $event.target.value)"/>
						<button @click="useSetBarrage">发送</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { living } from '../service/getData'
import Barrage from '../assets/js/Barrage'
import wsConnection from '../assets/js/WebSocket'
import { Indicator } from 'mint-ui'
import CONFIG from '../config/config'

export default {
  	name: 'Live',
  	data () {
	    return {
	    	dfmatch: {},
	    	title: '',
	    	showLive: true,
	    	live: '',
	    	content_active: 'bscreen',
	    	count: 0,
	    	unstartimg: '',
	    	userstr: '',
	    	ws_switch: 1,
	    	openBarrage: true,

	    	oldbarrageText: '',//保存之前发的
	    	barrageText: '',
	    	Barrage1: null,
	    	/////新增弹幕存储对象
	    	pushBarrage: [],
	    	_WebSocket: null,
	    	allBarrages: [],
	    	showBarrages: [],
	    	getCountTimer: null,
	    	setBarrage: null,
	    	speed: 100,

	    	vstart: false
	    }
  	},
  	computed: {
  		...mapState(['system', 'weixin', 'nickname', 'func_avtive', 'matchs'])
  	},
  	methods: {
  		showView: function(){
  			//this.showLive = true;
            this._toggle({
                key: "func",
                val: 'fadeShrinkIn'
            });
        },
  		defaultMatch: function(){
            this.dfmatch = this.matchs.length>0? this.matchs[0]: {};
        },
        toggle: function(type){
            this.content_active = type;
        },
        goRouter: function(){
            /////控制跳转的路由
            this.$router.push('/schedule/' + this.dfmatch.id);
        },
        useSetBarrage(e){
        	let target = e.currentTarget;
        	var v = this.barrageText;
        	var a = this.oldbarrageText = this.nickname + ':' + v;
        	//未输入内容
        	if(v=='' || v==undefined || v==null) return false;
        	
        	//开始倒计时
        	_Tool.countDown(target, 6, {color: '#ccc'});
        	
        	this.showBarrages.push(a);
        	this.Barrage1.userSetPop(v, "color: red");
	        this._WebSocket.send('broadcast;'+ a);

	        this.barrageText = "";
        },
        // 不是直接更新值，而是使用此方法来对输入值进行格式化和位数限制
    	updateValue: function (ele, value) {

    		var formattedValue = value;
    		if(formattedValue.length>15) formattedValue = formattedValue.substring(0, 15);
    		// 通过 input 事件带出数值
    		this.barrageText = formattedValue;
      		//this.$emit('input', formattedValue);
    	},
    	videoState: function(){
    		var self = this;
    		let videoBtn = this.$refs.videoBtn,
    			timer = null;

    		videoBtn.style="opacity: 1;visibility: visible;";
    		//在播放时
    		clearTimeout(timer);
	        timer = setTimeout(function(){
	        	if(self.vstart){
	        		videoBtn.style="opacity: 0;visibility: hidden;";
	        	}
	        }, 2000);
    	},
    	videoPlay: function(e){
    		var self = this;
    		let video = this.$refs.video;
    		//点击按钮切换播放状态,保证事件未生效，或者比较迟，每次的点击会隐藏
    		//self.vstart = !self.vstart;

    		if(video.paused){
		        video.play();
		    }else{
		        video.pause();
		    };
    	},
    	doswitch: function(){
    		this.openBarrage = !this.openBarrage;
    		let dom = this.$refs.barrage;
    		dom.innerHTML = "";
    		Indicator.close();
    	},
    	addVideoEvents: function(){
    		var self = this;

    		let video = this.$refs.video,
	    		videoBtn = this.$refs.videoBtn,
	    		timer = null;
	    	video.onerror = function(){
	    		//alert('视频加载错误！请刷新')
	    	}
	    	video.onpause = function(){
	    		self.vstart = false;
	    		//self.live = self.live + "?v=" + (new Date()).getTime();
	    		
	    		videoBtn.style="opacity: 1;visibility: visible;";
	    	}
	    	video.onplay = function(){
	    		self.vstart = true;
	    		//停止弹幕
	    		//self.Barrage1==null
	    		//////隐藏
		        clearTimeout(timer);
		        timer = setTimeout(function(){
		        	videoBtn.style="opacity: 0;visibility: hidden;";
		        }, 1000);
	    	}
    	},
    	...mapActions(['_toggle'])
    },
    created(){
    	var self = this;

    	////使用默认的第一个赛事
        this.defaultMatch();
        //living
        living().then(res => {
        	if(res.ret == 1){
        		let data = res.data;
        		this.title = data.title;
        		this.live = data.url;
        		this.unstartimg = data.unstartimg;
        		this.ws_switch = data.ws_switch;
        		//this.ws_switch = 0;
        		////接口请求后才使用弹幕功能
        		connectWS();
        		
        	}else{
        		alert(res.msg)
        	}
        });
        let userstr = self.userstr = _Tool.selectCookie('jl_act_match_cookie_userinfo');
        function connectWS(){
	        wsConnection(CONFIG.WebSocketUrl + "?userstr=" + userstr).then(wsSocket =>{
		    	self._WebSocket = wsSocket;

		    	self._WebSocket.onopen = wsOpen;
			    function wsOpen (event) {       
			        console.log('Connected to: ' + event.currentTarget.url);
			        Indicator.close();

			        //开始获取人数
			        wsSocket.send('count;');
			        self.getCountTimer = setInterval(function(){
			        	wsSocket.send('count;');
			        }, 2000);
			    }
			    
			    self._WebSocket.onclose = wsClose;
			    function wsClose () {
			        console.log("ws is Closed");
			    }
			    ////接收消息
			    self._WebSocket.onmessage = wsMessage;
			    function wsMessage (event) {
			        var data = event.data;
			        if(data.indexOf('count') != -1){
			        	let count = data.split('count:')[1];
			        	self.count = parseInt(count)<0? 0: count;
			        }else{
			        	let adata = JSON.parse(data),
			        		tnow = [];
			        	for(let i = 0; i<adata.length; i++){
			        		if(adata[i] != self.oldbarrageText){
			        			////保存除自己外的数据
			        			//self.allBarrages.push(adata[i]);
			        			//保存右侧显示的数据
			        			tnow.push(adata[i]);
			        			//只有开启显示弹幕才会存储弹幕数据
			        			if(self.Barrage1!=null && self.ws_switch==1) self.pushBarrage.push(adata[i].split(':')[1]);
			        		}
			        	};
			        	//只处理右侧弹幕，左侧弹幕单独分离
			        	if(tnow.length>0 && self.Barrage1!=null && self.ws_switch==1){
			        		//if(self.openBarrage) self.Barrage1.ranOnePopEven(now);
			        		/////右侧显示弹幕
			        		self.showBarrages = self.showBarrages.concat(tnow);
			    			if(self.showBarrages.length>=100) self.showBarrages.splice(-31,30);
			        	}
			        }
			    }
			    
			    self._WebSocket.onerror = wsError;
			    function wsError(event) {
			    	console.log(event)
			    	if(self.openBarrage){
				        /*Indicator.open({
						  text: '重新连接弹幕...',
						  spinnerType: 'fading-circle'
						});*/
				        //重新连接
				        connectWS();
			    	}
			    }
		    });
    	}
    },
    mounted: function(){
    	var self = this;
    	//随机发送的数组
	    var arrs = [];
		//配置选项
	    var ops = {
	        //容器popBoxId
	        popBoxId: $('#barrage'),
	        //方向
	        direction: 'right',
	        //设置每个元素的占位
	        domSpace: 20,
	        //随机生成元素的速度
	        ranSpeed: 200,
	        //元素移动的速度(在屏幕上生存的时间)
	        liveTime: {'max': 5000, 'min': 5000},
	        //距离屏幕边缘的值
	        scrnDiffer: 20,
	        ////一波发送的时间，
	        oneAllTime: 500,
	        //插入自定义的dom结构
	        //customDom: '<div></div>',
	        //移动的动画曲线
	        easing: 'linear',
	        //随机发送的文本数组
	        popTxtArr: [],
	        //每一个移动完成，执行一次回调
	        oneMoveOverCallBack:function(){
	            //console.log('走一个');
	            //在对象池删除当前
                //self.allBarrages.splice(0,1);
	        }
	    };
	    ////判断是否是横屏
        _Tool.orientation(function(orientation){
            if(self.Barrage1 == null && orientation == 'landscape') self.Barrage1 = new Barrage(ops);
        })
	    //调用弹幕
	    //self.Barrage1 = new Barrage(ops);
	    //self.Barrage1.ranPopEven();
	    //开始随机弹幕
	    //$('#start1').click(function(){
	        //Barrage1.start();
	    //});
	    ///定时器发送弹幕，一次的时间必须跟初始化弹幕一波发送的时间相等
	    self.setBarrage = setInterval(function(){
        	if(self.pushBarrage.length>0 && self.Barrage1!=null && self.ws_switch==1 && self.openBarrage){
        		self.Barrage1.ranOnePopEven(self.pushBarrage);
        		//发送后重置数据
        		self.pushBarrage = [];
        	}
        }, 500);
	   /* function fsetBarrage(){
	    	if(self.allBarrages.length>0 && self.Barrage1!=null){
		    	let txt  = self.allBarrages[0].split(':')[1];

		    	//self.speed = txt.length*10;
		    	self.Barrage1.userSetPop(txt);

		    	self.showBarrages = self.showBarrages.concat(self.allBarrages.splice(0,1));
		    	if(self.showBarrages.length>=100) self.showBarrages.splice(-51,50);
	    	}
	    	self.setBarrage = setTimeout(fsetBarrage, self.speed);
	    }*/
	    //fsetBarrage();
	    //////添加视频事件
	    self.addVideoEvents();
    },
    //销毁前
    beforeDestory: function(){
    	//关闭之前的链接
    },
    //销毁后
    destroyed: function(){
    	//关闭之前的链接
    	this._WebSocket.close();
    	Indicator.close();
    	//this.Barrage1.clearFlipPop();
    	clearInterval(this.setBarrage);
    	clearInterval(this.getCountTimer);
    },
    filters: {
    	isstr: function(value){
    		if (!value) return ''
    		//value = value.toString();
    		value = value.replace("&amp;","&");
    		return value;
    	}
    },
    watch: {
        'matchs': ['defaultMatch'],
        '$route'(to, from){
    		this._WebSocket.close();
    	},
        /*'allBarrages'(to, from){
        	let pop_texts = this.$refs.pop_texts;
        	//console.log(pop_texts);
        },*/
        'func_avtive'(to, from){
        	if(this.system=="ios") return false;
        	if(this.func_avtive){
        		this.showLive = false;
        		this.vstart = false;
        	}else{
        		this.showLive = true;
        		this.$nextTick(function () {
	        		//重新绑定事件
	        		this.addVideoEvents();
        		});
        	}
        }
    }
}
</script>