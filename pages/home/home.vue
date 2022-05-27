<template>
	<view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list" >
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 商品楼层区域 -->
		<view class="floor-list" >
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
			
			<!-- 楼层图片区域 -->
			<view class="floor-img-box">
			 <!-- 左侧大盒子 -->
			 <navigator class="left-img-box"  :url=item.product_list[0].url>
				<!-- mode，宽度或者高度不变，其余自适应 -->
				<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
			 </navigator>
			 <!-- 右侧小盒子 -->
			 <view class="right-img-box">
				<navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url=item2.url>
					<image :src="item2.image_src" :style="{width: item2.image_width+'rpx'}"  mode="widthFix" ></image>
				</navigator>
			 </view>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//存放轮播图的数组
				swiperList:[],
				//存放分类导航的数组
				navList:[],
				//存放商品楼层的数组
				floorList:[]
			};
		},
	onLoad() {
		this.getSwiperList()
		this.getNavList()
		this.getFloorList()
	},
		methods:{
			//请求轮播图数据
			async getSwiperList(){
				const {data: res} = await uni.$http.get('/api/public/v1/home/swiperdata')
				//console.log(res)
				if(res.meta.status !==200){
					//请求失败的弹窗
					return uni.$showMsg()
				}
				this.swiperList = res.message
			},
			//请求分类数据
			async getNavList(){
				const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
				//console.log(res)
				if(res.meta.status !==200){
					//请求失败的弹窗
					return uni.$showMsg()
				}
				this.navList = res.message
			},
			//点击跳转到tabbar 页面
			navClickHandler(item){
				//console.log(item);
				if(item.name==="分类"){
					uni.switchTab({
						url:"/pages/cate/cate"
					})
				}
			},
			//请求商品楼层区的数据
			async getFloorList(){
				const {data: res} = await uni.$http.get('/api/public/v1/home/floordata')
				console.log(res)
				//res.meta.status===200?this.floorList=res.message:uni.$showMsg
				if(res.meta.status !==200){
					//请求失败的弹窗
					return uni.$showMsg()
				}
				//通过双层forEach循环，处理url地址，让地址跳转到subpkg组件页面
				//操作：第一层循环出三个楼层，第二层循环出每个楼层的五件商品详情，将商品详情中的navigator_url通过split分隔出参数，再拼接自定义组件的地址，得到跳转的新URL
				res.message.forEach(floor=>{
					floor.product_list.forEach(product=>{
						product.url='/subpkg/goods_list/goods_list?'+product.navigator_url.split('?')[1]
					})
				}),
				this.floorList=res.message
			}
		}
	}
</script>

<style lang="scss">
swiper{
	height: 330rpx;
	.swiper-item,
	image{
		height: 100%;
		width: 100%;
	}
}
.nav-list{
	display: flex;
	justify-content:space-around;
	margin: 15px 0;
	.nav-img{
		width: 128rpx;
		height: 140rpx;
	}
}
.floor-title{
	height: 60rpx;
	width: 100%;
	
}
.right-img-box {
	
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

.floor-img-box {
    display: flex !important;
     padding-left: 10rpx;
  }
</style>
