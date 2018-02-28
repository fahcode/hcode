<template>
<div class="view pop videoPop">
  <div class="box">
        <div class="navbar">
            <span class="close" @click="closePop()">
                <i class="ic icon-back"></i>
                <span>关闭</span>
            </span>
        </div>
        <div class="videoBox">
            <iframe :src="link" frameborder="0" width="100%" height="100%"></iframe>
        </div>   
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Indicator } from 'mint-ui';

export default {
    name: 'videoPop',
    data(){
      return {
            link: this.vdata
      }
    },

    methods: {
        closePop(){
            this.link = "";
            this._toggle({
                key: 'video',
                val: false
            })
        },
      ...mapActions(['_toggle'])
    },
    props: ['vdata'],
    created: function () {},
    mounted: function(){},
    //销毁前
    beforeDestory: function(){

    }
}
</script>
