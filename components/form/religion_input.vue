<template>
  <div>
    <a-form-item
      label="For Muslim"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-switch
        v-model="value['1']"
        checked-children="Yes"
        un-checked-children="No"
        @change="onInput"
      />
    </a-form-item>

    <a-form-item
      label="For Buddhist"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-switch
        v-model="value['2']"
        checked-children="Yes"
        un-checked-children="No"
        @change="onInput"
      />
    </a-form-item>

    <a-form-item
      label="For Hindu"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-switch
        v-model="value['3']"
        checked-children="Yes"
        un-checked-children="No"
        @change="onInput"
      />
    </a-form-item>

    <a-form-item
      label="For Christian"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-switch
        v-model="value['5']"
        checked-children="Yes"
        un-checked-children="No"
        @change="onInput"
      />
    </a-form-item>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  Icon as AIcon,
  Form as AForm,
  Switch as ASwitch,
  Input as AInput,
  InputNumber as AInputNumber,
  List as AList,
  Spin as ASpin,
  AutoComplete as AAutoComplete,
  Row as ARow,
  Col as ACol,
  Button as AButton,
  Select as ASelect
} from 'ant-design-vue'

const AFormItem = AForm.Item
const AListItem = AList.Item
const AInputGroup = AInput.Group

export default {
  components: {
    AList,
    AListItem,
    AButton,
    ASelect,
    ASwitch,
    ARow,
    AFormItem,
    ACol,
    AInputGroup,
    AInput,
    AInputNumber,
    AIcon
  },

  props: {
    value: {
      type: Object,
      default: () => {
        return { '1': false, '2': false, '3': false }
      }
    }
  },
  data() {
    return {}
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
  mounted() {},
  methods: {
    onInput(e, index) {
      console.log('input', e, index)
      this.$emit('change', index, this.value[index])
      this.$emit('update:value', this.value)
    },
    deleteItem(i) {
      if (!confirm('Confirm remove?')) {
        return
      }

      // console.log('delete', i)
      this.value.splice(i, 1)
      // console.log('list', this.value)
      this.$emit('change', i, null)
      this.$emit('update:value', this.value)
    }
  }
}
</script>

<style type='scss' scoped>
.input {
  width: 100%;
}

.ant-row {
  width: 100%;
}
</style>
