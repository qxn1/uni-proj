<template>
	<view>
		<!-- 主体滑动部分 -->
		<view class="scroll-view-container">
		<!-- 左侧一级滑动标题选择 -->
		<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
			<block v-for="(item,i) in cateList" :key="i">
			<view :class="['left-scroll-view-item', i===active ? 'active' : '']"  @click="activeChanged(i)">{{item.cat_name}}</view>
			</block>
		</scroll-view>
		<!-- 右侧商品详情 -->
		<scroll-view class="right-scroll-view" scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
			<view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
				<!-- 二级分类标题 -->
				<view class="cate-lv2-title">/ {{item2.cat_name}}/</view>
				<!-- 三级分类 -->
				<view class="cate-lv3-list">
					<navigator class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" :url="'/subpkg/goods_list/goods_list?cid='+item3.cat_id"     >
						<!-- 错误<image>{{item3.cat_icon}}</image> -->
						<image :src="item3.cat_icon"></image> 
						<text>{{item3.cat_name}}</text>
					</navigator>
				</view>
			</view>
		</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//屏幕可用高度
				wh:0,
				//左侧一级分类数据列表
				cateList:[],
				//二级分类数据列表
				cateLevel2:[],
				//一级分类被选中时的类名
				active:0,
				//解决三级导航标题被选中时，不顶格
				scrollTop:0,
			};
		},
		onLoad(){
			//获取Uniapp定义的系统参数设置，动态根据手机来适应屏幕高度
			const sysInfo = uni.getSystemInfoSync()
				//console.log(sysInfo)
			this.wh = sysInfo.windowHeight
			
			//调用获取一级商品分类数据
			this.getCateList()
			//调用获取二级商品分类数据
			// this.geiCateLevel2()
		},
		methods:{
			//获取商品分类数据
			async getCateList(){
				 const {data:res }= await uni.$http.get('/api/public/v1/categories')
				console.log(res)
				if(res.meta.status !==200){
					return uni.$showMsg}
				this.cateList = res.message
				//二级分类属于一级分类下的子分类，所以直接在这里取值。
				this.cateLevel2 = res.message[0].children
			},
			//点击选中一级分类
			activeChanged(i){
				this.active=i
				//在一级分类选中项改变之后，为二级分类列表数据重新赋值。
				this.cateLevel2=this.cateList[i].children
				
				//解决三级导航标题被选中时，不顶格
				//每次在一级分类选中项改变之后，把此项结果改为零。
				this.scrollTop=this.scrollTop === 0 ? 1 : 0
			},
			// async geiCateLevel2(){
			// 	const {data:res }= await uni.$http.get('/api/public/v1/categories')
			// 	if(res.meta.status !==200){
			// 		return uni.$showMsg}
			// 	this.cateLevel2 = res.message[0].children
			// }
			//点击三级分类跳转到商品列表页面
			// gotoGoodsList(){
			// 	uni.$http.get('')
			// }
		}
	}
</script>

<style lang="scss">
.scroll-view-container{
	display: flex;
	.left-scroll-view{
		width: 120px;
		.left-scroll-view-item{
			background-color: #f7f7f7;
			line-height: 60px;
			text-align: center;
			font-size: 12px;
			position: relative;
			
			&.active{
				background-color: #fff;
				&::before{
					content: "";
					display: block;
					position: absolute;
					width: 3px;
					height: 30px;
					background-color: #C00000;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
				}
			}
		}
	}
}
.cate-lv2-title{
	font-size: 12px;
	    font-weight: bold;
	    text-align: center;
	    padding: 15px 0;
}
.cate-lv3-list{
	display: flex;
	 flex-wrap: wrap;
	// justify-content: space-around;
	.cate-lv3-item{
		width: 33.33%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 10px;
		image{
			width: 60px;
			height: 60px;
		}
		text{
			font-size: 12px;
		}
	}
}
</style>
