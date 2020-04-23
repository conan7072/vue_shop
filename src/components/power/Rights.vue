<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            
            <el-table :data="rightslist" style="width: 100%" border stripe  >
                <el-table-column type="index">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称" align="center">
                </el-table-column>
                <el-table-column prop="path" label="路径" align="center">
                </el-table-column>
                <el-table-column prop="level" label="权限等级" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
                        
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1,2,5,10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>    -->
        </el-card>
        
        
        
    </div>
</template>
<script>
export default {
    data:function(){
        return {
            rightslist:[
                
            ]
                
            
        }
    },
    methods:{
        getRightsList:async function(){
            const res=await this.$http.get('rights/list')
            console.log(res)
            if(res.data.meta.status!=200){
                return this.$message.error(res.data.meta.msg)
            }
            this.rightslist=res.data.data
            
        },
    },
    mounted:function(){
        this.getRightsList()
    }
}
</script>>
<style lang="less" scoped>

</style>