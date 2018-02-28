<template>
<div class="view Schedule">
	<div class="box">
		<div class="imgb" v-for="item in datalist"><img :src="item.img" :alt="item.title"></div>
	</div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { competitionImg } from '../service/getData'

export default {
  	name: 'Schedule',
  	data(){
  		return {
  			datalist: []
  		}
  	},
  	created: function () {
		    this.getDetail()
    },
    methods: {
    	getDetail(){
    		let mid = this.$route.params.mid;
    		
    		competitionImg(mid).then(res =>{
				let data = res.data;
				console.log(data)
				this.datalist = data;
			})
    	}
    },
    watch: {
    	'$route': ['getDetail']
    }
}
</script>