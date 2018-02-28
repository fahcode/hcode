<template>
<div class="tipsPops">
    
    <div class="inner nativePop" v-show="tipsPops.nativePop">
      <div class="popbg"></div>
      <div class="box fcc">
        <img src="../assets/images/tips_native_img.png" alt="">
        <p>本页面仅支持在<br>游戏客户端、以及微信中浏览</p>
      </div>
    </div>
    <div class="inner directionPop">
      <div class="popbg"></div>
      <div class="box fcc">
        <img src="../assets/images/tips_direction_img.png" alt="">
        <p>本页面仅支持横屏显示<br>请横置手机查看</p>
      </div>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  	name: 'tipsPops',
  	data(){
  		return {}
  	},
    computed: {
        ...mapState(['tipsPops'])
    },
  	methods: {
        closePop(){
        },
  		...mapActions(['_toggle'])
  	},
    props: ['pdata'],
  	created: function () {
        let self = this;
        
    },
    mounted: function(){

    },
}
</script>
