<template>
  <div>
    <a-date-picker v-model="input" @change="onInput" />
  </div>
</template>

<script lang="ts">
'use strict'

import * as firebase from 'firebase/app'
import 'firebase/firestore'

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
  Checkbox as ACheckbox
} from 'ant-design-vue'

//import moment from 'moment'

const ABreadcrumbItem = ABreadcrumb.Item
const AInputGroup = AInput.Group
const ARadioGroup = ARadio.Group
const ASelectOption = ASelect.Option
const AFormItem = AForm.Item
const ARadioButton = ARadio.Button
const ATextarea = AInput.TextArea
const ATabPane = ATabs.TabPane
const ACheckboxGroup = ACheckbox.Group

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
    AFormItem
  },

  props: {
    value: {
      type: Object,
      default: () => {
        return null
      }
    }
  },

  data() {
    let res: any = {
      input:
        this.value && this.value.toDate 
    }
    return res
  },

  computed: {
    disabledDate(): boolean {
      return true
    },
    onInput(): any {
      // console.log('input', e, index)
      // console.log('this', this.input)
      if (!this.input) {
        this.$emit('change', null)
        this.$emit('update:value', null)
        return null
      }

      let value: firebase.firestore.Timestamp = firebase.firestore.Timestamp.fromDate(
        this.input.toDate()
      )
      this.$emit('change', value)
      this.$emit('update:value', value)
      return null
    },
    formItemLayout(): any {
      // let formLayout = 'horizontal'
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
    }
  },
  //
  watch: {
    // value: {
    //   handler(val, oldval) {
    //     console.log('watched', val)
    //     if (val) {
    //       // this.input = moment(this.value.toDate())
    //     } else {
    //       // this.input = null
    //     }
    //   }
    // },
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

  async created() {},

  methods: {}
}
</script>
