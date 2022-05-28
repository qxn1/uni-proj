<template>
	<view>
		<view class="search-box">
			<!-- 从uniapp官网获得的基本用法 -->
			<uni-search-bar  :radius="100" cancelButton="none" @input="input" ></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchReaults.length !==0">
			<view class="sugg-item"  v-for="(item,i) in searchReaults" :key="i" @click="gotoDetail(item)">
			<view class="goods-name">{{item.goods_name}}</view>
			<!-- 从uniapp官网获得的基本用法 -->
			<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
		
		<!-- 搜索历史部分 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<!-- 从uniapp官网获得的基本用法 -->
				<uni-icons type="trash-filled" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<!-- 从uniapp官网获得的基本用法 -->
				<!-- 搜索历史展示图标，文本动态绑定为每一个搜索项 -->
				<uni-tag  :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>				
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//延时器,接收延时器的返回值
				timer:null,
				//用户输入的值,存储搜索的关键词。
				kw:"",
				//存储搜索建议的结果列表
				searchReaults:[],
				//存储搜索历史的数组
				historyList:[]
			};
		},
		onLoad(){
			this.historyList = JSON.parse(this.setStorageSync("kw") ||"[]")
		},
		methods:{
			//搜索框输入事件
			input(e){
				//console.log(e);
				//防抖处理，防止每一次按下键盘都发起Ajax请求。
				//在500毫秒等待过程中，如果用户再次触发计时器,则重新开始,清除之前的时间。
				clearTimeout(this.timer)
				this.timer=setTimeout(()=>{
					//console.log(e);
					this.kw=e
					//根据关键词，查询搜索建议列表
					this.getSearchList()
				},500)
			},
			async getSearchList(){
				//判断输入是否为空
				if(this.kw.trim()===""){
					this.searchReaults=[]
					return
				}
				//不为空时，发起网络请求，获取搜索建议
				const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})
				if(res.meta.status!==200)return uni.$showMsg()
				console.log(res);
				this.searchReaults = res.message
				//调用处理搜索历史和关键词的方法
				this.saveSearchHistory()
			},
			//点击搜索建议列表，根据获得的商品id，跳转到商品
			gotoDetail(item){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			//保存搜索历史记录
			saveSearchHistory(){
				//this.historyList.push(this.kw)
				//将储存搜索历史的数组转化为set对象
				const set = new Set(this.historyList)
				//移除已有的数据，使新的数据加在最后面，这样最后翻转时，最新搜索记录会在最前面
				set.delete(this.kw)
				set.add(this.kw)
				//将set对象转化为array数组
				this.historyList = Array.from(set)
				
				//对搜索历史进行持久化的存储,JSON.stringify把数组转化为字符串
				uni.setStorageSync("kw",JSON.stringify(this.historyList))
			},
			//点击删除图标时，清空historyList和storagel里面kw的值
			clean(){
				this.historyList=[]
				//错误this.setStorageSync("kw")="[]",正确思路。是给kw一个新的空数组值
				uni.setStorageSync('kw','[]')
				
			},
			//点击搜索历史跳转到商品详情页面
			gotoGoodsList(kw){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query=' + kw
				})
			}
			
		},
		//计算属性
		computed:{
			histories(){
				// 由于数组是从内存中引用的，所以不能在原数组上直接调用reverse方法。以免修改原数组中元素的顺序，应该新建一个再翻转
				return [...this.historyList].reverse()
			}
		}
	}
	
</script>

<style lang="scss">
.search-box{
	position: sticky;
	top: 0;
	z-index:999
}
.sugg-list{
	padding: 0 5px;
	
	.sugg-item{
		display:flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		
		.goods-name{
			//强制在一行内显示。
			white-space: nowrap;
			//溢出部分隐藏
			overflow: hidden;
			//溢出的内容转化为...
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}
.history-box{
	padding: 0 5px;
	.history-title{
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.history-list{
		display: flex;
		flex-wrap: wrap;
		
		.uni-tag{
			margin-top: 5px;
			margin-right: 5px;
		}
	}
}
</style>
