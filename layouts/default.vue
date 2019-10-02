<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <!-- <div v-if="currentUser && currentUser.uid">  <Sidebar /></div>
    -->

    <div v-if="showPage">
      <Sidebar />
    </div>

    <a-layout>
      <a-layout-header style="background-color:#383737" />

      <a-layout-content class="contentBody" style="background-color:#383737">
        <FlashMessage />
        <nuxt />
      </a-layout-content>
      <no-ssr>
        <div>
          <Footer style="background-color:#383737" />
        </div>
      </no-ssr>
    </a-layout>
  </a-layout>
</template>

<script>
import FlashMessage from '~/components/base/FlashMessage'
import Footer from '~/components/base/Footer'
import Sidebar from '~/components/base/Sidebar'
import { StandardError } from '~/errors/base'
import { mapState, mapActions } from 'vuex'

import { Layout as ALayout, Icon as AIcon } from 'ant-design-vue'

const ALayoutContent = ALayout.Content
const ALayoutHeader = ALayout.Header

export default {
  components: {
    ALayoutContent,
    ALayout,
    ALayoutHeader,
    AIcon,
    FlashMessage,
    Sidebar,
    Footer
  },
  data() {
    return {
      showPage: false
    }
  },
  computed: {
    ...mapState('env', ['sidebarCollapsed']),
    ...mapState('session', ['currentUser'])
  },
  mounted() {
    if (this.currentUser) {
      this.showPage = true
    }
  },
  methods: {
    ...mapActions('env', ['toogleMenu'])
  }
}
</script>

<style>
</style>
