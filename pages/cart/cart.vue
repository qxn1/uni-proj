<template>
	<!-- 控制动态展示，有数据、无数据分别展示不同页面，用v-if/v-else -->
	<!-- 当购物车有数据时显示的页面 -->
	<view class="cart-container" v-if="cart.length !==0">
		<view class="cart-padding">
			<!-- 收货地址组件 -->
			<my-address></my-address>
			 <!-- 商品列表的标题区域 -->
			    <view class="cart-title">
			      <!-- 左侧的图标 -->
			      <uni-icons type="shop" size="18"></uni-icons>
			      <!-- 右侧的文本 -->
			      <text class="cart-title-text">购物车</text>
			    </view>
			<!-- 商品列表区域 -->
			<!-- uni-swipe-action是最外层包裹性质的容器，uni-swipe-action-i为它的子节点提供滑动操作的效果。 -->
			<uni-swipe-action>
					<block v-for="(goods,i) in cart" :key="i">
						<!-- 商品自定义项，在componens中已经声明定义过自定义组件my-goods ，可以直接使用-->
						<!-- 这里的show-radio和showRadio驼峰命名法相同 ，已经定义在了my goose组件当中，目的是控制购物车页面显示勾选项。-->
						<!-- 在radioChangeHandler事件处理函数中，通过事件对象e，得到商品的goods_id和goods_state -->
						<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
					
						<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
					<!-- 	<template v-slot:right>
									<view><text>删除</text></view>
						</template> -->
						</uni-swipe-action-item>
					</block>
			</uni-swipe-action>
			
			<!-- 使用自定义的结算组件 -->
			<my-settle></my-settle>
		</view>
	</view>
	
	<!-- 当购物车数据为空时展示的页面 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	//这样在用户直接在商品详情页加入购物车后，直接返回首页或其他页面时，tabbar里面的 购物车也会显示数字徽标
	import badgeMix from '@/mixins/tabbar-badge.js'
	//按需导入mapState这个辅助函数，让store里面的cart数组映射到当前的页面中，来渲染购物车列表项
	import {mapState,mapMutations} from 'vuex'
	
	export default {
		//调用导入的badgeMix方法
		mixins:[badgeMix],
		
		data() {
			return {
				options:[{
					text:'删除',
					style:{
						backgroundColor:'#C00000'
					}
				}]
				};
			},
		
		computed:{
			//按需导入mapState这个辅助函数，让store里面的cart数组映射到当前的页面中，通过v-for来渲染购物车列表项
			...mapState('m_cart',['cart'])
		},
		methods:{
			//cart.js中mutations定义的方法，更新购物车中商品的勾选状态，映射到这个页面就可以使用this调用updateGoodsState的方法，当radio-change监听到商品状态发生变化时，将updateGoodsState传入radioChangeHandler，就可以修改购物车中的商品勾选状态,并且由于每次都会在updateGoodsState中调用本地存储，所以页面更新也不会丢失当前状态
			...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
			//...mapMutations('m_cart',['updateGoodsCount']),
			
			//这里打印出来的e，就是my-goods中的方法通过替换this.$emit传递出来的数据对象
			radioChangeHandler(e){
				//console.log(e);
				//这一步操作是调用cart.js。Vuex当中方法，下次刷新不会丢失状态。
				this.updateGoodsState(e)
			},
			numberChangeHandler(e){
				//console.log(e)
				this.updateGoodsCount(e)
			},
			
			//右滑后，点击了商品的删除按钮
			swipeItemClickHandler(goods){
				//console.log(goods);
				//传入对应商品的id，在方法中筛选更新
				this.removeGoodsById(goods.goods_id)
			}
			
		}
		//把以下代码封装，放在mimixs中，分别导入使用的页面中，提高复用性
		
		//因为要调用cart.js里面getters里面的方法，按需导入getters
		//import {mapGetters} from 'vuex'
		
		// computed:{
		// 	//调用方法，并通过展开运算()符，把m_cart里面的'total'交给计算属性，映射到购物车页面
		// 	...mapGetters('m_cart',['total'])
		// },
		// //声明一个生命周期函数onShow()，在页面刚显示的时候调用
		// onShow(){
		// 	//显示字符串类型的数字徽标
		// 	this.setBadge()
		// },
		// methods:{
		// 	setBadge(){
		// 		//调用uni的方法，为购物车设置右上角的徽标
		// 		uni.setTabBarBadge({
		// 			//tabbar中购物车的索引为2 
		// 			index:2,
		// 			//文本内容必须是字符串，不能为数字，+''可以转化为字符串
		// 			text:this.total+''
		// 		})
		// 	}
		// }
	}
</script>

<style lang="scss">
	.cart-padding{
		padding-bottom: 50px;
	}
	.cart-title{
	height: 40px;
	display: flex;
	align-items: center;
	padding-left: 5px;
	border-bottom: 1px solid #efefef;
	
	.cart-title-text{
		font-size: 14px;
		margin-left: 10px;
	}
}
.empty-cart{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 150px;
	.empty-img{
		width: 90px;
		height: 90px;
	}
	.tip-text{
		font-size: 12px;
		color:gray;
		margin-top: 15px;
	}
}
</style>
