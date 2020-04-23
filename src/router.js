//1.引入相关库文件
import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/my_login.vue'
import Home from './components/Home.vue'
import Welcome from './components/welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {path:'/login',component:Login},
    {path:'/',redirect:'/login'},
    {path:'/home',component:Home,
      redirect:'/welcome',
      children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
    ]},
    
  ]
})

// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to 将要访问的路径
//   // from 代表从哪个路径跳转而来
//   // next 是一个函数，表示放行
//   //     next()  放行    next('/login')  强制跳转

//   if (to.path === '/login') return next()
//   // 获取token
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })
router.beforeEach((to,from,next)=>{
  if(to.path==='/login'){return next()}
  const token=window.sessionStorage.getItem('token')
  if(!token){
    next('/login')
  }else{
    next()
  }
})
export default router
