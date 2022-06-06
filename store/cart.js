//向外导出vuex的模块
export default{
	//为当前模块开启命名空间
	namespaced: true,
	//导入到vue的计算属性computed中。
	state:()=>({
		//购物车的数组用来存储购物车中每个商品的信息对象goods。包含六个属性。{ goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		//购物车数据一直在内存中，不在本地，每次重新加载页面会消失
		//cart:[]
		//每次重新加载之后，购物车里面的数据就是更新过的数组。购物车保存在storsge当中
		//carts是字符串格式,需要转化为数组格式赋值给cart。
		//初次加载的时候可能为空数组。
		cart :JSON.parse(uni.getStorageSync('carts')||'[]')
	}),
	
	//states里面的数据只能通过mutations里面的方法来修改
	//导入到vue的方法mythods中。
	mutations:{
		// 将用户通过商品详情页通过点击加入购物车的商品数据,保存到购物车当中。
		 addToCart(state, goods) {
		// 根据提交的商品ID,通过find查询购物车中是否存在这件商品。
		// 如果不存在则结果为undefined。如果存在和返回查找到的商品详情对象。
		const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
		// 查看购物车是否有相同产品
	
		// 如果结果不是undefined，取非之后为true,则表示没有相同产品，直接添加进去。
		      if (!findResult) {
		        state.cart.push(goods)
		      } else {
				  // 如果有过这件商品，则只更新这件商品的数量。
		        findResult.goods_count++
		      }
			  
			  //console.log(state.查看点击加入购物车后的后台数据
			  //vuex的commit方法调用m_cart命名空间下的方法,注意这里方法的调用方式
			  this.commit('m_cart/saveToStorage')
	        },
			//将购物车的数组转化成字符串格式，持久化存储到本地storage，命名为cart。每次购物车中商品和数量发生变化，都需要重新调用更新
			saveToStorage(state){
				uni.setStorageSync('carts',JSON.stringify(state.cart))
			},
			// 更新购物车中商品的勾选状态
			updateGoodsState(state,goods){
				//根据商品ID寻找对应的商品goods，赋值给findResult，如果能找到，匹配商品状态，并且随机存储在本地中，
				const findResult = state.cart.find(x=>x.goods_id===goods.goods_id)
				if(findResult){
					findResult.goods_state=goods.goods_state
					//持久化存储到本地
					this.commit('m_cart/saveToStorage')
				}
			},
			// 更新购物车中商品的数量
			updateGoodsCount(state,goods){
				//根据商品ID寻找对应的商品goods，赋值给findResult，如果能找到，匹配商品数量，并且随机存储在本地中，
				const findResult = state.cart.find(x=>x.goods_id===goods.goods_id)
				if(findResult){
					findResult.goods_count=goods.goods_count
					//持久化存储到本地
					this.commit('m_cart/saveToStorage')
				}
			},
			 // 根据 Id 删除对应的商品
			    removeGoodsById(state, goods_id) {
					//调用数组的filter方法进行过滤，把goods_id不等于传进来的goods_id的商品项筛选出去，给cart，cart里面则会更新为已经删除过点击删除goods_id的商品各项
			      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			//再次存储
			      this.commit('m_cart/saveToStorage')
			    },
				//更新购物车中所有商品的勾选状态，给一个newState来循环代替之前的state，这个newState就是要传进来的全选按钮的state
			updateAllGoodsState(state,newState){
				state.cart.forEach(x => x.goods_state = newState)
				 //再次存储
				       this.commit('m_cart/saveToStorage')
			}
	},
	//导入到vue的计算属性computed中
	getters:{
		//统计购物车中商品的总数量。
		total(state){
			// let c = 0
			// //循环购物车当中的数据,统计商品的数量累加到变量c中。
			// state.cart.forEach(goods=>c+=goods.goods_count)
			// return c
			//用reduce优化上面代码
			return state.cart.reduce((total,item) => total += item.goods_count,0)
		},
		//统计购物车中勾选的商品总数量
		checkedCount(state){
			//filter从购物车中筛选出来已勾选的数据，形成新的数组
			//reduce循环累加，两个参数，第一个回调函数，值为累加的和，第二个初始累加值,只有第一次生效，最后返回值就是勾选商品总数量
			return state.cart.filter(x => x.goods_state)
			                 .reduce((total, item) => total += item.goods_count, 0)
		},
		//统计已勾选商品的总价格
		checkedGoodsAmount(state){
			return state.cart.filter(x => x.goods_state)
			                 .reduce((total, item) => total += item.goods_price * item.goods_count, 0)
							 .toFixed(2)
		}
		
	}
}