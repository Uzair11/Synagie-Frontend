<template>
  <div class="contentBody promotions">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="Add Promotion" key="1">
        <a-spin tip="Loading..." :spinning="loading">
          <a-form
            v-if="loaded"
            layout="horizontal"
            method="post"
            class="frm"
            :form="promoform"
            @submit="handleSubmit"
          >
            <fieldset>
              <a-form-item
                label="Code"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input v-model="gwp.code" placeholder="Code" />
              </a-form-item>

              <a-form-item
                label="Name"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input v-model="gwp.name" placeholder="Name" />
              </a-form-item>

              <a-form-item
                label="Supplier"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-select v-model="gwp.supplier ">
                  <a-select-option
                    v-for="option in supplierList"
                    :key="option.user_id"
                    :value="option.user_id"
                  >{{ option.supplier }}</a-select-option>
                </a-select>
              </a-form-item>
              <div class="from-to">
                <a-form-item
                  label="From"
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                >
                  <a-date-picker
                    v-decorator="['start_date-time-picker', config]"
                    format="MM-DD-YYYY HH:mm:ss"
                  />
                </a-form-item>
                <a-form-item
                  label="To"
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                >
                  <a-date-picker
                    v-decorator="['end_date-time-picker', config]"
                    format="MM-DD-YYYY HH:mm:ss"
                  />
                </a-form-item>
                <div class="is-selectable">
                  <a-form-item
                    label
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-checkbox
                      :checked="stackableCheck"
                      @change="handleStackableChange"
                    >is stackable ?</a-checkbox>
                  </a-form-item>
                </div>
                <div class="clear"></div>
              </div>
              <div class="channels" style="margin-left:220px;">
                <label>Channels :</label>
                <a-form-item
                  v-for="option in channelsList"
                  label
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                >
                  <a-checkbox @click="setChannels(option.channel_id)">{{option.name}}</a-checkbox>
                </a-form-item>
                <select v-model="gwp.promoStatus">
                  <option value="ENABLE">enable</option>
                  <option value="DISABLE">disable</option>
                </select>
                <div class="clear"></div>
              </div>
              <div class="main">
                <h4>Condition # 1</h4>
                <div class="top">
                  <div class="code">
                    <label>Code :</label>
                    <input type="text" />
                  </div>
                  <div class="weight">
                    <label>Weight :</label>
                    <input v-model="gwp.weight" type="text" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="left">
                  <h5>Condition(s)</h5>

                  <div class="require">
                    <a-form-item
                      label
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                    >
                      <a-checkbox
                        :checked="minimumAmountcheck"
                        @change="handleMinimumAmountChange"
                      >requires minimum order amount</a-checkbox>
                    </a-form-item>
                  </div>
                  <div class="amount">
                    <a-form-item
                      aria-placeholder="Order Amount"
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                    >
                      <a-input v-model="gwp.orderAmount" placeholder="Order Amount" />
                    </a-form-item>
                  </div>
                  <div class="requires_any">
                    <a-form-item
                      label
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                    >
                      <a-checkbox :checked="setAcheck" @change="handleSetACheckChange">requires any</a-checkbox>
                    </a-form-item>
                  </div>
                  <div class="sets">
                    <a-form-item
                      label
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                    >
                      <a-input v-model="gwp.numeberofProdA" placeholder />
                    </a-form-item>
                  </div>
                  <p>sets of matching purchase items Set A</p>
                  <div class="clear"></div>
                  <a-card>
                    <div class="btn-set">
                      <a-button type="primary" @click="add">Add</a-button>
                      <a-button type="primary" @click="addBulk">Add Bulk</a-button>
                      <div class="clear"></div>
                    </div>
                    <a-table :columns="columns" :data-source="productList" :pagination="false">
                      <span slot="remove_action" slot-scope="text, record">
                        <a @click="removeItem(record.sku_id,'prodA')">Remove</a>
                      </span>
                      <span slot="edit_action" slot-scope="text, record">
                        <a @click="EditItem(record.sku_id,'prodA')">Edit</a>
                      </span>
                    </a-table>
                  </a-card>
                  <div class="requires_any">
                    <a-form-item
                      label
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                    >
                      <a-checkbox :checked="setBcheck" @change="handleSerBCheckChange">requires any</a-checkbox>
                    </a-form-item>
                  </div>
                  <div class="sets">
                    <a-form-item
                      label
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                    >
                      <a-input v-model="gwp.numeberofProdB" placeholder />
                    </a-form-item>
                  </div>
                  <p>sets of matching purchase items Set B</p>
                  <div class="clear"></div>
                  <a-card>
                    <div class="btn-set">
                      <a-button type="primary" @click="addSetB">Add</a-button>
                      <a-button type="primary" @click="addBulkSetB">Add Bulk</a-button>
                      <div class="clear"></div>
                    </div>
                    <a-table :columns="columns" :data-source="productListSetB" :pagination="false">
                      <span slot="remove_action" slot-scope="text, record">
                        <a @click="removeItem(record.sku_id,'prodB')">Remove</a>
                      </span>
                      <span slot="edit_action" slot-scope="text, record">
                        <a @click="EditItem(record.sku_id,'prodB')">Edit</a>
                      </span>
                    </a-table>
                  </a-card>
                </div>
                <div class="right">
                  <h5>Reward(s)</h5>
                  <a-form-item
                    label
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-checkbox
                      :checked="discountCheck"
                      @change="handleDiscountCheckChange"
                    >applies discount on total amount</a-checkbox>
                  </a-form-item>
                  <div class="discount">
                    <input type="text" />
                    <select v-model="gwp.discount_type">
                      <option value="AMOUNT_OFF">amount</option>
                      <option value="PERCENT_OFF">percent</option>
                    </select>
                  </div>
                  <a-form-item
                    label
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-checkbox
                      :checked="rewardItemsCheck"
                      @change="handleRewardItemsCheckChange"
                    >reward items per minimum set A and B</a-checkbox>
                  </a-form-item>
                  <div class="clear"></div>
                  <a-card>
                    <a-button type="primary" @click="addReward">Add</a-button>
                    <a-table
                      :columns="rewardColumns"
                      :data-source="rewardsList"
                      :pagination="false"
                    >
                      <span slot="remove_action" slot-scope="text, record">
                        <a @click="removeItem(record.sku_id,'')">Remove</a>
                      </span>
                      <span slot="edit_action">
                        <a href="javascript:;">Edit</a>
                      </span>
                    </a-table>
                  </a-card>
                </div>
                <div class="clear"></div>
              </div>
            </fieldset>

            <a-row type="flex">
              <a-col :offset="formItemLayout.labelCol.span" :span="formItemLayout.wrapperCol.span">
                <a-button type="primary" @click="savePromtions">Save</a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane tab="Search Promotions" key="2" class="search" forceRender>
        <a-form
          v-if="loaded"
          layout="horizontal"
          method="post"
          class="frm"
          :form="searchForm"
          @submit="handleSubmit"
        >
          <fieldset>
            <a-form-item
              label="SKU Id"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="sku_id" placeholder="SKU Id" />
            </a-form-item>
            <a-form-item
              label="Merchant Id"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="merchant_id" placeholder="Merchant Id" />
            </a-form-item>
            <a-form-item
              label="Merchant Name"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="merchant_name" placeholder="Merchant Name" />
            </a-form-item>
            <a-form-item
              label="channel Id"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="channel_id" placeholder="Chanel Id" />
            </a-form-item>
            <a-form-item
              label="Channel Name"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="channel_name" placeholder="Channel Name" />
            </a-form-item>
            <a-form-item
              label="From"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-date-picker
                v-decorator="['search_start_date-time-picker']"
                format="MM-DD-YYYY HH:mm:ss"
              />
            </a-form-item>
            <a-form-item
              label="To"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-date-picker
                v-decorator="['search_end_date-time-picker']"
                format="MM-DD-YYYY HH:mm:ss"
              />
            </a-form-item>
            <div class="clear"></div>
            <a-button
              key="submit"
              type="primary"
              :loading="loading"
              @click="search()"
            >Search Promotions</a-button>
          </fieldset>

          <a-table
            :columns="searchColumns"
            :row-key="record => record.merchant_id"
            :data-source="searchResults"
            :pagination="false"
            :loading="loading"
          >
            <template slot="user_id" slot-scope="text, record">
              <nuxt-link :to="'/cp1/user/'+record.merchant_id">{{ record.merchant_id }}</nuxt-link>
            </template>

            <template slot="start_date" slot-scope="text">{{ text | dateFormat('date') }}</template>
            <template slot="end_date" slot-scope="text">{{ text | dateFormat('date') }}</template>
          </a-table>
        </a-form>
      </a-tab-pane>
    </a-tabs>

    <a-modal title="Add Items" v-model="addModal">
      <template slot="footer">
        <a-button key="back" @click="closeSkuModal">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="validateSku('bulk')">Save</a-button>
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
            label="SKU"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              placeholder="SKU"
              type="text"
              v-decorator="[
          'SKU',
          {rules: [{ required: true, message: 'SKU is required' }]}
        ]"
            />
          </a-form-item>
          <a-form-item
            label="Quantity"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Quantity"
              type="text"
              v-decorator="[
          'Quantity',
          {rules: [{ required: true, message: 'Quantityis required' }]}
        ]"
            />
          </a-form-item>
        </fieldset>
      </a-form>
    </a-modal>
    <a-modal title="Add Items" v-model="addRewardsModal">
      <template slot="footer">
        <a-button key="back" @click="closeRewardModal">Cancel</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="validateRewrdsSku('bulk')"
        >Save</a-button>
      </template>
      <a-form
        layout="horizontal"
        method="post"
        class="frm"
        :form="rewardform"
        @submit.prevent="handleSubmit"
      >
        <fieldset>
          <a-form-item
            label="SKU"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              placeholder="SKU"
              type="text"
              v-decorator="[
          'SKU',
          {rules: [{ required: true, message: 'SKU is required' }]}
        ]"
            />
          </a-form-item>
          <a-form-item
            label="Quantity"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Quantity"
              type="text"
              v-decorator="[
          'Quantity',
          {rules: [{ required: true, message: 'Quantity is required' }]}
        ]"
            />
          </a-form-item>
          <a-form-item
            label="Promo . Type"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select v-model="gwp.discountType">
              <a-select-option
                v-for="option in rewardsType"
                :key="option.id"
                :value="option.id"
              >{{ option.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="Discount"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Discount"
              type="text"
              v-decorator="[
          'Discount',
          {rules: [{ required: true, message: 'Discount is required' }]}
        ]"
            />
          </a-form-item>
          <a-form-item
            label="Max Quantity"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              placeholder="Max Quantity"
              type="text"
              v-decorator="[
          'MaxQuantity',
          {rules: [{ required: true, message: 'Max Quantity is required' }]}
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
import {
  Tabs as ATabs,
  Form as AForm,
  Upload as AUpload,
  Breadcrumb as ABreadcrumb,
  InputNumber as AInputNumber,
  Input as AInput,
  DatePicker as ADatePicker,
  Select as ASelect,
  Radio as ARadio,
  Spin as ASpin,
  Switch as ASwitch,
  Button as AButton,
  Icon as AIcon,
  Row as ARow,
  Col as ACol,
  Card as ACard,
  Checkbox as ACheckbox,
  Modal as AModal,
  Table as ATable,
  message
} from 'ant-design-vue'

import { cloneData } from '~/shared/general'
import { StandardError } from '~/errors/base'
import { mapState, mapActions } from 'vuex'
import { differences } from '~/shared/diff'
import _ from 'lodash'
import UserSelect from '~/components/form/user'
import TimestampInput from '~/components/form/timestamp_input'
import { constants } from 'crypto'
//import { truncate } from 'fs'

const ABreadcrumbItem = ABreadcrumb.Item
const AInputGroup = AInput.Group
const ARadioGroup = ARadio.Group
const ASelectOption = ASelect.Option
const AFormItem = AForm.Item
const ARadioButton = ARadio.Button
const ATextarea = AInput.TextArea
const ATabPane = ATabs.TabPane
const ACheckboxGroup = ACheckbox.Group
Vue.prototype.$message = message
const searchColumns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },

  {
    title: 'Channel Name',
    width: '15%',

    dataIndex: 'channelName'
  },

  {
    title: 'Code',
    width: '15%',
    dataIndex: 'code'
  },

  {
    title: 'Merchnat Id',
    width: '15%',
    dataIndex: 'merchnat_id'
  },

  {
    title: 'Start Date',
    width: '15%',
    dataIndex: 'start_date',
    scopedSlots: { customRender: 'start_date' }
  },

  {
    title: 'End Date',
    width: '15%',
    dataIndex: 'end_date',
    scopedSlots: { customRender: 'end_date' }
  }
]
const columns = [
  {
    title: 'Quantity',
    dataIndex: 'quantity'
  },

  {
    title: 'SKU',
    width: '15%',

    dataIndex: 'sku_id'
  },

  {
    title: 'Name',
    width: '15%',
    dataIndex: 'name'
  },

  {
    title: '',
    width: '15%',
    scopedSlots: { customRender: 'remove_action' }
  },

  {
    title: '',
    width: '15%',
    scopedSlots: { customRender: 'edit_action' }
  }
]
const rewardColumns = [
  {
    title: 'Qty',
    dataIndex: 'qty'
  },

  {
    title: 'SKU',
    width: '15%',

    dataIndex: 'sku_id'
  },

  {
    title: 'Name',
    width: '15%',
    dataIndex: 'name'
  },
  {
    title: 'Package',
    width: '15%',
    dataIndex: 'pkg'
  },
  {
    title: 'Promo',
    width: '15%',
    dataIndex: 'promo'
  },

  {
    title: '',
    width: '15%',
    scopedSlots: { customRender: 'remove_action' }
  },

  {
    title: '',
    width: '15%',
    scopedSlots: { customRender: 'edit_action' }
  }
]
const list = [
  {
    qty: 1,
    sku: 'SKU XXX',
    name: 'Product 1'
  },

  {
    qty: 2,
    sku: 'SKU YYYY',
    name: 'Product 2'
  }
]
const rewardsList = [
  {
    qty: 1,
    sku: 'SKU XXX',
    name: 'Product 1',
    pkg: '',
    promo: 'Free'
  },

  {
    qty: 2,
    sku: 'SKU YYYY',
    name: 'Product 2',
    pkg: '',
    promo: '10% off'
  }
]
export default {
  components: {
    // Register
    ATabs,
    ATabPane,
    AUpload,
    ARow,
    ACol,
    AIcon,
    ADatePicker,
    AInputNumber,
    AButton,
    ABreadcrumb,
    ABreadcrumbItem,
    AInput,
    ATextarea,
    AInputGroup,
    ARadio,
    ARadioGroup,
    ARadioButton,
    ACheckboxGroup,
    ACheckbox,
    ASelect,
    ASelectOption,
    ASpin,
    ASwitch,
    AForm,
    AFormItem,
    UserSelect,
    TimestampInput,
    ACard,
    AModal,
    ATable
  },

  data() {
    let res = {
      minimumAmountcheck: false,
      stackableCheck: false,
      setAcheck: false,
      setBcheck: false,
      discountCheck: false,
      rewardItemsCheck: false,
      merchant_id: '',
      merchant_name: '',
      channel_id: '',
      channel_name: '',
      sku_id: '',
      gwp: { channels: [] },
      photoURL: '',
      inputPhotoURL: null,
      loaded: false,
      addRewardsModal: false,
      addModal: false,
      bulkAdd: false,
      setB: false,
      columns: columns,
      productList: [],
      productListSetB: [],
      searchResults: [],
      searchColumns: searchColumns,
      list: list,
      rewardsType: [
        { id: 1, name: 'discount amount' },
        { id: 2, name: 'discount percent' },
        { id: 3, name: 'FREE' }
      ],
      rewardColumns: rewardColumns,
      config: {
        rules: [
          { type: 'object', required: true, message: 'Please select date!' }
        ]
      },
      rewardsList: [],
      form: this.$form.createForm(this)
    }

    return res
  },

  computed: {
    ...mapState('user', ['loading']),
    ...mapState('promotions', [
      'supplierList',
      'channelsList',
      'skuData',
      'productAList'
    ]),
    formItemLayout() {
      // let formLayout = 'horizontal'
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 10 }
      }
    }
  },
  //
  watch: {
    allSelected: function(val) {
      console.log(val)
    }
  },

  async created() {
    this.$store.dispatch('env/setTitle', 'Promotions')
    // console.log('query', this.$route.params)
    await this.getSuppliers()
    await this.getChannels()
    this.loaded = true
  },
  beforeCreate() {
    this.promoform = this.$form.createForm(this)
    this.rewardform = this.$form.createForm(this)
    this.searchForm = this.$form.createForm(this)
  },

  methods: {
    ...mapActions('promotions', [
      'fetchSupplierList',
      'fetchChannelsList',
      'addSku',
      'addBulkSku',
      'addSkuSetB',
      'addBulkSkuSetB',
      'addRewards',
      'addPromotion',
      'searchPromotion'
    ]),
    ...mapActions({
      checkPassword: 'user/checkPassword',
      saveUser: 'user/saveUser'
    }),
    handleMinimumAmountChange(e) {
      this.minimumAmountcheck = e.target.checked
    },
    handleStackableChange(e) {
      this.stackableCheck = e.target.checked
    },
    handleSetACheckChange(e) {
      this.setAcheck = e.target.checked
    },
    handleSerBCheckChange(e) {
      this.setBcheck = e.target.checked
    },
    handleDiscountCheckChange(e) {
      this.discountCheck = e.target.checked
    },
    handleRewardItemsCheckChange(e) {
      this.rewardItemsCheck = e.target.checked
    },
    async search() {
      let searchstr = ''
      let searchURL = ''
      let startDate = ''
      let endDate = ''
      this.searchForm.validateFields((err, fieldsValue) => {
        if (fieldsValue['search_start_date-time-picker'])
          startDate = fieldsValue['search_start_date-time-picker'].format(
            'MM-DD-YYYY'
          )
        if (fieldsValue['search_end_date-time-picker'])
          endDate = fieldsValue['search_end_date-time-picker'].format(
            'MM-DD-YYYY'
          )
      })
      console.log(startDate + ' ' + endDate)
      if (this.channel_name) {
        searchURL =
          '/gwp/promotions/search?type=CHANNEL_NAME&value=' + this.channel_name
      } else if (this.channel_id) {
        searchURL =
          '/gwp/promotions/search?type=CHANNEL_ID&value=' + this.channel_id
      } else if (this.merchant_id) {
        searchURL =
          '/gwp/promotions/search?type=MERCHANT_ID&value=' + this.merchant_id
      } else if (this.merchant_name) {
        searchURL =
          '/gwp/promotions/search?type=MERCHANT_NAME&value=' +
          this.merchant_name
      } else if (this.sku_id) {
        searchURL = '/gwp/promotions/search?type=SKU&value=' + this.sku_id
      } else if (startDate || endDate) {
        searchURL =
          '/gwp/promotions/search?type=DATE&start=' +
          startDate +
          '&end=' +
          endDate
      } else {
        return
      }
      let res = await this.searchPromotion(searchURL)
      this.searchResults = res
    },
    removeItem(id, recordType) {
      if (recordType == 'prodA') {
        for (var i = 0; i < this.productList.length; i++) {
          if (this.productList[i].sku_id == id) {
            this.productList.splice(i, 1)
            break
          }
        }
      } else if (recordType == 'prodB') {
        for (var i = 0; i < this.productListSetB.length; i++) {
          if (this.productListSetB[i].sku_id == id) {
            this.productListSetB.splice(i, 1)
            break
          }
        }
      } else {
        for (var i = 0; i < this.rewardsList.length; i++) {
          if (this.rewardsList[i].sku_id == id) {
            this.rewardsList.splice(i, 1)
            break
          }
        }
      }
    },
    EditItem(id, recordType) {
      if (recordType == 'prodA') {
        this.setB = false
        this.bulkAdd = false
        this.addModal = true
        this.form.setFieldsValue({
          ['SKU']: id
        })
      } else if (recordType == 'prodB') {
        this.setB = false
        this.bulkAdd = false
        this.addModal = true
        this.form.setFieldsValue({
          ['SKU']: id
        })
      } else {
        this.addRewardsModal = true
        this.rewardform.setFieldsValue({
          ['SKU']: id
        })
      }
    },
    setChannels(e) {
      this.gwp.channels.push({ channel_id: e })
    },
    closeSkuModal() {
      this.addModal = false
    },
    closeRewardModal() {
      this.addRewardsModal = false
    },
    add() {
      this.setB = false
      this.bulkAdd = false
      this.addModal = true
    },
    addBulk() {
      this.setB = false
      this.bulkAdd = true
      this.addModal = true
    },
    addSetB() {
      this.setB = true
      this.bulkAdd = false
      this.addModal = true
    },
    addBulkSetB() {
      this.setB = true
      this.bulkAdd = true
      this.addModal = true
    },
    async getSuppliers() {
      try {
        await this.fetchSupplierList()
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
      }
    },
    async getChannels() {
      try {
        await this.fetchChannelsList()
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
      }
    },
    validateSku(e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.setB) {
            if (this.bulkAdd == true) {
              this.AddSkuBulk({
                sku: values.SKU,
                quantity: values.Quantity,
                list: this.productList
              })
            } else {
              this.AddSku({
                sku: values.SKU,
                quantity: values.Quantity,
                list: this.productList
              })
            }
          } else {
            if (this.bulkAdd == true) {
              this.AddSkuBulkSetB({
                sku: values.SKU,
                quantity: values.Quantity,
                list: this.productListSetB
              })
            } else {
              this.AddSkuSetB({
                sku: values.SKU,
                quantity: values.Quantity,
                list: this.productListSetB
              })
            }
          }
        }
      })
    },
    validateRewrdsSku(e) {
      this.rewardform.validateFields((err, values) => {
        if (!err) {
          let discountType = ''

          this.AddRewardsSku({
            sku: values.SKU,
            quantity: values.Quantity,
            maxquantity: values.MaxQuantity,
            discount: values.Discount,
            discountType: this.gwp.discountType,
            list: this.rewardsList
          })
        }
      })
    },
    async AddRewardsSku(e) {
      try {
        let res = await this.addRewards(e)
        let isFound = false
        if (res.error) {
          this.$message.error('Unable to add sku or sku is not valid')
        } else {
          this.addRewardsModal = false
          res.forEach((element) => {
            this.rewardsList.forEach((current) => {
              if (element.sku_id == current.sku_id) {
                current.qty = element.qty
                current.promo = element.promo
                isFound = true
              }
            })
            if (!isFound) this.rewardsList.push(element)
          })

          this.$message.success('SKU is added successfully')
          this.rewardform.resetFields()
        }
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
        this.rewardform.resetFields()
      }
    },
    async AddSku(e) {
      try {
        let res = await this.addSku(e)
        let isFound = false
        if (res.error) {
          this.$message.error('Unable to add sku or sku is not valid')
        } else {
          this.addModal = false

          res.forEach((element) => {
            this.productList.forEach((current) => {
              if (element.sku_id == current.sku_id) {
                current.quantity = element.quantity
                isFound = true
              }
            })
            if (!isFound) this.productList.push(element)
          })
          this.$message.success('SKU is added successfully')
          this.form.resetFields()
        }
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
        this.form.resetFields()
      }
    },
    async AddSkuBulk(e) {
      try {
        let res = await this.addBulkSku(e)
        if (res.error) {
          this.$message.error('Unable to add sku or sku is not valid')
        } else {
          this.addModal = false
          res.forEach((element) => {
            this.productList.push(element)
          })
          this.$message.success('SKU is added successfully')
          this.form.resetFields()
        }
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
        this.form.resetFields()
      }
    },
    async AddSkuSetB(e) {
      try {
        let res = await this.addSkuSetB(e)
        if (res.error) {
          this.$message.error('Unable to add sku or sku is not valid')
        } else {
          this.addModal = false
          let isFound = false
          res.forEach((element) => {
            this.productListSetB.forEach((current) => {
              debugger
              if (element.sku_id == current.sku_id) {
                current.quantity = element.quantity
                isFound = true
              }
            })
            if (!isFound) this.productListSetB.push(element)
          })
          this.$message.success('SKU is added successfully')
          this.form.resetFields()
        }
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
        this.form.resetFields()
      }
    },
    async AddSkuBulkSetB(e) {
      try {
        let res = await this.addBulkSkuSetB(e)
        if (res.error) {
          this.$message.error('Unable to add sku or sku is not valid')
        } else {
          this.addModal = false
          res.forEach((element) => {
            this.productListSetB.push(element)
          })
          this.$message.success('SKU is added successfully')
          this.form.resetFields()
        }
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
        this.form.resetFields()
      }
    },
    handleSubmit() {},
    async savePromtions() {
      this.promoform.validateFields((err, fieldsValue) => {
        if (err) {
          return
        } else {
          this.gwp.is_stackable = this.stackableCheck
          this.gwp.start_date = fieldsValue['start_date-time-picker'].format(
            'MM-DD-YYYY'
          )
          this.gwp.end_date = fieldsValue['end_date-time-picker'].format(
            'MM-DD-YYYY'
          )
          this.gwp.remarks = 'esting'
          this.status = this.gwp.promoStatus
          let supplier = { user_id: this.gwp.supplier }
          this.gwp.supplier = supplier
          this.gwp.promotions = []
          let promotions = {}
          let min_order_required = { amount: this.gwp.orderAmount }
          let conditions = { min_order_required: min_order_required }
          promotions.Code = this.gwp.Code
          promotions.weight = this.gwp.weight
          promotions.conditions = conditions
          let require_from_set_a = {}
          let require_from_set_b = {}
          require_from_set_a.required_items_quantity = this.gwp.numeberofProdA
          require_from_set_a.items = this.productList
          require_from_set_b.required_items_quantity = this.gwp.numeberofProdB
          require_from_set_b.items = this.productListSetB
          promotions.require_from_set_a = require_from_set_a
          promotions.require_from_set_b = require_from_set_b
          let total_amount_discount = {
            value: 10,
            discount_type: gwp.discount_type
          }
          let reward_items_per_condition_sets = this.rewardsList
          let rewards = {
            total_amount_discount: total_amount_discount,
            reward_items_per_condition_sets: reward_items_per_condition_sets
          }
          //  this.gwp.rewards = rewards
          promotions.rewards = rewards
          this.gwp.promotions.push(promotions)

          this.AddPromo()
          console.log(this.gwp)
        }
      })

      console.log(this.gwp)
    },
    async AddPromo(data) {
      let res = await this.addPromotion(this.gwp)
    },
    addReward() {
      this.addRewardsModal = true
    }
  },

  layout() {
    return 'member'
  },
  middleware: ['isAuth']
}
</script>

