<template>
  <div>
    <a-spin tip="Loading..." :spinning="loading">
      <a-auto-complete
        :placeholder="placeholder || 'search a user'"
        :allow-clear="false"
        :value="selected ? selected.uid: ''"
        @search="handleSearch"
        @change="handleSelect"
      >
        <template slot="dataSource">
          <a-select-option
            v-for="row in list"
            :key="row.uid"
            :value="row.uid"
          >{{ row.firstName }} {{ row.lastName }} ({{ row.email }})</a-select-option>
        </template>
      </a-auto-complete>
    </a-spin>
  </div>
</template>

<script>
'use strict'

import { pagination as gPage, formats } from '../../shared/general'
import { mapState, mapActions } from 'vuex'
import {
  Spin as ASpin,
  AutoComplete as AAutoComplete,
  Row as ARow,
  Col as ACol,
  Button as AButton,
  Select as ASelect
} from 'ant-design-vue'

const ASelectOption = ASelect.Option

export default {
  components: {
    ASpin,
    ASelect,
    ASelectOption,
    AAutoComplete,
    ARow,
    ACol,
    AButton,
    formats
  },

  props: {
    placeholder: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },

  data() {
    // console.log('input', this.id)
    if (this.id) {
      const scoped = this
      this.$store.dispatch('user/fetchUser', this.id).then((res) => {
        // console.log('fetched', res)
        res.uid = res._id
        if (!res.uid) {
          return
        }
        scoped.list = [res]
        scoped.selected = res
      })
    }
    return {
      search: '',
      list: [],
      changeSearch: 0,
      selected: null
    }
  },

  computed: {
    ...mapState('user', { loading: 'loading' })
  },

  async created() {
    // console.log('list', this.list)
    // let pFilter = {}
    // if (this.search) {
    //   pFilter.search = {
    //     $text: { $search: this.search }
    //   }
    // }
    // this.list = await this.$store.dispatch('users/fetchUserList', {
    //   page: 1,
    //   limit: 9999,
    //   sorts: [],
    //   filters: pFilter
    // })
  },

  methods: {
    async handleSelect(s) {
      let user = null
      for (let c = 0; c < this.list.length; c++) {
        if (this.list[c].uid === s) {
          user = this.list[c]
          break
        }
      }
      console.log('selected', s, user)
      this.selected = user
      this.$emit('change', s, user)
      this.$emit('update:id', s)
    },
    async handleSearch(s) {
      this.changeSearch++
      // console.log('search', s)
      if (!s) {
        return
      }

      this.search = s
      const scoped = this
      const index = this.changeSearch
      setTimeout(function() {
        scoped.doSearch(index)
      }, 1000)
      // let re = new RegExp('.*' + this.search + '.*', 'i')
      // let re = '.*' + this.search + '.*'
    },
    async doSearch(index) {
      if (index !== this.changeSearch) {
        return
      }

      let pFilter = {}
      pFilter.search = this.search
      try {
        this.list = await this.$store.dispatch('user/fetchUserList', {
          page: 1,
          limit: 9999,
          sorts: [],
          filters: pFilter
        })
      } catch (e) {
        this.$store.dispatch('user/loading', false)
        this.$store.dispatch('alert/error', e.message)
      }
    }
  } // methods
}
</script>

<style>
</style>
