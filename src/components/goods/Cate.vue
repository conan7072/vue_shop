<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->

      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        :index-text="'#'"
        :border="true"
        :show-row-hover="false"
        class="treeTable"
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级
          </el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary"
            >编辑
          </el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger"
            >删除
          </el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- //添加分类的对话框 -->
    <el-dialog
      title="分类名称"
      :visible.sync="addCateDialogFormVisible"
      width="50%"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="添加分类:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="100px">
          <!-- <el-select>
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //表示将当前列定义成模板列
          type: 'template',
          //便是当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //表示将当前列定义成模板列
          type: 'template',
          //便是当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          //表示将当前列定义成模板列
          type: 'template',
          //便是当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      //控制添加分类对话框的显示与隐藏
      addCateDialogFormVisible: false,
      //添加分类数据表单对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', tigger: 'blur' }
        ]
      },
      //父级分类列表
      parentCateList: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品数据分类
    getCateList: async function() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类失败')
      }
      //把数据列表赋值给catelist
      this.catelist = res.data.result
      //为数据条数赋值
      this.total = res.data.total
    },
    //监听pagesize变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogFormVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类信息失败!')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList)
    }
  }
}
</script>
<style scoped lang="less">
.treeTable {
  margin-top: 15px;
}
</style>
