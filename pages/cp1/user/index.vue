<template>
  <div class="contentBody">
    <div class="actions">
      <a-button type="primary" @click="showModal">New Admin/Warehouse/Enterprise User</a-button>
      <a-row type="flex">
        <a-col :xs="10" :lg="18">
          <label>Show :</label>
          <select
            name="users_length"
            aria-controls="users"
            class="form-control input-sm"
            v-model="selected"
            @change="selectChanged"
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </select>
          <label>entries</label>
        </a-col>
        <a-col :xs="5" :lg="6">
          <label>Search :</label>
          <a-input v-model="search" @pressEnter="doSearch" />
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :row-key="record => record.user_id"
      :data-source="list"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="user_id" slot-scope="text, record">
        <nuxt-link :to="'/cp1/user/'+record.user_id">{{ record.user_id }}</nuxt-link>
      </template>
      <template slot="date" slot-scope="text">{{ text | dateFormat('date') }}</template>
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;">Lock</a>
        <a @click="showPasswordModal(record.user_id)">Edit</a>
      </span>
      <span slot="status" slot-scope="text, record">
        <span>{{ record.is_banned ? 'locked' :'active' }}</span>
      </span>
    </a-table>
    <a-modal title="New User" v-model="visible">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Proceed</a-button>
      </template>
      <a-form
        layout="horizontal"
        method="post"
        class="frm"
        :form="form"
        @submit.prevent="handleSubmit"
      >
        <fieldset>
          <a-form-item
            label="Email"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Email"
              v-decorator="[
          'Email',
          {rules: [{ required: true, message: 'Email is required' }]}
        ]"
            />
          </a-form-item>

          <a-form-item
            label="Password"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Password"
              type="password"
              v-decorator="[
          'Password',
          {rules: [{ required: true, message: 'Password is required' }]}
        ]"
            />
          </a-form-item>

          <a-form-item
            label="First Name"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
          'FirstName',
          {rules: [{ required: true, message: 'First Name is required' }]}
        ]"
              placeholder="First Name"
            />
          </a-form-item>
          <a-form-item
            label="Last Name"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
          'LastName',
          {rules: [{ required: true, message: 'Last Name is required' }]}
        ]"
              placeholder="Last Name"
            />
          </a-form-item>
        </fieldset>
      </a-form>
      <template>
        <a-radio-group @change="onChange" v-model="value">
          <a-radio :value="1">Warehouse Staff</a-radio>
          <a-radio :value="2">Admin</a-radio>
          <a-radio :value="3">Enterprise User</a-radio>
          <a-radio :value="4">Sub User</a-radio>
        </a-radio-group>
      </template>
    </a-modal>
    <a-modal title="Reset User Password" v-model="passwordModal">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="updatePassword">Proceed</a-button>
      </template>
      <a-form
        layout="horizontal"
        method="post"
        class="frm"
        :form="updatePasswordform"
        @submit.prevent="handleSubmit"
      >
        <fieldset>
          <a-form-item
            label="Password"
            :label-col="updatePasswordformItemLayout.labelCol"
            :wrapper-col="updatePasswordformItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Password"
              type="password"
              v-decorator="[
          'Password',
          {rules: [{ required: true, message: 'Password is required' }]}
        ]"
            />
          </a-form-item>
          <a-form-item
            label="Confirm Password"
            :label-col="updatePasswordformItemLayout.labelCol"
            :wrapper-col="updatePasswordformItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Confirm Password"
              type="password"
              v-decorator="[
          'ConfirmPassword',
          {rules: [{ required: true, message: 'Confirm Password is required' }]}
        ]"
            />
          </a-form-item>
        </fieldset>
      </a-form>
    </a-modal>
  </div>
</template>
   

<script>
'use strict'
import Vue from 'vue'
import { pagination as gPage } from '../../../shared/general'
import { mapState, mapActions } from 'vuex'
import { ObjectId } from 'bson'

