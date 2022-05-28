<template>
	<view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandler">
	<view class="my-search-box" :style="{'border-radius':radius+'px'}">
		<!-- 使用uni-ui提供的图标组件 -->
		<uni-icons type="search" size="17"></uni-icons>
		<text class="placeholder">搜索</text>
	</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		data() {
			return {
				
			};
		},
		props:{
			//自定义属性，增强组件复用性，通用性
			 // 背景颜色
			      bgcolor: {
			        type: String,
			        default: '#C00000'
			      },
			      // 圆角尺寸
			      radius: {
			        type: Number,
			        default: 18 // px
			      },
		},
		methods:{
			searchBoxHandler(){
				this.$emit("click")
			}
		}
	}
</script>

<style lang="scss">
	
.my-search-container{
	height: 50px;
	//让组件的使用者可以自定义组件的背景颜色和圆角大小，因此将两个属性分别再在props中定义，并赋予初始值，
	
	// background-color: #C00000;
	display: flex;
	padding: 0 10px;
	align-items: center;
	
	.my-search-box{
		height: 36px;
		background-color: #fff;
		// border-radius: 18px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.placeholder{
			font-size: 15px;
			margin-left: 5px;
		}
	}
}
</style>