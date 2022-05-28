<template>
	<view class="goods-item">
		<!-- 左侧图片盒子 -->
		<view class="goods-item-left">
			<image class="goods-pic" :src="goods.goods_small_logo || defaultPic"></image>
		</view>
		<!-- 右侧图片盒子 -->
		<view class="goods-item-right">
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<view class="goods-price">{{goods.goods_price | toFixed}}元</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		props:{
			//使用组件的goods_list页面需要使用goods属性
			goods:{
				type:Object,
				default:{}
			}
		},
		data() {
			return {
				//给失效的图片地址，添加默认地址。
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		//使用过滤器处理商品价格
		filters:{
			//toFixed为过滤器名字
			toFixed(num){
				//Number是将外界传递进来的值（有可能是字符串格式的值）转化为数字型，然后toFixed（）保留两位小数，输出
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
.goods-item{
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;
	.goods-item-left{
		margin-right: 5px;
		.goods-pic{
			width: 100px;
			height: 100px;
			display: block;
			
		}
	}
	.goods-item-right{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.goods-name{
			font-size: 13px;
			
		}
		.goods-info-box{
			.goods-price{
				color: #C00000;
				font-size: 16px
			}
		}
	}
}
</style>