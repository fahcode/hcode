<template>
<div class="view pop newsDetailPop">
	<div class="box">
        <button class="closePop" @click="closePop()">关闭</button>
        <div class="hd">
            <p class="ti" v-text="content.title"></p>
            <p class="if">
                <span class="time" v-text="content.publishdate"></span>
                <span class="num"><i class="ic xin_ic"></i>{{content.clicknum}}</span>
            </p>
        </div>
        <div class="contentBox">
            <div class="scrollb" v-html="content.content"></div>
        </div>   
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Indicator } from 'mint-ui';

export default {
  	name: 'viewPop',
  	data(){
  		return {
            content: this.ndata
  		}
  	},

  	methods: {
        closePop(){
            this.content = {};

            this._toggle({
                key: 'newsDetail',
                val: false
            })
        },
  		...mapActions(['_toggle'])
  	},
    props: ['ndata'],
  	created: function () {

    },
    mounted: function(){

    },
    //销毁前
    beforeDestory: function(){},
    watch: {
        'ndata' (to, from) {
            this.content = this.ndata;

            this.$nextTick(function(){
                Indicator.close();
            })
        }
　  }
}
</script>
