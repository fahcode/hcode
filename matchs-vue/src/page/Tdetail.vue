<template>
<div class="view Tdetail">
	<div class="box">
		<button class="closeBtn" @click="goBack()"></button>
		<div class="head">
			<div class="tlogo"><img :src="teamdetail.img" :alt="teamdetail.name"></div>
			<div class="if">
				<p class="ti" v-text="teamdetail.name"></p>
				<p class="tx" v-html="teamdetail.sign"></p>
			</div>
		</div>
		<div class="tcontent">
			<div class="scrollb">
				<p class="info" v-html="teamdetail.description"></p>
				<ul class="t_member">
					<li v-for="(item, index) in members" :key="index">
						<div class="hdimg"><img :src="item.img" :alt="item.name"></div>
						<span class="name" v-text="item.name"></span>
						<div class="txt" v-html="item.description"></div>
            
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { teamDetail } from '../service/getData'

export default {
  	name: 'Tdetail',
  	data(){
  		return {
  			teamid: 0,
  			teamdetail: {},
  			members: []
  		}
  	},
  	methods: {
  		goBack(){
  			console.log(this.$route)
  			this.$router.push('/team/' + this.teamid);
  		}
  	},
  	created: function(){
  		let mid = this.$route.params.mid;
  		let pid = this.$route.params.pid;
  		this.teamid = mid;
  		//获取战队详情
        teamDetail(pid).then(res =>{
            if(res.ret == 1){
                let packet = res.data;

                this.teamdetail = packet.teamdetail;
                this.members = packet.members;
            }else{
                alert(res.msg);
            };
        })
  	},
  	mounted: function(){

  	}
}
</script>