<template>
<div class="view Schedule">
	<img src="../assets/images/schedule1.png" alt="schedule">
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  	name: 'Schedule',
  	data(){
  		return {
  		}
  	},
  	methods: {
  		...mapActions(['_toggle'])
  	},
  	created: function () {
    	let route_name = this.$route.name;
    	let id = this.$route.params.id;
    	console.log(id)
    	this._toggle({
        	atype: 'nav',
        	val: route_name
        });
    },
}
</script>