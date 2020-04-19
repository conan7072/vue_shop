<template>
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button @click="logout">退出</el-button>
      </el-header>
      <el-container>

        <el-aside :width="collapseWidth+'px'">
          <div class="toggle" @click="toggle">|||</div>
          <el-menu class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409bff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router='true' :default-active=activePath>
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class=iconobj[item.id]></i>
                <span >{{item.authName}}</span>
              </template>
                <el-menu-item :index="'/'+subitem.path+''" v-for="subitem in item.children" :key="subitem.id">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span @click="saveNavState('/'+subitem.path)">{{subitem.authName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>

    </el-container>
  </el-container>
</template>

<script>
export default {
  data:function(){
    return {
      menulist:[],
      iconobj:{
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao',
      },
      isCollapse:false,
      collapseWidth:200,
      activePath:'',
    }
  },
  mounted:function(){
    this.getMenuList(),
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods:{
    logout:function(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList:async function(){
      
      const {data:res}=await this.$http.get('/menus')
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      this.menulist=res.data
    },
    toggle:function(){
      this.isCollapse=!this.isCollapse
      if(!this.isCollapse){
        this.collapseWidth=200
      }else{
        this.collapseWidth=64
      }
      
    },
    saveNavState:function(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
       
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color:white;
    font-size: 20px;
    div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle{
    background-color: #4a5064;
    text-align: center;
    color: white;
    letter-spacing:0.2em ;
    font-size: 10px;
    line-height: 24px;
    cursor: pointer;
  }
</style>