<style>
/* .ant-spin-spinning {
  display: block;
  position: relative;
  width: 100%;
  min-height: 500px;
  height: 100%;
}
.from-to .ant-form-item {
  display: inline-block;
}

.from-to .ant-form-item:first-child {
  width: 27%;
  margin-left: 209px;
}

.from-to .ant-form-item:nth-child(2) {
  width: 40%;
  margin-left: -136px;
}

.from-to {
  position: relative;
}
.is-selectable {
  position: absolute;
  left: 479px;
  width: 100%;
  top: 0;
}
.channels .ant-form-item {
  display: inline-block;
}

.channels.ant-form-item:first-child {
  width: 27%;
  margin-left: 209px;
} */
.ant-checkbox-checked .ant-checkbox-inner {
  background-color: #ff9900 !important;
  border-color: #ff9900 !important;
}
.ant-checkbox-wrapper:hover .ant-checkbox-inner,
.ant-checkbox:hover .ant-checkbox-inner,
.ant-checkbox-input:focus + .ant-checkbox-inner {
  border-color: #ff9900 !important;
}
.ant-select-open .ant-select-selection {
  border-color: #ff9900 !important;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  border-right-width: 1px !important;
}
.ant-select-dropdown.ant-select-dropdown--multiple
  .ant-select-dropdown-menu-item-selected
  .ant-select-selected-icon,
