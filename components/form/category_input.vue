<template>
  <div>
    <a-spin tip="Loading..." :spinning="loading">
      <a-auto-complete
        :placeholder="placeholder || 'search a category'"
        :allow-clear="true"
        :value="selected ? selected._id: ''"
        @search="handleSearch"
        @change="handleSelect"
      >
        <template slot="dataSource">
          <a-select-option v-for="row in list" :key="row._id" :value="row._id">{{ row.name }}</a-select-option>
        </template>
      </a-auto-complete>
    </a-spin>
  </div>
</template>

<script lang='ts'>
'use strict'
// <a-select-option v-for="row in list" :key="row._id" :value="row._id">{{ row.name }}</a-select-option>

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
      this.$store.dispatch('category/fetchCategory', this.id).then((res) => {
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
    ...mapState('category', { loading: 'loading' })
  },

  async created() {
    // console.log('list', this.list)
    // let pFilter = {}
    // if (this.search) {
    //   pFilter.search = {
    //     $text: { $search: this.search }
    //   }
    // }
    // this.list = await this.$store.dispatch('category/fetchCategoryList', {
    //   page: 1,
    //   limit: 9999,
    //   sorts: [],
    //   filters: pFilter
    // })
  },

  methods: {
    async handleSelect(s: any) {
      let category = null
      // console.log('selected', s, this.list)
      for (let c = 0; c < this.list.length; c++) {
        if (this.list[c]._id === s) {
          category = this.list[c]
          break
        }
      }
      console.log('selected', s, category)
      this.selected = category
      this.$emit('change', s, category)
      this.$emit('update:value', s)
    },
    async handleSearch(s: string) {
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

      let pFilter: any = {}
      pFilter.search = this.search

      try {
        this.list = await this.$store.dispatch('category/fetchCategoryList', {
          page: 1,
          limit: 9999,
          sorts: [],
          filters: pFilter
        })
        console.log('search category', this.list)
      } catch (e) {
        this.$store.dispatch('category/loading', false)
        this.$store.dispatch('alert/error', e.message)
      }
    }
  } // methods
}
</script>

<style>
</style>
