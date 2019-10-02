<template>
  <div>
    <h1 class="title">{{ title }}</h1>

    <div
      class="fadeIn animated"
      style="visibility: visible; animation-duration: 2s; animation-delay: 0.2s; animation-name: fadeIn;"
    >
      <form style="frm">
        <fieldset>
          <legend>Resend verification email</legend>
          <Verify :email="email" />
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Verify from '../components/login/Verify'

export default {
  components: {
    Verify
  },
  layout() {
    return 'content'
  },
  metaInfo: {
    title: 'Membership'
  },

  data() {
    return {
      email: this.$route.query.email
    }
  },

  computed: {
    ...mapState('env', ['title'])
  }
}
</script>

<style lang='scss'>
#newsletter {
  margin-top: 40px;
  display: block;
  background: #fff;
  font: 14px Helvetica, Arial, sans-serif;
}

.indicates-required {
  padding: 3px;
}

.frm {
  margin-left: 450px;
}

@media (max-width: 1150px) {
  .frm {
    margin-left: 0;
  }
}
</style>