.ant-select-dropdown.ant-select-dropdown--multiple
  .ant-select-dropdown-menu-item-selected:hover
  .ant-select-selected-icon {
  color: #ff9900 !important;
  display: inline-block;
}
.ant-calendar-today .ant-calendar-date {
  border-color: #ff9900 !important;
  font-weight: bold;
  color: #ff9900 !important;
}
.ant-calendar-today .ant-calendar-date {
  border-color: #ff9900 !important;
  font-weight: bold;
  color: #ff9900 !important;
}
.ant-calendar-selected-date .ant-calendar-date,
.ant-calendar-selected-start-date .ant-calendar-date,
.ant-calendar-selected-end-date .ant-calendar-date {
  background: white !important;
  color: #fff;
  border: 1px solid transparent;
}
.ant-calendar-selected-day .ant-calendar-date {
  background: white !important;
}
.ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled) {
  border-color: #ff9900 !important;
}
.ant-calendar-selected-day .ant-calendar-date {
  background: tint(#ff9900, 80%);
}

/*-------promotion------*/
.clear {
  clear: both;
}
.promotions input,
.promotions .ant-select-selection {
  width: 100% !important;
  border: 1px solid #000 !important;
  border-radius: 2px !important;
}

.promotions fieldset {
  padding: 30px 20px;
  margin: 0;
}
.promotions .ant-col-6 {
  width: 10%;
}
.promotions .from-to .ant-form-item {
  width: 29.3%;
  float: left;
}
.promotions .from-to .is-selectable .ant-form-item {
  width: 30%;
}
.promotions .from-to .ant-col-6 {
  width: 34%;
}
.promotions .ant-calendar-picker {
  width: 100%;
}
.promotions .channels > label {
  float: left;
  color: #000;
  padding: 10px 5px;
}
.promotions .channels .ant-form-item {
  float: left;
  width: 10%;
}
.promotions .channels .ant-form-item span {
  font-size: 11px;
}
.promotions .channels .ant-form-item .ant-col-10 {
  width: 100%;
}
.promotions .ant-checkbox-inner {
  border-color: #000;
}
.promotions .main {
  background-color: #f0f0f0;
  margin-top: 20px;
  border: 1px solid #e9e9e9;
}
.promotions .main h4 {
  color: #fff;
  padding: 5px 10px;
  background-color: #ff9900;
  margin: 0;
}
.promotions .main .top {
  padding: 20px 10px;
}
.promotions .main .top .code {
  width: 30%;
  float: left;
  padding: 0 10px;
}
.promotions .main .top .weight {
  width: 20%;
  float: left;
  padding: 0 10px;
}
.promotions .main .top label {
  display: inline;
}
.promotions .main .top input {
  width: 50% !important;
}
.promotions .main .left,
.promotions .main .right {
  padding: 20px 10px;
  width: 50%;
  float: left;
}
.promotions .main .left .require {
  width: 60%;
  float: left;
}
.promotions .main .left .amount {
  width: 40%;
  float: left;
}
.promotions .main .left .requires_any {
  width: 25%;
  float: left;
}
.promotions .main .left .sets {
  width: 15%;
  float: left;
}
.promotions .main .left .require .ant-col-10,
.promotions .main .left .amount .ant-col-10,
.promotions .main .left .requires_any .ant-col-10,
.promotions .main .left .sets .ant-col-10,
.promotions .main .right .ant-col-10 {
  width: 100%;
}
.promotions .main .left p {
  font-size: 14px;
  padding: 5px 10px;
  float: left;
}
.promotions .main .left .btn-set button.ant-btn-primary {
  float: left;
}
.promotions .main .left .btn-set button.ant-btn-primary:nth-child(2) {
  float: right;
}
.promotions .ant-row-flex .ant-col-offset-6 {
  margin-left: 2%;
}
.promotions .right .ant-form-item {
  width: 65%;
  float: left;
}
.promotions .right .discount {
  float: left;
  width: 35%;
}
.promotions .right .discount input {
  width: 50% !important;
}
.promotions .search .ant-form-item {
  width: 25%;
  float: left;
}
.promotions .search .ant-col-6,
.promotions .search .ant-col-10 {
  width: 50%;
}
.promotions .search button {
  float: right;
}
</style>
