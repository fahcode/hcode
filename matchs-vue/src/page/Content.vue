<template>
<div class="view Content">
	<div class="left">
		<div class="banners">
			<mt-swipe class="ul" :auto="4000">
				<mt-swipe-item class="li" v-for="item in banners" :key="item.id"><img :src="item.img" :alt="item.title"><a :href="item.link" :pid="item.id"></a></mt-swipe-item>
			</mt-swipe>
		</div>
		<nav>
			<ul @click="toggle($event)">
				<li class="bl" :class="{'on': rname==''||rname=='news'||rname=='ndetail'}"><router-link class="link_b" to="/news">
					<p><i class="ic news_ic"></i>新闻资讯</p>
				</router-link></li>
				<!-- :class="{'op': (mid==item.id)}" -->
				<li class="bl op" v-for="(item, index) in matchsList" :key="item.id" :data-idx="index" :class="{'op': (sopen || (mid==item.id))}">
					<router-link class="link_b" :to="'/schedule/' + item.id"><p><i class="ic trophy_ic"></i>{{item.title}}</p></router-link>

					<ul class="subul">
						<li :class="{'on': (rname=='schedule'&&mid==item.id)}"><router-link class="link_b" :to="'/schedule/' + item.id">
							<p>赛程</p>
						</router-link></li>
						<li :class="{'on': (rname=='video'&&mid==item.id)}"><router-link class="link_b" :to="'/video/' + item.id">
							<p>视频</p>
						</router-link></li>
						<li :class="{'on': ((rname=='team'||rname=='tdetail')&&mid==item.id)}"><router-link class="link_b" :to="'/team/' + item.id">
							<p>战队介绍</p>
						</router-link></li>
						<li :class="{'on': (rname=='gameinfo'&&mid==item.id)}"><router-link class="link_b" :to="'/gameinfo/' + item.id">
							<p>赛事介绍</p>
						</router-link></li>
					</ul>
				</li>
			</ul>
		</nav>
	</div>
	<div class="right">
		<div class="hideb">
			<transition :name="child_transition" mode="out-in"> 
	        <router-view class="Router"/>
	        </transition>
        </div>
	</div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { newsBanner, matchList } from '../service/getData'

export default {
  	name: 'Content',
  	data () {
	    return {
	    	child_transition: 'moveTopIn',
	    	banners: [],
	    	matchsList: this.matchs,
	    	rname: '',
	    	mid: 0,
	    	sopen: true
	    }
  	},
  	computed: {
  		...mapState(['matchs'])
  	},
  	methods: {
        toggle: function(e){
        	var self = this;
        	let target = e.target;
        	let selected, idx;
        	//////委派事件
        	if (target.nodeName.toLowerCase() === 'li') {
	        	selected = e.target.getAttribute('data-ntype');
	        	idx = e.target.getAttribute('data-idx');
        	}else if(target.nodeName.toLowerCase() !== 'ul'){
        		var oldTarge = target;
        		/////循环到li的下一级
        		while(oldTarge.parentNode.nodeName.toLowerCase() !== 'li'){
        			oldTarge = oldTarge.parentNode;
        		};
        		selected = oldTarge.parentNode.getAttribute('data-ntype');
        		idx = oldTarge.parentNode.getAttribute('data-idx');
        	};
        	if(idx != null){
        		//控制展开
        		for(let x in this.matchsList){
        			this.matchsList[x].open = false;
        			if(x == idx) this.matchsList[x].open = true;
        		}
        		self.sopen = false;
        	}
        	////切换hover
    		this._toggle({
            	key: 'nav',
            	val: selected
            });
        	
        },
        ...mapActions(['_toggle'])
    },
    created: function () {
    	//路由页面的时候 控制展开那个
    	this.rname = this.$route.name;
    	this.mid = this.$route.params.mid;
    	this.matchsList = this.matchs;

        //获取轮播图
    	newsBanner().then(res =>{
        	if(res.ret == 1){
        		let data = res.data;
        		this.banners = data;
        	}
        })
        if(this.matchs.length<1){
        	//赛事
	    	matchList().then(res =>{
	        	if(res.ret == 1){
	        		let data = res.data;
	        			data[0].open = true;

	        		this.matchsList = data;
	        		this._toggle({
		            	key: 'matchs',
		            	val: data
		            });
	        	}
	        })
        };
    },
    mounted: function(){
    	
    },
    watch: {
		'$route' (to, from) {
			//路由页面的时候 控制展开那个
			this.rname = this.$route.name;
			this.mid = this.$route.params.mid;
			/////在战队详情时，使用另一种动画效果
	    	if(this.rname == 'tdetail' || this.rname == 'team'){
	    		this.child_transition = 'fadeBigInFadeOut';
	    	}else{
	    		this.child_transition = 'moveTopIn';
	    	};

		}
	}
}
</script>