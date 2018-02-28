<template>
<div class="pop funcPops">
    <div class="popbg"></div>
    <div class="inner giftPop" v-show="funcPops.giftPop">
        <div class="box fcc">
            <h3>恭喜您获得观赛礼包</h3>
            <p class="txt">您可以点击页面左下角头像后，进入领奖记录页面，<br>查看您获得的礼包CDKEY</p>
            <p class="code" v-text="card"></p>
            <button class="sureBtn" @click="closePop()">确定</button>
            <div class="info">礼包兑换方法：复制礼包码，打开《街篮》，点击左上角头像<br>在弹框中选择 “系统设置” 标签，点击底部“兑换礼包”按钮兑换</div>
        </div>
    </div>
    <div class="inner sharePop" v-show="funcPops.sharePop">
        <div class="box ">
            <img src="../assets/images/tips_share_img.png" alt="分享">
            <p class="txt">成功分享本页面<br>即可领取分享礼包哦</p>
            <button class="sureBtn" @click="closePop('share')">确定</button>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { finishshare } from '../service/getData'

export default {
  	name: 'funcPops',
  	data(){
  		return {
            card: ''
        }
  	},
    computed: {
        ...mapState(['funcPops'])
    },
  	methods: {
        closePop(type){
            this._toggle({
                key: 'funcPops',
                val: {giftPop: false, sharePop: false}
            })
            if(type== 'share' && !_Tool.isWeixin()){
                finishshare().then(res => {
                    if(res.ret == 1){
                        //alert('分享成功！');
                    }else{
                        alert(res.msg)
                    }
                })
            }
        },
  		...mapActions(['_toggle'])
  	},
    props: ['pdata'],
  	created: function () {
        this.card = this.funcPops.card!=''? this.funcPops.card: '';
    },
    mounted: function(){

    },
    //销毁前
    beforeDestory: function(){},
    watch: {
        'funcPops' (to, from) {
            this.card = this.funcPops.card!=''? this.funcPops.card: '';
        }
　  }
}
</script>
