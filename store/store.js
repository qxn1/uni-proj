//导入Vue和vuex
import Vue from "vue"
import Vuex from "vuex"
//导入购物车模块。
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

//将vuex安装为vue的插件
Vue.use(Vuex)

//创建store的实例对象
const store = new Vuex.Store({
	modules:{
		// 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
        // 购物车模块中 cart 数组的访问路径是 
		'm_cart':moduleCart,
		// 挂载购物车收货地址的 vuex 模块，模块内成员的访问路径被调整为 m_user
		'm_user':moduleUser
	}
})

//向外共享store 的实例对象
export default store