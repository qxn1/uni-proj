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
			<view class="btn-settle" @click="settlement">
				结算（{{checkedCount}}）
			</view>
		</view>
	</view>
</template>

<script>
	// 导入cart里面的方法
	import {mapGetters,mapMutations,mapState} from 'vuex'
	
	
	export default {
		name:"my-settle",
		data() {
			return {
				//倒计时的秒数
				seconds:3,
				//定时器的id
				timer:null
			};
		},
		computed:{
			// 调用辅助函数，checkedCount则可以直接在页面this使用或者放在HTML中渲染
			//checkedCount是勾选的商品总数量，渲染到结算数量里面
			//total是购物车所有商品是总数量值
			//判断，当checkedCount=total时，全选按钮应该处于勾选状态
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			...mapGetters('m_user',['addstr']),
			...mapState('m_user',['token']),
			...mapState('m_cart',['cart']),
			//判断是否全选,将结果动态绑定到页面
			//返回的结果是true或false
			isFullCheck(){
				return this.total === this.checkedCount
			}
		},
		methods:{
			//在m_cart中更新购物车中所有商品的勾选状态
			...mapMutations('m_cart',['updateAllGoodsState']),
			...mapMutations('m_user',['updateRedirectInfo']),
			changeAllState(){
				//当前全选按钮的最新状态是isFullCheck的取反，如果点击时isFullCheck为true，则点击后就是false
				//console.log(!this.isFullCheck);
				//把最新的全选按钮的状态传给updateAllGoodsState，成为updateAllGoodsState的newState，赋予所有购物车的勾选状态
				this.updateAllGoodsState(!this.isFullCheck)
			},
			//点击了结算按钮触发
			settlement(){
				//先排除非法情况
				
				//1.先判断用户是否勾选了要结算的商品。
				if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品!')
				//2.再判断用户是否选择了收货地址。
				if(!this.addstr) return uni.$showMsg('请选择收货地址!')
				//3.最后判断用户是否登录。
				//if(!this.token) return uni.$showMsg('请先登录!')
				//3.优化为延时导航，倒计时跳转自动到登录页面
				if(!this.token) return this.delayNavigate()
				
				//4.实现微信支付的功能
				this.payOrder()
			},
			async payOrder(){
				  // 1. 创建订单
				  // 1.1 组织订单的信息对象
				const orderInfo = {
					//真实订单价格为计算出来的，这里写死为0.01
					// order_price:this.checkedGoodsAmount
					order_price:0.01,
					//定义过的收货地址
					consignee_addr:this.addstr,
					//拿到购物车数组cart，过滤出已经勾选的商品，再map循环把商品信息对象处理成服务器需要的格式，再发送给服务器
					goods: this.cart.filter(x => x.goods_state).map(x => ({
					            goods_id: x.goods_id,
								//购物车里面存的商品数量是goods_count
					            goods_number: x.goods_count,
					            goods_price: x.goods_price}))
				}
				
				    // 1.2 发起请求创建订单
				        const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				
				        // 1.3 得到服务器响应的“订单编号”
				        const orderNumber = res.message.order_number
						//console.log(orderNumber);
						
						 // 2. 订单预支付
						        // 2.1 发起请求获取订单的支付信息
						        const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
						        // 2.2 预付订单生成失败
						        if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
						        // 2.3 得到订单支付相关的必要参数
						        const payInfo = res2.message.pay
								
								// 3. 发起微信支付
								        // 3.1 调用 uni.requestPayment() 发起微信支付
								        const [err, succ] = await uni.requestPayment(payInfo)
								        // 3.2 未完成支付
								        if (err) return uni.$showMsg('订单未支付！')
								        // 3.3 完成了支付，进一步查询支付的结果
								        const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
								        // 3.4 检测到订单未支付
								        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
								        // 3.5 检测到订单支付完成
								        uni.showToast({
								          title: '订单支付完成！',
								          icon: 'success'
								        })
			},
			//延时导航的my登录页面
			delayNavigate(){
				//把date中的秒数重置成3.防止下次再结算时，从上次结束时的0秒开始跳转
				this.seconds=3
				this.showTips(this.seconds)
			//开启定时器后，把定时器的ID赋值给timer，
				this.timer = setInterval(()=>{
						//每隔一秒，展示的秒数减一
					this.seconds--
					//判断秒数是否小于0
					if(this.seconds<=0){
						//清空定时器，给传入空值
						clearInterval(this.timer)
						//跳转到my登录页面
						uni.switchTab({
							url:'/pages/my/my',
							//当页面跳转到登录页面，并且成功后。重定向跳转页面到原来的结算页面
							success:()=>{
								this.updateRedirectInfo({
									//跳转方式
									openType:'switchTab',
									//跳转路径
									from:'/pages/cart/cart'
								})
							}
						})
						//停止后续代码的运行：（当秒数为0，不再展示toast弹窗提示消息）
						return
					}
					this.showTips(this.seconds)
				},1000)
				
			},
			//展示倒计时的提示消息
			showTips(n){
				//展示弹窗
				uni.showToast({
					//弹窗不带图标
					icon:'none',
					title:'请登录后再结算！'+ n +'秒后自动跳转到登录页面',
					//表示用户在点击消息的时候，展示一层背景，防止穿透
					mask:true,
					//1.5秒后，弹窗自动消失
					duration:1500
				})
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