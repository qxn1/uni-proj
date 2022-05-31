<template>
	<view>
		<view class="my-settle-container">
			<!-- 全选 -->
			<!-- changeAllState是来改变所有的商品勾选状态 -->
			<label class="radio" @click="changeAllState">
				<radio color="#C00000" :checked="isFullCheck"></radio>
				<text>全选</text>
			</label>
			<!-- 合计 -->
			<view class="amount-box">
				合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
			</view>
			<!-- 结算按钮 -->
			<view class="btn-settle">
				结算（{{checkedCount}}）
			</view>
		</view>
	</view>
</template>

<script>
	// 导入cart里面的方法
	import {mapGetters,mapMutations} from 'vuex'
	
	
	export default {
		name:"my-settle",
		data() {
			return {
				
			};
		},
		computed:{
			// 调用辅助函数，checkedCount则可以直接在页面this使用或者放在HTML中渲染
			//checkedCount是勾选的商品总数量，渲染到结算数量里面
			//total是购物车所有商品是总数量值
			//判断，当checkedCount=total时，全选按钮应该处于勾选状态
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			//判断是否全选,将结果动态绑定到页面
			//返回的结果是true或false
			isFullCheck(){
				return this.total === this.checkedCount
			}
		},
		methods:{
			//在m_cart中更新购物车中所有商品的勾选状态
			...mapMutations('m_cart',['updateAllGoodsState']),
			changeAllState(){
				//当前全选按钮的最新状态是isFullCheck的取反，如果点击时isFullCheck为true，则点击后就是false
				//console.log(!this.isFullCheck);
				//把最新的全选按钮的状态传给updateAllGoodsState，成为updateAllGoodsState的newState，赋予所有购物车的勾选状态
				this.updateAllGoodsState(!this.isFullCheck)
			}
		}
	}
</script>

<style lang="scss">
.my-settle-container{
	// 要固定在最下面,固定定位
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	font-size: 14px;
	padding-left: 5px;
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.radio{
		display: flex;
		align-items: center;
	}
	.amount-box{
		.amount{
			color: #C00000;
			font-weight: bold;
		}
	}
	.btn-settle{
		background-color: #C00000;
		height: 100%;
		color: white;
		line-height: 50px;
		padding: 0 10px;
		// 给结算部分固定最小宽度
		min-width: 100px;
		text-align: center;
	}
}
</style>