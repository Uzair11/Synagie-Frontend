<template>
  <a-layout-footer>
    <address>Copyrights © Mama Net Sdn Bhd. All Rights Reserved.</address>
    <ul>
      <li>
        <a href="#">Terms of Use</a>
      </li>|
      <li>
        <a href="#">Privacy Policy</a>
      </li>|
      <li>
        <a href="#">Contact Us</a>
      </li>
    </ul>
  </a-layout-footer>
</template>

<script>
import { StandardError } from '../../errors/base'
import { mapState, mapActions } from 'vuex'

import { Layout as ALayout } from 'ant-design-vue'

const ALayoutFooter = ALayout.Footer

export default {
  components: {
    ALayoutFooter
  }
}
</script>
<style lang="scss">
</style>