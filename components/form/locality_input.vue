<template>
  <div>
    <div v-if="isNew">
      <a-row>
        <a-col :span="14">
          <a-select
            v-model="newCountry"
            placeholder="select country"
            :show-search="true"
            :filter-option="(input, option) => {
              return option.data.attrs.text.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }"
          >
            <a-select-option
              v-for="option in countries"
              :key="option.code"
              :value="option.code"
              :text="option.name"
            >{{option.name}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="10">
          <a-button @click="add">Add</a-button>
        </a-col>
      </a-row>
    </div>
    <a-list size="small" bordered :data-source="Object.keys(value)">
      <a-list-item slot="renderItem" slot-scope="key">
        <a-row>
          <a-col :span="6">
            <span v-if="key">{{countryNames[key.toLowerCase()].label}}</span>
            <span
              v-if="false"
            >{{settings.country[key.toLowerCase()] ? settings.country[key.toLowerCase()].religions : null}}</span>
          </a-col>
          <a-col :span="17">
            <a-row>
              <a-col
                :span="4"
                
                :value="religionKey"
              >
                <fragment
                  v-if="religionKey==='0' || !settings.country[key.toLowerCase()] || settings.country[key.toLowerCase()].religions[religionKey] !== undefined"
                >
                  {{religion.label}}
                  <br />
                  <a-switch
                    v-model="value[key][religionKey]"
                    checked-children="Yes"
                    un-checked-children="No"
                    @change="function (e) { onReligionCheck(e, key, religionKey) }"
                  />
                </fragment>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="1" style="padding-left: 5px;">
            <a href="javascript:" @click="deleteItem(key)">
              <a-icon type="delete">delete</a-icon>
            </a>
          </a-col>
        </a-row>
      </a-list-item>
      <div slot="header"></div>
      <div slot="footer"></div>
    </a-list>
  </div>
</template>

<script lang='ts'>
import { mapState, mapActions } from 'vuex'
import {
  Switch as ASwitch,
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
//import { religions } from '../../shared/general'

const AListItem = AList.Item
const AInputGroup = AInput.Group
const ASelectOption = ASelect.Option

export default {
  components: {
    ASwitch,
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
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    let reliG = { '0': { label: 'All' } }
    // religions.forEach((row) => {
    //   reliG[row.id] = { label: row.label }
    // })

    let countryNames = {}
    this.$store.state.env.countries.forEach((row) => {
      countryNames[row.code.toLowerCase()] = { label: row.name }
    })

    return {
      settings: { country: {} },
      countryNames: countryNames,
      countries: this.$store.state.env.countries,
      isNew: true,
      newCountry: '',
      religions: reliG
    }
  },
  computed: {},
  async mounted() {
    const scoped = this
    this.settings = await this.$store.dispatch('env/fetchMobileSettings')
  },
  methods: {
    add() {
      if (!this.newCountry) {
        alert('please select a country')
        return
      }

      if (this.value[this.newCountry]) {
        this.$store.dispatch('alert/error', 'country already inserted')
        return
      }

      let newValues = { '0': false, '99': true }
      // for (let c = 0; c < religions.length; c++) {
      //   newValues[religions[c].id] = false
      // }

      if (this.value === undefined || this.value === null) {
        this.value = {}
      }
      this.value[this.newCountry.toLowerCase()] = newValues
      this.newCountry = ''
      // this.isNew = false
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

    onReligionCheck(checked: any, country: string, religion: string) {
      console.log('checked?', checked, country, religion)

      if (religion === '0') {
        if (checked) {
          // check all
          // religions.forEach((row) => {
          //   this.value[country][row.id] = true
          // })
        } else {
          // religions.forEach((row) => {
          //   this.value[country][row.id] = false
          // })
        }
      } else if (this.value[country]['0']) {
        this.value[country]['0'] = false // off all
      }
      this.value[country][religion] = checked

      // console.log('input', e, index)
      console.log('value', this.value)
      this.$emit('change', country, this.value[country])
      this.$emit('update:value', this.value)
      this.$forceUpdate()
    },
    deleteItem(i) {
      if (!confirm('Confirm remove?')) {
        return
      }

      delete this.value[i]
      // console.log('delete', i)
      // console.log('list', this.value)
      this.$emit('change', i, null)
      this.$emit('update:value', this.value)
      this.$forceUpdate()
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
