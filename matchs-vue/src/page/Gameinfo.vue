<template>
<div class="view Gameinfo">
	<div class="box">
		<div class="head">
			<div class="glogo"><img :src="packet.img" :alt="packet.title"></div>
			<div class="if">
				<span class="ti" v-text="packet.title"></span>
				<p class="tx">
          <p v-text="packet.first"></p>
          <p v-text="packet.second"></p>
				</p>
			</div>
		</div>
		<div class="tcontent" v-html="packet.description"></div>
	</div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { descInfo } from '../service/getData'

export default {
  	name: 'Gameinfo',
  	data(){
  		return {
  			packet: {}
  		}
  	},
  	methods: {
        getInfo(){
            let mid = this.$route.params.mid;
            //赛事介绍 
            descInfo(mid).then(res =>{
                if(res.ret == 1){
                    let packet = res.data;

                    this.packet = packet;
                }else{
                    alert(res.msg);
                };
            })
        },
  		goBack(){
  			this.$router.push('/team/' + this.teamid);
  		}
  	},
  	created: function(){
  		this.getInfo();
  	},
    watch: {
        '$route': ['getInfo']
    },
}
</script>