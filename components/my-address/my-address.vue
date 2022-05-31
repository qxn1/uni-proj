<template>
	<view>
		<!-- 收货地址的盒子和收货信息的盒子需要按需展示，这里用到v-if和v-else来控制 -->
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address)==='{}'">
			<!-- 使用微信自带组件，primary代表微信主色调,size控制样式大小， -->
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		
		<!-- 渲染收货信息的盒子 -->
		    <view class="address-info-box" v-else @click="chooseAddress()">
		      <view class="row1">
		        <view class="row1-left">
		          <view class="username">收货人：{{address.userName}}</view>
		        </view>
		        <view class="row1-right">
		          <view class="phone">电话：{{address.telNumber}}</view>
		          <uni-icons type="arrowright" size="16"></uni-icons>
		        </view>
		      </view>
		      <view class="row2">
		        <view class="row2-left" >收货地址：</view>
		        <view class="row2-right">{{addstr}}</view>
		      </view>
		    </view>
			
		<!-- 底部边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	//从vuex中按需导入辅助函数
	
	import {mapState,mapMutations,mapGetters} from 'vuex'
	
	export default {
		name:"my-address",
		data() {
			return {
				//收货地址
				//address:{}
			};
		},
		methods:{
			...mapMutations('m_user',['updateAddress']),
			//点击选择收货地址的方法
			async chooseAddress(){
				//调用小程序提供的chooseAddress方法，可以使用选择收货地址的功能。
			//返回值是一个数组，在数组当中结构赋值。第一项为错误对象，第二项为成功之后的收货地址对象。
				//Catch用来捕获错误,return错误对象
				const [err,succ] = await uni.chooseAddress().catch(err=>err)
				
				//当用户成功选择了收获地址
				if (err === null && succ.errMsg === 'chooseAddress:ok'){
					console.log(succ);
					//为data里面的收货地址对象赋值
					//this.address = succ
					//这样可以把用户存进更新的地址存储在vuex中，而不是组件的data里
					this.updateAddress(succ)
					//这里updateAddress方法是mapMutations映射进来的，可以直接this使用
					
				}
			}
		},
		computed:{
			//mapState映射address，因此这里不需在data自定义address
			...mapState('m_user',['address']),
			//封装到vuex的getters中，提高复用性 
			...mapGetters('m_user',['addstr'])
			//收货地址
			// addstr(){
			// 	//先判断地址栏为不为空。随便选择一个省市县的信息。
			// 	if(!this.address.provinceName) return ''
			// 	//如果为空，返回空对象。否则返回
			// 	return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
			// },
			
		}
	}
</script>

<style lang="scss">
.address-border{
	display: block;
	width: 100%;
	height: 5px;
}
.address-choose-box{
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
.address-info-box{
	font-size: 12px;
	height: 90px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 5px;
	.row1{
		display: flex;
		justify-content: space-between;
		.row1-right{
			display: flex;
			justify-content: space-between;		}
	}
	.row2{
		display: flex;
		
		align-items: center;
		margin-top: 10px;
		.row2-left{
			white-space: nowrap;
		}
	}
}
</style>