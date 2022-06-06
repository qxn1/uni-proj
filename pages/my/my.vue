<template>
	<!-- 要根据用户信息是否登陆，决定展示哪个组件，根据登录返回的token判断 -->
	<view class="my-container">
		<!-- 登录页面 -->
	<my-login v-if="!token"></my-login>
	
	<!-- 用户信息页面 -->
	<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	//这样在用户直接在商品详情页加入购物车后，直接返回首页或其他页面时，tabbar里面的 购物车也会显示数字徽标
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {mapState} from 'vuex'
	
	export default {
		//调用导入的badgeMix方法
		mixins:[badgeMix],
		data() {
			return {
				
			};
		},
		computed:{
			// 从m_user模块中,按需导入token字符串
			...mapState('m_user',['token'])
		}
	}
</script>

<style lang="scss">
page, 
.my-container{
	height: 100%;
}
</style>