import {
  Table as ATable,
  Input as AInput,
  Row as ARow,
  Col as ACol,
  Button as AButton,
  Modal as AModal,
  Radio as ARadio,
  Form as AForm,
  message
} from 'ant-design-vue'
import { debug } from 'util'
const AFormItem = AForm.Item
const ARadioGroup = ARadio.Group
Vue.prototype.$message = message
const columns = [
  {
    title: 'Created Date',
    dataIndex: 'created_datetime',
    sorter: true,
    scopedSlots: { customRender: 'date' }
  },

  {
    title: 'Email',
    width: '15%',
    sorter: true,
    filterMultiple: false,

    dataIndex: 'email'
  },
  {
    title: 'User Id',
    width: '15%',
    scopedSlots: { customRender: 'user_id' },
    sorter: true,
    filterMultiple: false,
    dataIndex: 'user_id'
  },
  {
    title: 'Role',
    width: '15%',
    sorter: true,
    filterMultiple: false,
    dataIndex: 'user_role'
  },
  {
    title: 'Details',
    width: '15%',
    sorter: true,
    filterMultiple: false,

    dataIndex: 'company'
  },
  {
    title: 'Status',
    width: '15%',
    sorter: true,
    filterMultiple: false,

    dataIndex: 'is_banned',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: 'Action',
    key: 'action',
    width: '15%',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    ATable,
    AInput,
    ARow,
    ACol,
    AModal,
    AButton,
    ARadio,
    AForm,
    AFormItem,
    ARadioGroup
  },

  data() {
    return {
      search: '',
      value: 1,
      user: {},
      selected: '50',
      visible: false,
      passwordModal: false,
      pagination: {
        position: 'bottom',
        current: 1,
        pageSize: Number(this.selected),

        total: 0
      },
      form: this.$form.createForm(this),
      updatePasswordform: this.$form.createForm(this),
      parentFilters: {},
      columns: columns,
      lastSetting: { pagination: {}, filters: {}, sorter: null }
    }
  },

  computed: {
    formItemLayout() {
      // let formLayout = 'horizontal'
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
    },
    updatePasswordformItemLayout() {
      // let formLayout = 'horizontal'
      return {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 }
      }
    },
    ...mapState('user', ['list', 'page', 'loading', 'count', 'limit']),
    ...mapState('session', ['currentUser'])
  },

  async created() {
    this.$store.dispatch('env/setTitle', 'User')

    await this.handleFetch({
      page: this.page,
      limit: this.limit,
      sorts: [],
      filters: this.parentFilters
    })
  },

  methods: {
    ...mapActions('user', ['fetchUserList', 'saveUser', 'updateUserPassword']),
    doSearch() {
      this.handleTableChange(
        this.lastSetting.pagination,
        this.lastSetting.filters,
        this.lastSetting.sorter
      )
    },
    onChange(e) {
      this.user.role = e.target.value
    },
    showModal() {
      this.visible = true
    },
    showPasswordModal(e) {
      this.selectedUserId = e
      this.passwordModal = true
    },
    updatePassword() {
      this.updatePasswordform.validateFields((err, values) => {
        if (!err) {
          if (values.Password != values.ConfirmPassword) {
            this.$message.error('Passwords are not matching')
          } else {
            let updateRequest = {}
            updateRequest.password = values.Password
            updateRequest.id = this.selectedUserId
            this.update(updateRequest)
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.passwordModal = false
    },
    async handleOk(e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.AddUser(values)
        }
      })
    },
    async update(params) {
      try {
        let res = await this.updateUserPassword(params)
        this.$message.success('Password is updated successfully')
      } catch (e) {
        this.$message.error('Failed to update password')
        this.passwordModal = false
        this.$store.dispatch('user/loading', false)
      }
    },
    async AddUser(params) {
      try {
        if (this.user.role == 1) {
          this.user.user_role = 'warehousestaff'
        } else if (this.user.role == 2) {
          this.user.user_role = 'admin'
        } else if (this.user.role == 3) {
          this.user.user_role = 'enterprise'
        } else if (this.user.role == 4) {
          this.user.user_role = 'multitenant'
        } else {
          this.user.user_role = 'warehousestaff'
        }
        this.user.first_name = params.FirstName
        this.user.last_name = params.LastName
        this.user.email = params.Email
        this.user.password = params.Password
        let res = await this.saveUser(this.user)
        this.visible = false
        this.$message.success('User is added successfully')
      } catch (e) {
        this.$message.error('Failed to add user')
        this.visible = false
        this.$store.dispatch('user/loading', false)
      }
    },

    async handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager

      await this.handleFetch({
        limit: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    async selectChanged() {
      await this.handleFetch({
        limit: Number(this.selected),
        page: this.pagination.current
      })
    },

    async handleFetch(params) {
      try {
        await this.fetchUserList(params)
        const page = { ...this.pagination }
        page.total = this.count
        console.log(this.selected)
        page.pageSize = Number(this.selected)
        this.pagination = page
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
      }
    }
  },

  layout() {
    return 'member'
  },
  middleware: ['isAuth']
}
</script>

<style>
.dashboard .contentBody > .contentBody {
  background-color: #fff;
  padding: 0;
}
.dashboard .contentBody > .contentBody .actions {
  padding: 20px;
}
.dashboard .contentBody button.ant-btn-primary {
  border-radius: 0;
  background: #ff9900;
  border: none;
  padding: 10px 12px;
  font-size: 13px;
  height: auto;
  margin-bottom: 20px;
}
.dashboard .contentBody button.ant-btn-primary:hover {
  background: #ffad33;
}
.dashboard .contentBody label {
  display: inline-block;
}
.dashboard .contentBody select {
  width: auto;
  display: inline-block;
  border: 2px solid #e0e0e0;
  border-radius: 0;
  padding: 0;
}
.dashboard .contentBody input {
  width: 75%;
  border: 2px solid #e0e0e0;
  border-radius: 0;
}
.dashboard .contentBody input:focus,
.dashboard .contentBody select:focus {
  box-shadow: none;
}
.dashboard table {
  overflow-y: scroll;
  direction: btt;
}
.dashboard .ant-table-thead > tr > th {
  border-top: 1px solid #e8e8e8;
  border-bottom: 3px solid #e8e8e8;
  padding: 10px 15px;
  background-color: #fff;
  font-size: 13px;
  font-weight: 300;
}
.dashboard
  .ant-table-thead
  > tr
  > th.ant-table-column-has-actions.ant-table-column-has-sorters:hover {
  background-color: #fff;
}
.dashboard table .ant-table-tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}
.dashboard table .ant-table-tbody tr:hover td {
  background-color: #f5f5f5;
}
.dashboard table .ant-table-tbody tr td a {
  color: #ff9900;
}
.dashboard table .ant-table-tbody tr td span a {
  background-color: #ff9900;
  color: #fff;
  padding: 5px 10px;
  display: inline-block;
  margin-bottom: 5px;
}
.ant-modal-close-x {
  display: block;
  font-style: normal;
  vertical-align: baseline;
  text-align: center;
  text-transform: none;
  text-rendering: auto;
  width: 56px;
  height: 56px;
  line-height: 20px;
  font-size: 16px;
}
</style>
