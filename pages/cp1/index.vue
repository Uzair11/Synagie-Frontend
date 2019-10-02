<template>
  <div class="contentBody">
    <!--end content img-->
  </div>
</template>

<script>
'use strict'

import { pagination as gPage } from '../../shared/general'
import { mapState, mapActions } from 'vuex'
import { Table as ATable, Input as AInput } from 'ant-design-vue'
export default {
  components: {},

  metaInfo() {
    console.log('metainfo', this.title)
    return {
      title: this.title
    }
  },

  layout() {
    return 'member'
  },
  middleware: ['isAuth'],
  created() {
    this.$store.dispatch('env/setTitle', 'Dashboard')
  }
}
</script>

<style>
</style>
