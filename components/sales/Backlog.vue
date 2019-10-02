<template>
  <div class="contentBody">
    <h3>Orders Backlog</h3>
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
          <option value="1000">1000</option>
        </select>
        <label>entries</label>
      </a-col>
      <a-col :xs="5" :lg="6">
        <label>Search :</label>
        <a-input v-model="search" @pressEnter="doSearch" />
      </a-col>
    </a-row>
    <a-table
      :columns="columns"
      :data-source="list"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="date" slot-scope="text">{{ text | dateFormat('date') }}</template>
      <span slot="action">
        <a href="javascript:;">Delete</a>
        <a href="javascript:;">Resend</a>
      </span>
      <span slot="edit_action">
        <a href="javascript:;">Edit</a>
      </span>
    </a-table>
  </div>
</template>

<script>
'use strict'

import { pagination as gPage } from '../../shared/general'
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
  Tabs as ATabs
} from 'ant-design-vue'
const AFormItem = AForm.Item
const ATabPane = ATabs.TabPane
const columns = [
  {
    title: 'Order ID',
    dataIndex: 'order_num',
    sorter: true
  },

  {
    title: 'Reason',
    width: '15%',
    sorter: true,
    filterMultiple: false,

    dataIndex: 'reason'
  },

  {
    title: 'Channel Name',
    width: '15%',
    sorter: true,
    filterMultiple: false,

    dataIndex: 'channel'
  },
  ,
  {
    title: 'Merchant Id',
    width: '15%',
    sorter: true,
    filterMultiple: false,

    dataIndex: 'user_id'
  },
  {
    title: 'Order Date',
    width: '15%',
    sorter: true,
    filterMultiple: false,
    dataIndex: 'created_at',
    scopedSlots: { customRender: 'date' }
  },
  {
    title: '',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  },

  {
    title: '',
    width: '15%',
    sorter: true,
    filterMultiple: false,
    scopedSlots: { customRender: 'edit_action' }
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
    ATabs,
    ATabPane
  },

  data() {
    return {
      search: '',
      user: {},
      visible: false,
      selected: '50',
      pagination: {
        position: 'bottom',
        current: 1,
        pageSize: Number(this.selected),

        total: 0
      },
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
    ...mapState('backlog', ['list', 'page', 'loading', 'count', 'limit']),
    ...mapState('session', ['currentUser'])
  },

  async created() {
    await this.handleFetch({
      page: this.page,
      limit: this.limit,
      sorts: [],
      filters: this.parentFilters
    })
  },

  methods: {
    ...mapActions('backlog', ['fetchList']),
    doSearch() {
      this.handleTableChange(
        this.lastSetting.pagination,
        this.lastSetting.filters,
        this.lastSetting.sorter
      )
    },
    callback(key) {
      console.log(key)
    },
    async selectChanged() {
      await this.handleFetch({
        limit: Number(this.selected),
        page: this.pagination.current
      })
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
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

    navNew() {
      this.$router.push('/cp1/user/new')
    },

    async handleFetch(params) {
      try {
        params.url = '/sales/order/backlog/'
        await this.fetchList(params)
        const page = { ...this.pagination }
        page.total = this.count
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
</style>
