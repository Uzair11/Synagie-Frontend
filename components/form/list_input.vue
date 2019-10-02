<template>
  <div>
    <a-list size="small" bordered :data-source="value">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-row>
          <a-col :span="21">
            <a-input
              v-if="inputType=='input'"
              v-model="value[index]"
              class="input"
              @change="function(e) { onInput(e, index) }"
            />
            <a-input-number
              v-if="inputType=='number'"
              v-model="value[index]"
              class="input"
              @change="function(e) { onInput(e, index) }"
            />
          </a-col>
          <a-col :span="3" style="padding-left: 5px;">
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

export default {
  components: {
    AList,
    AListItem,
    AButton,
    ASelect,
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
      this.value.push('')
      this.$emit('change', this.value.length - 1, '')
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
