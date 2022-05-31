<!-- 商品详情项组件 -->
<template>
	<view class="goods-item">
		<!-- 左侧图片盒子 -->
		<view class="goods-item-left">
			<!-- 给商品图片旁边加上勾选项，并动态绑定，和存储在购物车中的商品属性goods_state关联（goods_state的值是Boolean，true表示选中，显示勾选项），颜色为红色，购物车结算时会使用 -->
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioChangeHandler"></radio>
			<image class="goods-pic" :src="goods.goods_small_logo || defaultPic"></image>
		</view>
		<!-- 右侧图片盒子 -->
		<view class="goods-item-right">
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">{{goods.goods_price | toFixed}}元</view>
				<!-- 商品选择的数量 -->
				<!-- uni中的组件 -->
				<!-- 动态绑定商品选定的数量值 -->
				 <!-- @change监听事件变化 -->
				<uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
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
			},
			//自定义属性，通过属性值的变化
			//v-if手动动态决定，是否展示图片左侧的勾选项
			showRadio:{
				type:Boolean,
				// 先给定false的值。如果外界没有重新指定,则默认不显示radio组件。
				default:false,
			},
			//v-if手动动态决定，是否展示图片右侧的数量组件
			showNum:{
				type:Boolean,
				default:false,
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
		},
		methods:{
			//自定义方法
			// 勾选项radio组件的事件处理函数，子传父传递给了cart页面
			radioChangeHandler(){
				// 通过this.$emit()触发cart页面通过@绑定的radio-change事件,第二个参数为事件触发时传递的数据
				this.$emit('radio-change',{
					//商品ID和勾选状态的取反，勾选状态的取反是商品最新的勾选状态
					goods_id:this.goods.goods_id,
					goods_state:!this.goods.goods_state
				})
			},
			// 数量num组件的事件处理函数，子传父传递给了cart页面，让cart页面能够监听到事件变化
			numChangeHandler(val){
				// 通过this.$emit()触发cart页面通过@绑定的num-change事件,第二个参数为事件触发时传递的数据对象
				this.$emit('num-change',{
					//商品ID和勾选状态的取反，勾选状态的取反是商品最新的勾选状态
					goods_id:this.goods.goods_id,
					//为了保证数量值是数字属性，给+号转换
					goods_count:+val,
					//或者val-0
				})
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
		display: flex;
		justify-content: space-between;
		align-items: center;
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
		// 让右侧的盒子占满右侧空间。
		flex:1;
		.goods-name{
			font-size: 13px;
			
		}
		.goods-info-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.goods-price{
				color: #C00000;
				font-size: 16px
			}
		}
	}
}
</style>