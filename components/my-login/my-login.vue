<template>
	<view class="login-container">
	    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- getUserInfo获取用户信息 ,自带方法-->
	    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
	    <text class="tips-text">登录后尽享更多权益</text>
	  </view>
</template>

<script>
	//1.引入
	import { mapMutations} from 'vuex'
	
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		methods:{
			//2.按需映射
			//把在Storage中更新用户信息对象的方法映射到当前页面
			...mapMutations('m_user',['updateUserInfo','updateToken']),
			//获取微信用户的基本信息
			getUserInfo(e){
				//e返回的就是用户信息和请求参数
				//console.log(e);
				// 如果用户没有授权登录
				 if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
				 // 用户信息
				 //console.log(e.detail.userInfo)
				 //3.传值使用
				 //存储用户信息
				 this.updateUserInfo(e.detail.userInfo)
				 //获取登录后的token字符串,同时把获取到的用户信息传递进去，e.detail包含登录需要的四个参数值
				 this.getToken(e.detail)
			},
			//调用登录接口，换取永久的token
			 async getToken(info) {
			        // 调用微信登录接口，wx.login(),在小程序中使用uni.login(),获取 code 对应的值
                    //第一个参数是错误对象。第二个参数是返回的值。
			        const [err, res] = await uni.login().catch(err => err)
					//判断是否调用失败
			        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('调用接口失败！')
			
			        // 准备参数
			        const query = {
			          code: res.code,
			          encryptedData: info.encryptedData,
			          iv: info.iv,
			          rawData: info.rawData,
			          signature: info.signature
			        }
			    //换取token
			        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
			        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
					//uni.$showMsg('登陆成功')
					// 直接把 token 保存到 vuex 中
					 this.updateToken('qiaoxiaona')
		} 
		}
	}
</script>

<style lang="scss">
.login-container{
	    height: 750rpx;
	    background-color: white;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
		position: relative;
	// scss中&代表父元素
	&::after{
		content: '';
		display: block;
		width: 100%;
		height: 40px;
		background-color: white;
		position: absolute;
		bottom: 0;
		left: 0;
		border-radius: 100%;
		transform: translateY(50%);
		overflow: hidden;
	}
	.btn-login {
	     width: 90%;
	     border-radius: 100px;
	     margin: 15px 0;
	     background-color: #C00000;
	   }
	.tips-text {
	     font-size: 12px;
	     color: gray;
	   }
}
 
</style>