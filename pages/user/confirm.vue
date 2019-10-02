<template>
  <div>
    <h1 class="title">{{ title }}</h1>

    <div
      class
      style="visibility: visible; animation-duration: 2s; animation-delay: 0.2s; animation-name: fadeIn;"
    >
      <!--content img-->
      <div
        class="content_img"
        style="height: 800px; visibility: visible; animation-duration: 2s; animation-delay: 0.4s; animation-name: fadeIn; vertical-align: top;"
      >
        <div class="fader" />
        <div class="img_col dynamic_img" style>
          <img src="img/login/content_img.jpg" style="height: 578px; width: 410px;" />
        </div>
      </div>
      <!--end content img-->

      <form style="frm">
        <fieldset>
          <legend>Confirming email</legend>
          <div v-if="!confirmed">Please wait...</div>
          <div v-else>
            <nuxt-link to="/">
              <a>Click here to login</a>
            </nuxt-link>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {},

  layout() {
    return 'content'
  },
  metaInfo: {
    title: 'Membership'
  },
  data() {
    return {
      token: this.$route.query.token,
      tokenId: this.$route.query.tokenId,
      confirmed: false
    }
  },
  computed: {
    ...mapState('env', ['title'])
  },
  mounted() {
    this.doConfirm()
  },

  methods: {
    ...mapActions({
      confirmEmail: 'user/confirmEmail'
    }),
    async doConfirm() {
      try {
        const res = await this.confirmEmail({
          token: this.token,
          id: this.tokenId
        })
        this.$store.dispatch('alert/success', 'You email has been confirmed!')
        this.confirmed = true
      } catch (e) {
        this.$store.dispatch('alert/error', e.message)
      }
    }
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
