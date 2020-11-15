<template>
  <div>
    <!-- 面包线导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table :data="roleslist" style="width: 100%" border stripe>
        <el-table-column type="expand" align="center">
          <template slot-scope="slotProps">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, index) in slotProps.row.children"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(slotProps.row, item.id)"
                  >{{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(subitem, subindex) in item.children"
                  :key="subitem.id"
                >
                  <el-col
                    :span="6"
                    :class="[subindex === 0 ? '' : 'bdtop', 'vcenter']"
                  >
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(slotProps.row, subitem.id)"
                      >{{ subitem.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" :class="[subindex === 0 ? '' : 'bdtop']">
                    <el-tag
                      type="warning"
                      v-for="subsubitem in subitem.children"
                      :key="subsubitem.id"
                      closable
                      @close="removeRightById(slotProps.row, subsubitem.id)"
                      >{{ subsubitem.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" align="center"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(slotProps.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(slotProps.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRightDialog(slotProps.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="dialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="rightslist"
        :props="treeDefaultProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="dfKeys"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleValidate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称:" prop="RoleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { log } from 'util'
export default {
  data: function() {
    return {
      roleslist: [],
      setRightDialogVisible: false,
      rightslist: [],
      treeDefaultProps: {
        chlidren: 'children',
        label: 'authName'
      },
      dfKeys: [],
      roleId: 0,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      dialogVisible: false,
      editRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editDialogVisible: false
    }
  },
  methods: {
    getRolesList: async function() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleslist = res.data
    },
    removeRightById: async function(role, rightId) {
      //弹窗
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
        const { data: ret } = await this.$http.delete(
          `/roles/${role.id}/rights/${rightId}`
        )
        if (ret.meta.status != 200) {
          this.$message.error('删除用户信息失败')
          return
        }
        this.$message.success('删除用户信息成功')
        role.children = ret.data
      }
    },
    setRightDialog: async function(role) {
      const { data: res } = await this.$http.get('rights/tree')
      this.roleId = role.id
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户权限失败')
      }
      this.rightslist = res.data

      this.geLeafKeys(role, this.dfKeys)
      this.setRightDialogVisible = true
    },

    geLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.geLeafKeys(item, arr)
      })
    },
    dialogClosed() {
      this.dfKeys = []
    },
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: ret } = await this.$http.post(
        `/roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (ret.meta.status !== 200) {
        return this.$message.error('分配用户权限失败')
      }
      this.$message.success('分配用户权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    addDialogClosed: function() {
      this.$refs.addRoleFormRef.resetFields()
    },
    addRoleValidate: function() {
      var that = this
      var res = this.$refs.addRoleFormRef.validate(async function(bool, obj) {
        if (!bool) {
          return
        }
        const { data: ret } = await that.$http.post('/roles', that.addRoleForm)
        if (ret.meta.status != 201) {
          that.$message.error('添加角色失败')
          return
        }
        that.$message.success('添加角色成功')
        that.dialogVisible = false
        that.getRolesList()
      })
    },
    addRole: function() {
      this.dialogVisible = true
    },
    editRole: async function(row) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/roles/' + row.id)
      if (res.meta.status != 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editRoleForm = res.data
    },
    editDialogClosed: function() {
      this.$refs.editRoleFormRef.resetFields()
    },
    editRoleInfo: function() {
      var that = this
      var res = this.$refs.editRoleFormRef.validate(async function(bool, obj) {
        if (!bool) {
          return
        }
        const { data: ret } = await that.$http.put(
          '/roles/' + that.editRoleForm.roleId,
          {
            roleName: that.editRoleForm.roleName,
            roleDesc: that.editRoleForm.roleDesc
          }
        )
        if (ret.meta.status != 200) {
          that.$message.error('修改用户信息失败')
          return
        }
        that.$message.success('修改用户信息成功')
        that.editDialogVisible = false
        that.getRolesList()
      })
    },
    deleteRole: async function(row) {
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
        const { data: ret } = await this.$http.delete('/roles/' + row.id)

        if (ret.meta.status != 200) {
          this.$message.error('删除用户信息失败')
          return
        }
        this.$message.success('删除用户信息成功')
        this.getRolesList()
      }
    }
  },
  created: function() {
    this.getRolesList()
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
