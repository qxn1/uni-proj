<template>
	<!-- 解决商品价格在初次加载中闪烁的问题:由于在商品详情数据请求回来之前，goods_info中的值为空。因此初次渲染界面时会导致goods_name,goods_price等闪烁的问题。可以判断goods_name,goods_price属性的值是否存在。使用v-if指令控制页面的显示与隐藏。 -->
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,i) in goods_info.pics" :key="i">
				<!-- 为了让用户在点击某一张图片时,对应放大的是这张图片,所以需要传入图片的 i -->
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box" >
			<!-- 商品价格 -->
			<view class="price">{{goods_info.goods_price}}元</view>
			<!-- 商品信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名字 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 商品收藏区 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费说明 -->
			<view class="yf">快递:免运费</view>
		</view>
		<!-- 使用unionup当中组件，来将带有html标签内容渲染到页面当中 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		
		<!-- 商品导航组件区域 -->
		<view class="goods_nav">
			<!-- fill控制右侧按钮的样式,Options左侧按钮的配置项,Button-group右侧按钮的配置项。Click左侧按钮的点击事件处理函数,button右侧按钮的点击事件处理函数。 -->
			<uni-goods-nav :fill="true" :options="options" :button-group="customButtonGroup" @click="onClick"
							@buttonClick="buttonClick"  />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//商品详情对象
				goods_info:{},
				//商品购物车导航组件，在uniapp中
				//左侧按钮的配置对象
				 options: [{
				          icon: 'shop',
				          text: '店铺',
				          infoBackgroundColor: '#007aff',
				          infoColor: "red"
				        }, {
				          icon: 'cart',
				          text: '购物车',
				          info: 2
				        }],
				//右侧
				customButtonGroup: [{
				            text: '加入购物车',
				            backgroundColor: '#ff0000',
				            color: '#fff'
				          },
				          {
				            text: '立即购买',
				            backgroundColor: '#ffa200',
				            color: '#fff'
				          }
				        ]
			};
		},
		onLoad(options){
			 //如果API文档当中有请求参数,那么需要在date当中定义请求参数，并在页面刚加载时（onLoad（）中）把后台响应过来的参数传递给自定义的参数，并在请求数据时带上请求参数。
			 const goods_id = options.goods_id
			 //获取商品详情数据
			 this.getGoodsDetail(goods_id)
		},
		
		methods:{
			//获取商品详情数据
			async getGoodsDetail(goods_id){
				const {data:res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id : goods_id})
				if(res.meta.status !==200) return uni.$showMsg()
				//console.log(res);
				
				//使用字符串的replace方法，为img标签添加行内的style样式，从而解决图片底部空白间隙的问题。
				//img图片下方默认会有3像素的白色空隙,设置display:block属性,可以将img变为块级元素，从而消除空隙。
				//用正则找出相对应的img标签,并且返回带有行内样式的img标签替换。
				//第二次替换是为了解决web格式的图片在iOS手机上无法正常显示的问题。用正则将web全局找出并替换为jpg的格式。
				res.message.goods_introduce=res.message.goods_introduce.replace(/<img /g,'<img style="display:block;"').replace(/webp/g,'jpg')
				
				this.goods_info=res.message
				console.log(this.goods_info)
			},
			//点击轮播图图片可以放大预览对应图片
			preview(i){
				uni.previewImage({
					//预览时默认显示图片的索引,这里传递当前的索引值，可以让预览的图片从点击的图片开始，而不是从第一张开始。
					current:i,
					//所有图片url地址的数组。map循环，返回x中图片属性（这里使用箭头函数省略了return)
					urls:this.goods_info.pics.map(x=>x.pics_big)
				})
			},
			//Click左侧按钮的点击事件处理函数,button右侧按钮的点击事件处理函数
			onClick(e){
				// console.log(e);
				//e返回中包含索引，购物车等选项。使用户在点击购物车图标时，跳转到购物车的页面。
				if(e.content.text==="购物车"){
					uni.switchTab({
						url:'/pages/cart/cart'
					})
				}
			}
			
		}
	}
</script>

<style lang="scss">
swiper{
	height: 750rpx;
	
	image{
		width: 100%;
		height: 100%;
	}
}
.goods-info-box{
	padding: 10px;
	padding-right: 0;
	.price{
		color: #C00000;
	
	}
	.goods-info-body{
		display: flex;
		justify-content: space-between;
		
		.goods-name{
			font-size: 13px;
			margin-right: 10px;
		}
		.favi{
			width: 120px;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-left: 1px solid #efefef;
			color: gray;
		}
	}
	.yf{
		font-size: 12px;
		color: gray;
		margin: 10px 0;
	}
}

.goods_nav{
	//固定定位，将购物车导航栏固定到页面的最下方。
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;

}
.goods-detail-container{
	//购物车导航栏会覆盖一部分主体数据，所以将主体统一设置底部外边框,数值为导航栏的高度。
	padding-bottom: 50px;
}
</style>
