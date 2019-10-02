<template>
  <div class="contentBody">
    <h3 v-if="id">{{id}} Delivery Order Details</h3>
    <a-breadcrumb>
      <a-breadcrumb-item href="/cp/sales">
        <a-icon type="global" />
        <n-link to="/cp1/sales">Admin Sales</n-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>Order Information</a-breadcrumb-item>
    </a-breadcrumb>
    <div v-if="showData">
      <a-row type="flex">
        <a-col :span="8" :order="4">
          <a-card>
            <h3>{{orderDetails.completed_datetime  | dateFormat('date')}}</h3>
            <p>Completed Date</p>
          </a-card>
        </a-col>
        <a-col :span="8" :order="3">
          <a-card>
            <h3>{{orderDetails.created_datetime  | dateFormat('date')}}</h3>
            <p>Created Date</p>
          </a-card>
        </a-col>
        <a-col :span="8" :order="2">
          <a-card>
            <h3>{{orderDetails.status}}</h3>
            <p>Status</p>
          </a-card>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="8" :order="4">
          <a-card>
            <h3>{{orderDetails.delivery_datetime  | dateFormat('date')}}</h3>
            <p>Delivery Date</p>
          </a-card>
        </a-col>
        <a-col :span="8" :order="3" :v-if="orderDetails.deliveryMethod">
          <a-card>
            <h3>{{orderDetails.deliveryMethod.delivery_name}}</h3>
            <p>Delivery Method</p>
          </a-card>
        </a-col>
        <a-col :span="8" :order="2">
          <a-card>
            <h3>{{orderDetails.channel_order_id}}</h3>
            <p>Channel Order ID</p>
          </a-card>
        </a-col>
      </a-row>
      <a-row type="flex" v-if="!orderDetails.user">
        <a-col :span="8" :order="3">
          <a-card>
            <h3>{{orderDetails.address}} {{orderDetails.postal_code}}</h3>
            <p>Address</p>
          </a-card>
        </a-col>
        <a-col :span="8" :order="2">
          <a-card>
            <h3>{{orderDetails.recipient_name}}</h3>
            <p>Recipient Name</p>
          </a-card>
        </a-col>
      </a-row>
      <a-row type="flex" v-if="orderDetails.user">
        <a-col :span="8" :order="3">
          <a-card>
            <h3>{{orderDetails.user.billing_address}}</h3>
            <p>Address</p>
          </a-card>
        </a-col>
        <a-col :span="8" :order="2">
          <a-card>
            <h3>{{orderDetails.user.first_name}}</h3>
            <p>Recipient Name</p>
          </a-card>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="14" :order="1">
          <a-card title="Items">
            <a-table
              :columns="columns"
              :row-key="record => record.BTFL"
              :data-source="orderDetails.items"
              :pagination="false"
            ></a-table>
          </a-card>
        </a-col>
        <a-col :span="8" :order="2">
          <a-card title="Pricing Value">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Attribute</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Payment Mode</td>
                  <td>{{orderDetails.payment_mode}}</td>
                </tr>
                <tr>
                  <td>Discount Value</td>
                  <td>{{orderDetails.discount_value}}</td>
                </tr>
                <tr>
                  <td>Coupon Value</td>
                  <td>{{orderDetails.coupon_value}}</td>
                </tr>
                <tr>
                  <td>Fullfillment Cost</td>
                  <td>{{orderDetails.order_total}}</td>
                </tr>
                <tr>
                  <td>Delivery Cost</td>
                  <td>{{orderDetails.delivery_cost}}</td>
                </tr>
                <tr>
                  <td>Customer Paid Delivery Fees</td>
                  <td>{{orderDetails.shipping_cost}}</td>
                </tr>
                <tr>
                  <td>GST</td>
                  <td>{{orderDetails.gst}}</td>
                </tr>
              </tbody>
            </table>
          </a-card>
        </a-col>
      </a-row>
      <a-row type="flex" v-if="orderDetails.user">
        <a-col :span="16" :order="1">
          <a-card title="Cancelled Items" class="red-font">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">SKU</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">BTFL PLU</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Selling Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in orderDetails.items">
                  <td>{{item.sku_id}}</td>
                  <td>{{item.product_name}}</td>
                  <td>{{item.legacy_code}}</td>
                  <td>{{item.quantity}}</td>
                  <td>{{item.selling_price}}</td>
                </tr>
              </tbody>
            </table>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
'use strict'

import {
  Tabs as ATabs,
  Breadcrumb as ABreadcrumb,
  Icon as AIcon,
  Card as ACard,
  Row as ARow,
  Col as ACol,
  Table as ATable
} from 'ant-design-vue'

import { cloneData } from '~/shared/general'
import { StandardError } from '~/errors/base'
import { mapState, mapActions } from 'vuex'
import { differences } from '~/shared/diff'
import _ from 'lodash'
import UserSelect from '~/components/form/user'
import TimestampInput from '~/components/form/timestamp_input'

const ABreadcrumbItem = ABreadcrumb.Item
const ATabPane = ATabs.TabPane
const columns = [
  {
    title: 'SKU',
    dataIndex: 'product_name'
  },

  {
    title: 'BTFL PLU',
    width: '15%',
    dataIndex: 'legacy_code'
  },
  {
    title: 'Preferred Bin',
    dataIndex: 'preferred_bin_id'
  },
  ,
  {
    title: 'Quantity',
    dataIndex: 'quantity'
  },
  {
    title: 'Total Sales',
    width: '15%',
    dataIndex: 'selling_price'
  }
]

export default {
  components: {
    // Register
    ATabs,
    ATabPane,
    AIcon,
    ABreadcrumb,
    ABreadcrumbItem,
    UserSelect,
    TimestampInput,
    ACard,
    ARow,
    ACol,
    ATable
  },

  data() {
    return {
      id: this.$route.params.id ? this.$route.params.id : '',
      columns: columns,
      showData: false,
      orderDetails: []
    }
  },

  computed: {
    formItemLayout() {
      // let formLayout = 'horizontal'
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
    }
  },
  //
  watch: {
    // user: {
    //   handler(val, oldval) {
    //     if (!this.loaded) return // ignore
    //     // console.log('changed', val, oldval)
    //     console.log('changes', differences(val, this.user))
    //     // do stuff
    //   },
    //   deep: true
    // }
  },

  async created() {
    this.id = this.$route.params.orderid
    this.loaded = true
    await this.handleFetch()
  },

  methods: {
    ...mapActions('sales', ['fetchOrderDetails']),
    async handleFetch() {
      try {
        let url = '/sales/order/details/' + this.id
        let res = await this.fetchOrderDetails(url)
        this.orderDetails = res
        this.showData = true
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
.ant-card-head-title .red-font {
  color: red !important;
}
.ant-spin-spinning {
  display: block;
  position: relative;
  width: 100%;
  min-height: 500px;
  height: 100%;
}
</style>
