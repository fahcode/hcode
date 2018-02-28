import Vue from 'vue'
import Router from 'vue-router'

import Live from '../page/Live.vue'
import Centent from '../page/Content.vue'
import News from '../page/News.vue'
import Ndetail from '../page/Ndetail.vue'
import Match from '../page/Match.vue'
import Schedule from '../page/Schedule.vue'
import Video from '../page/Video.vue'
import Team from '../page/Team.vue'
import Tdetail from '../page/Tdetail.vue'
import Gameinfo from '../page/Gameinfo.vue'
import Match2 from '../page/Match2.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/live',
			name: 'Live',
			component: Live
		},
		{
			path: '/',
			name: "Centent",
			component: Centent,
			children: [
				{
					path: '/',
					name: 'news',
					component: News
				},
				{
					path: 'news',
					name: 'news',
					component: News
				},
				{
					path: 'schedule/:mid',
					name: 'schedule',
					component: Schedule
				},
				{
					path: 'video/:mid',
					name: 'video',
					component: Video
				},
				{
					path: 'team/:mid',
					name: 'team',
					component: Team
				},
				{
					path: 'tdetail/:mid/:pid',
					name: 'tdetail',
					component: Tdetail
				},
				{
					path: 'gameinfo/:mid',
					name: 'gameinfo',
					component: Gameinfo
				}
			]
		}
	]
})
