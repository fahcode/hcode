import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		system: 'ios',
		isWX: false,
		nickname: '',
		area: '',
		icon: '',
		//main页面的对象
		func_avtive: false,
		fun_transition: 'fadeShrinkIn',

		ndetail_active: false,
		video_active: false,
		////保存的赛事数据
		matchs: [],
		//funcPop
		funcPops: {giftPop: false, sharePop: false, card: ''},
		tipsPops: {nativePop: false, directionPop: false},
	},
	getters: {

	},
	mutations: {
		////////////处理全部的toggle
		toggle (state, ops){
			if(ops.key == "system"){
				state.system = ops.val;
			}
			if(ops.key == "weixin"){
				state.isWX = ops.val;
			}
			if(ops.key == "user"){
				state.nickname = ops.val.nickname;
				state.area = ops.val.area;
				state.icon = ops.val.icon;
			}
			if(ops.key == "func"){
				state.func_avtive = !state.func_avtive;
				state.fun_transition = ops.val;
			}
			if(ops.key == "newsDetail"){
				state.ndetail_active = ops.val;
			}
			if(ops.key == "video"){
				state.video_active = ops.val;
			}
			if(ops.key == "matchs"){
				state.matchs = ops.val;
			}
			if(ops.key == "funcPops"){
				state.funcPops = Object.assign({}, state.funcPops, ops.val);
			}
			if(ops.key == "tipsPops"){
				state.tipsPops = Object.assign({}, state.tipsPops, ops.val);
			}
		}
	},
	actions: {
		_toggle ({ commit }, ops){
			commit('toggle', ops)
		}
	}
})

export default store;