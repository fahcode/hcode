<template>
    <div id="app">
        <div class="views">
            <transition name="moveRightIn" mode="out-in">
            <router-view class="Router"/>
            </transition>

            <transition :name="fun_transition">
            <Func-view v-if="func_avtive" state="单独功能区域"></Func-view>
            </transition>

            <transition name="fadeShrinkIn">
            <Func-pops v-show="funcPops.giftPop||funcPops.sharePop" pdata="有功能的弹窗"></Func-pops>
            </transition>

            <transition name="fadeShrinkIn">
            <Tips-pops  pdata="提示的弹窗"></Tips-pops>
           </transition>

            <div class="menu">
                <div class="mu_btn" @click="showView()"><img :src="icon" alt="头像"></div>
                <div class="mu_tips" v-show="!func_avtive"></div>
                <div class="mu_txt" v-show="func_avtive">
                    <p v-text="nickname"></p>
                    <span v-text="area"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import { matchList, finishshare } from './service/getData'
import FuncView from './page/Func.vue'
import FuncPops from './components/funcPops.vue'
import TipsPops from './components/tipsPops.vue'


export default {
  name: 'app',
  data(){
        return {}
    },
    //计算属性
    computed: {
        ...mapState(['nickname', 'area', 'icon', 'func_avtive', 'fun_transition', 'funcPops', 'tipsPops'])
    },
    ///函数
    methods: {
        showView: function(){
            this._toggle({
                key: "func",
                val: 'fadeShrinkIn'
            });
        },
        setFinishshare(){
            finishshare().then(res => {
                if(res.ret == 1){
                    alert('分享成功！');
                }else{
                    alert(res.msg)
                }
            })
        },
        ...mapActions(['_toggle'])
    },
   
    created: function () {
        var self = this;
        //赛事
        matchList().then(res =>{
            if(res.ret == 1){
                let data = res.data;
                    data[0].open = true;

                this._toggle({
                    key: 'matchs',
                    val: data
                })
            }else{
                alert(res.msg)
            }
        });
        /////通过cookie获取用户信息
        let nickname = _Tool.selectCookie('nickname'),
            area = _Tool.selectCookie('area'),
            icon = _Tool.selectCookie('icon', 'unescape');
            
        //if(!!nickname && !!area && !!icon){
            this._toggle({
                key: 'user',
                val: {nickname: (!!nickname? nickname: ''), area: (!!area? area: ''), icon: (!!icon? icon: '')}
            })
        //}
        /////第一次初始化微信分享
        if(_Tool.isWeixin()){
            _Tool.weixin('wx0fcf7f47419c8171',{
                title: '《街篮》2017全球总决赛', 
                desc: '1月6日，全球总决赛火热直播中，看比赛即送精美礼包！', 
                img: 'http://act.jl.ztgame.com/match/images/wxshare.png', 
                link: 'http://act.jl.ztgame.com/match/indexforwechat.php'
            },function(){
                self.setFinishshare();
            },function(){
                self.setFinishshare();
            })
        };
        
        let system = _Tool.issystem(),
            isWX = _Tool.isWeixin();
        this._toggle({
            key: 'system',
            val: system
        })
        this._toggle({
            key: 'weixin',
            val: isWX
        })
    },
    //挂载后的回调
    mounted(){
        var self = this;
        _Tool.setWinHei('app');
        ////判断是否是横屏
        _Tool.orientation(function(orientation){
            /*self._toggle({
                key: 'tipsPops',
                val: {directionPop: orientation=='portrait'? true: false}
            })*/
            if(orientation=='landscape') _Tool.setWinHei('app');
        })
        ///判断是否微信和原生app里面
        if (!_Tool.isWeixin() && !!!_Tool.selectCookie('nickname') && !window.isdev) {
            //不是微信或者app提示弹窗
            self._toggle({
                key: 'tipsPops',
                val: {nativePop: true}
            })
        };
    },
    //监听
    watch: {
        '$route' (to, from) {
            const toDepth = to.path.split('/').length
            const fromDepth = from.path.split('/').length
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
　  },
    //引入的模块
    components: {
        FuncView,
        FuncPops,
        TipsPops
    },
}
</script>
