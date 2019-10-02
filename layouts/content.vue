<template>
  <div>
    <Menu />
    <FlashMessage />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import FlashMessage from '~/components/base/FlashMessage'
import Footer from '~/components/base/Footer'
import Sidebar from '~/components/base/Sidebar'

export default {
  components: {
    FlashMessage,
    Sidebar,
    Footer
  },

  mounted() {
    // this.$store.dispatch('task/fetchTasks', { userID: 'me' })
    // this.$store.dispatch('users/get_users')
  }
}
</script>

<style>
.member-spacer {
  padding-top: 52px;
}
</style>
