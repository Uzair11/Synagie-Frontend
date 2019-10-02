<template>
  <div>
    <a-list size="small" bordered :data-source="value">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-row>
          <a-col :span="20" v-if="inputType == 'select'">
            <a-select
              v-if="valueType == 'object'"
              v-model="value[index].value"
              @change="function(e) { changeInputSelect(e, index) }"
            >
              <a-select-option
                v-for="option in options"
                :key="option.id"
                :value="option.id"
              >{{ option.label }}</a-select-option>
            </a-select>
            <a-select
              v-else-if="valueType == 'value'"
              v-model="value[index]"
              @change="function(e) { changeInputSelect(e, index) }"
            >
              <a-select-option
                v-for="option in options"
                :key="option.id"
                :value="option.id"
              >{{ option.label }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="10" v-if="inputType != 'select'">
            <a-input
              v-if="inputType=='input'"
              v-model="value[index].value"
              class="input"
              :placeholder="inputPlaceHolder"
              @change="function(e) { onInput(e, index) }"
            />
            <a-input-number
              v-if="inputType=='number'"
              v-model="value[index].value"
              class="input"
              :placeholder="inputPlaceHolder"
              @change="function(e) { onInput(e, index) }"
            />
          </a-col>
          <a-col :span="10" v-if="inputType != 'select'">
            <a-input
              v-if="labelType=='input'"
              v-model="value[index].label"
              class="input"
              :placeholder="labelPlaceHolder"
              @change="function(e) { onInput(e, index) }"
            />
            <a-input-number
              v-if="labelType=='number'"
              v-model="value[index].label"
              class="input"
              :placeholder="labelPlaceHolder"
              @change="function(e) { onInput(e, index) }"
            />
          </a-col>
          <a-col :span="4" style="padding-left: 5px;">
            <a href="javascript:" @click="deleteItem(index)">
              <a-icon type="delete">delete</a-icon>
            </a>
            <a-icon v-if="index > 0" type="caret-up" @click="moveUp(index)" />
            <a-icon v-if="index < value.length-1" type="caret-down" @click="moveDown(index)" />
          </a-col>
        </a-row>
      </a-list-item>
      <div slot="header">
        <a href="javascript:" @click="add">+ Add</a>
      </div>
      <div slot="footer">
        <a href="javascript:" @click="add">+ Add</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  Icon as AIcon,
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

const AListItem = AList.Item
const AInputGroup = AInput.Group
const ASelectOption = ASelect.Option

export default {
  components: {
    AList,
    AListItem,
    AButton,
    ASelect,
    ASelectOption,
    ARow,
    ACol,
    AInputGroup,
    AInput,
    AInputNumber,
    AIcon
  },

  props: {
    inputType: {
      type: String,
      default: () => {
        return 'input'
      }
    },
    valueType: {
      type: String,
      default: () => {
        return 'object'
      }
    },
    labelType: {
      type: String,
      default: () => {
        return 'input'
      }
    },
    inputPlaceHolder: {
      type: String,
      default: () => {
        return 'value'
      }
    },
    labelPlaceHolder: {
      type: String,
      default: () => {
        return 'display'
      }
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    add() {
      let val = this.valueType === 'object' ? { value: '', label: '' } : ''
      this.value.push(val)
      this.$emit('change', this.value.length - 1, val)
      this.$emit('update:value', this.value)
    },

    moveUp(index) {
      let rows = this.value.splice(index, 1)
      this.value.splice(index - 1, 0, rows[0])

      this.$emit('change', index, rows[0])
      this.$emit('update:value', this.value)
    },

    moveDown(index) {
      let rows = this.value.splice(index, 1)
      this.value.splice(index + 1, 0, rows[0])

      this.$emit('change', index, rows[0])
      this.$emit('update:value', this.value)
    },

    changeInputSelect(v, index) {
      for (let c = 0; c < this.options.length; c++) {
        // console.log('comparing', this.options[c].id, v)
        if (this.valueType === 'object' && this.options[c].id === v) {
          this.value[index].label = this.options[c].label
          break
        } else if (this.valueType === 'value') {
          // console.log('found', v, this.options[c])
          this.value[index] = v
          break
        }
      }
      // console.log('changeInputSelect', e, index)
      // console.log('value', this.value)
      this.$emit('change', index, this.value[index])
      this.$emit('update:value', this.value)
    },
    onInput(e, index) {
      // console.log('input', e, index)
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
