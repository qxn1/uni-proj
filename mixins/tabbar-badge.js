//因为要调用cart.js里面getters里面的方法，按需导入getters
	import {mapGetters} from 'vuex'
	
    export default{
	//封装
	computed:{
		//调用方法，并通过展开运算()符，把m_cart里面的'total'交给计算属性，映射到购物车页面
		...mapGetters('m_cart',['total'])
	},
	
	//优化，在页面数值改变的时候，不会立即更新，用侦听器
	watch:{
		//监听total的变化
		total(){
			//调用methods中的方法，重新给购物车右上角的徽标赋值
			this.setBadge()
		},
	},
	//声明一个生命周期函数onShow()，在页面刚显示的时候调用
	 onShow(){
	//显示字符串类型的数字徽标
	 	this.setBadge()
	 },
	methods:{
		setBadge(){
			//调用uni的方法，为购物车设置右上角的徽标
			uni.setTabBarBadge({
				//tabbar中购物车的索引为2 
				index:2,
				//文本内容必须是字符串，不能为数字，+''可以转化为字符串
				text:this.total+''
			})
		}
	}
}