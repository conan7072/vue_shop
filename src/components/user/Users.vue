<template>
  <div>
    <!-- 面包线部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 白纸版背景 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据列表 -->
      <el-table :data="userslist" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" align="center">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="stateChange(slotProps.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" align="center">
          <template slot-scope="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(slotProps.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(slotProps.row.id)"
            ></el-button>
            <!-- 鼠标放上去，有提示，显示分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(slotProps.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出遮挡栏 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addUsersForm"
        :rules="addUsersFormRules"
        ref="addUsersFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="addUsersForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="addUsersForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱:" prop="email">
          <el-input v-model="addUsersForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="addUsersForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserValidate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editUsersForm"
        :rules="addUsersFormRules"
        ref="editUsersFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="editUsersForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱:" prop="email">
          <el-input v-model="editUsersForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="editUsersForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户:{{ roleList.username }}</p>
        <p>当前的角色:{{ roleList.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleTable"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    //注意这俩之间加逗号分隔会报错
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的电话号码'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userslist: [],
      total: 0,

      dialogVisible: false,
      editDialogVisible: false,

      addUsersForm: {
        username: 'admin',
        password: '',
        email: '',
        mobile: ''
      },
      editUsersForm: {
        username: '',
        email: '',
        mobile: ''
      },

      addUsersFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUsersFormRules: {
        email: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRoleDialogVisible: false,
      roleList: {},
      roleTable: [],
      selectedRoleId: ''
    }
  },
  created: async function() {
    this.getUsersList()
  },
  methods: {
    getUsersList: async function() {
      const res = await this.$http.get('/users', { params: this.queryInfo })
      if (res.data.meta.status != 200) {
        return this.$message.error(res.data.meta.msg)
      }
      this.userslist = res.data.data.users
      this.total = res.data.data.total
    },
    handleSizeChange: async function(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    handleCurrentChange: async function(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUsersList()
    },
    stateChange: async function(userInfo) {
      const { data: res } = await this.$http.put(
        'users/' + userInfo.id + '/state/' + userInfo.mg_state
      )
      if (res.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addUser: async function() {
      this.dialogVisible = true
    },
    addDialogClosed: async function() {
      this.$refs.addUsersFormRef.resetFields()
    },
    editDialogClosed: async function() {
      this.$refs.editUsersFormRef.resetFields()
    },
    addUserValidate: async function() {
      var that = this
      var res = this.$refs.addUsersFormRef.validate(async function(bool, obj) {
        if (!bool) {
          return
        }
        const { data: ret } = await that.$http.post('/users', that.addUsersForm)
        if (ret.meta.status != 201) {
          that.$message.error('添加用户失败')
          return
        }
        that.$message.success('添加用户成功')
        that.dialogVisible = false
        that.getUsersList()
      })
    },
    editUser: async function(row) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/users/' + row.id)
      if (res.meta.status != 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editUsersForm = res.data
    },
    editUserInfo: async function() {
      var that = this
      var res = this.$refs.editUsersFormRef.validate(async function(bool, obj) {
        if (!bool) {
          return
        }
        const { data: ret } = await that.$http.put(
          '/users/' + that.editUsersForm.id,
          { email: that.editUsersForm.email, mobile: that.editUsersForm.mobile }
        )

        if (ret.meta.status != 200) {
          that.$message.error('修改用户信息失败')
          return
        }
        that.$message.success('修改用户信息成功')
        that.editDialogVisible = false
        that.getUsersList()
      })
    },
    deleteUser: async function(id) {
      const comfirmMsg = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      if (comfirmMsg == 'cancel') {
        this.$message.info('取消删除用户')
        return true
      } else {
        const { data: ret } = await this.$http.delete('/users/' + id)
        if (ret.meta.status != 200) {
          this.$message.error('删除用户信息失败')
          return
        }
        this.$message.success('删除用户信息成功')
        this.getUsersList()
      }
    },
    async setRole(role) {
      this.roleList.username = role.username
      this.roleList.role_name = role.role_name
      this.roleList.id = role.id

      const { data: ret } = await this.$http.get('roles')
      if (ret.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      }
      this.roleTable = ret.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色!')
      }

      const { data: ret } = await this.$http.put(
        `/users/${this.roleList.id}/role`,
        { rid: this.selectedRoleId }
      )

      if (ret.meta.status != 200) {
        this.$message.error('分配角色失败')
        return
      }

      this.$message.success('分配角色成功')
      this.getUsersList()
      this.setRoleDialogVisible = false
    },
    async setRoleDialogClosed() {
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped></style>
