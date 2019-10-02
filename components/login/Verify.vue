<template>
  <form @submit.prevent="submitVerifyEmail">
    <input v-model="verifyEmail" placeholder="enter email here" class="textbox1 textbox1_50 title_box_short">
    <button type="submit" :disabled="verifyLoading" class="main_btn" @click="submitVerifyEmail">
      Submit
    </button>

    <div style="height: 35px" />
  </form>
</template>

<script lang='ts'>
import { mapState } from 'vuex'

export default {
  components: {},
  props: {
    email: {
      default: '',
      type: String
    }
  },

  data() {
    return {
      verifyEmail: this.email
    }
  },

  computed: {
    ...mapState('user', ['verifyLoading'])
  },
  methods: {
    async submitVerifyEmail() {
      if (!this.verifyEmail) {
        alert('please enter email')
        return
      }

      try {
        this.$store.dispatch('user/sendVerifyEmail', this.verifyEmail)
        this.verifyEmail = ''
        this.$store.dispatch(
          'alert/success',
          'Verification email has been sent!'
        )
      } catch (e) {
        this.$store.dispatch('alert/error', e.message)
      }
    }
  }
}
</script>

<style scoped>
form {
  display: block;
}
</style>
