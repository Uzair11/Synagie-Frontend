<template>
  <div class="contentBody">
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="Pending" key="1">
        <Pending />
      </a-tab-pane>
      <a-tab-pane tab="Completed" key="2" forceRender>
        <Completed />
      </a-tab-pane>

      <a-tab-pane tab="Canceled" key="3">
        <Canceled />
      </a-tab-pane>
      <a-tab-pane tab="Backlog" key="4">
        <Backlog />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
'use strict'

import { pagination as gPage } from '../../../shared/general'
import { mapState, mapActions } from 'vuex'
import { ObjectId } from 'bson'
import Pending from '../../../components/sales/Pending'
import Completed from '../../../components/sales/Completed'
import Canceled from '../../../components/sales/Canceled'
import Backlog from '../../../components/sales/Backlog'
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
    ATabPane,
    Pending,
    Completed,
    Canceled,
    Backlog
  },

  data() {
    return {}
  },

  computed: {
    ...mapState('user', ['list', 'page', 'loading', 'count', 'limit']),
    ...mapState('session', ['currentUser'])
  },

  async created() {},

  methods: {
    ...mapActions('user', ['fetchUserList']),
    callback() {}
  },

  layout() {
    return 'member'
  },
  middleware: ['isAuth']
}
</script>

<style>
</style>
