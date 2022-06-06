//购物车收货地址
export default{
	//为当前模块开启命名空间
	namespaced: true,
	state:()=>({
		//购物车结算页面。用户的收货地址
		//持久化存储:3取数据,读取本地的收货地址数据，初始化address对象。
		//address:{}
		address:JSON.parse(uni.getStorageSync('address') || '{}'),
		token:'qiaoxiaona',
		//用户信息对象
		//JSON.parse将结果转化为对象
		userinfo:JSON.parse(uni.getStorageSync('userinfo')|| '{}'),
		//重定向的object对象，用于在结算页面跳转到登录页面后，自动跳回结算页面，优化用户体验
		redirectInfo:null
	}),
	
	mutations:{
		//在vuex中更新收货地址
		updateAddress(state,address){
			state.address = address
			//持久化存储:2更新数据,通过this comment方法调用m_user模块下SaveAddressToStorage方法,将address对象持久化存储到本地。
			this.commit('m_user/saveAddressToStorage')
		},
		//持久化存储:1存数据，定义将address持久化存储到本地mutations方法。
		saveAddressToStorage(state){
			//将state.address转化为字符串后存贮到本地的address
			uni.setStorageSync('address',JSON.stringify(state.address))
		},
		
		//更新登录时用户信息userinfo
		updateUserInfo(state,userinfo){
			state.userinfo=userinfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		//用户信息userinfo持久化存储到本地mutations方法
		saveUserInfoToStorage(state){
			uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
		},
		
		//token
		 updateToken(state, token) {
		      state.token = 'token'
		      this.commit('m_user/saveTokenToStorage')
		    },
		    saveTokenToStorage(state) {
		      uni.setStorageSync('token', state.token)
		    },
			
			updateRedirectInfo(state,info){
				state.redirectInfo=info
			}
		   
	},
	getters:{
		//收货地址
		addstr(state){
			//先判断地址栏为不为空。随便选择一个省市县的信息。
			if(!state.address.provinceName) return ''
			//如果为空，返回空对象。否则返回
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		},
	}
	
	
}