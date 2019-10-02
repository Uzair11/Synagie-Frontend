<template>
  <div>
    <a-tabs size="small">
      <a-tab-pane v-for="lang in languages" :key="lang.id">
        <span slot="tab">
          <img :src="'/assets/locales/'+lang.id+'.svg'" class="icoflag" />
          {{lang.label}}
        </span>

        <slot :name="'input'+'_'+lang.id" />
      </a-tab-pane>
      <a-tab-pane tab="Original" key="1">
        <slot name="input" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang='ts'>
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

import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import { languages } from '../../shared/general'

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

  data() {
    let res = {
      loaded: false,
      languages: languages
    }

    return res
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
    // article: {
    //   handler(val, oldval) {
    //     if (!this.loaded) return // ignore
    //     // console.log('changed', val, oldval)
    //     console.log('changes', differences(val, this.article))
    //     // do stuff
    //   },
    //   deep: true
    // }
  },

  async created() {
    // console.log('query', this.$route.params)
    this.loaded = true
  },

  methods: {
    onInput(e, index) {
      console.log('input', e, index)
      this.$emit('change', index, this.value[index])
      this.$emit('update:value', this.value)
    }
  }
}
</script>

<style>
</style>
