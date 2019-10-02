<template>
  <div>
    <Login />
  </div>
</template>

<script>
import Login from '../components/login/login'
import { mapState } from 'vuex'

export default {
  components: {
    Login
  },

  metaInfo: {
    title: 'Membership',
    script: [
      { src: '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js' },
      { src: '/js/mailchimp.js' }
    ]
  },
  computed: {
    ...mapState('env', ['title'])
  },
  created() {
    this.$store.dispatch('env/setTitle', 'Membership')
  },

  methods: {
    test1() {
      this.$store.dispatch('users/testUsers')
    }
  }
}
</script>

<style lang='scss' scoped>
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
