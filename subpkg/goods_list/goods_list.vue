<template>
	<view>
		<view class="goods-list">
			<!-- block不支持绑定点击事件,需要改为view
			<block v-for="(goods,i) in goodsList" :key="i">
				<my-goods :goods="goods"></my-goods>
			</block> -->
			
			<view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 // 请求参数对象
				        queryObj: {
							// 首页楼层，搜索历史（传递query参数),商品三级详情(传递cid)
				          query: '',
				          cid: '',
						  //默认页码，每个页面条数
				          pagenum: 1,
				          pagesize: 10
				        },
						//商品列表的数据
						goodsList:[],
						//商品总数量，用来实现分页
						total:0,
						//节流阀
						isloading:false
		
			};
		},
		//options接收页面跳转传递的参数，有三种传递参数方式，首页楼层，搜索历史（传递query参数),商品三级详情(传递cid)
		onLoad(options){
			//把页面请求的参数传递给data,考虑有可能参数为空的可能
			//console.log(options);
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			//console.log(this.queryObj);
			
			//获取商品列表数据
			this.getGoodsList()
		},
		methods:{
			//获取商品列表数据
			//这里的cb指的是触发下拉刷新效果时传过来的回调函数。由于 getGoodsList()多处调用，不一定每次传cb，因此需要在调用cb前判断
			async getGoodsList(cb){
				//打开节流阀
				this.isloading=true
				
				//返回值是一个对象，可以结构赋值为data属性,重命名为res
				const {data:res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				
				//关闭节流阀
				this.isloading=false
				
				//用短路运算符来判断，如果cb值传进来了，就调用，如果没有就不调用后面的
				cb && cb()
				
				if(res.meta.status !==200) return uni.$showMsg()
				//console.log(res);
				//原来的只是返回第一页数据，在触发上拉事件后，需要增加新页码的数据
				// this.goodslist = res.message.goods
				//新旧数据拼接
				this.goodsList = [...this.goodsList,...res.message.goods]
				this.total = res.message.total
			},
			//点击商品item项，跳转到详情页面。
			gotoDetail(goods){
				uni.navigateTo({
					 url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		//触动下拉触底效果
		onReachBottom(){
			//判断是否还有下一页数据
			if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total)return uni.$showMsg("数据加载完毕")
			
			//判断节流阀，当节流阀为true时，代表正在请求数据，阻止数据多次请求
			if(this.isloading)return
			//让触发触底时，页码值自增+1
			this.queryObj.pagenum ++
			this.getGoodsList()
		},
		//触动下拉刷新
		onPullDownRefresh(){
			//重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
				  
			//重新发起数据请求。用回调函数关闭下拉刷新效果。
			this.getGoodsList(()=>uni.stopPullDownRefresh())
		},
		
	}
</script>

<style lang="scss">

</style>
