<template>
  <div></div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
const fixDuration = 2

export default {
  components: {},

  data() {
    return {
      fixed: this.updated_at
        ? this.updated_at.add(fixDuration, 's') > new Date()
        : false
    }
  },
  computed: {
    ...mapState('alert', [
      'alert_type',
      'message',
      'updated_at',
      'link',
      'linkLabel'
    ]),
    alertClass() {
      let cName = [
        'relative',
        'flashm',
        'text-white',
        'p-2',
        'alert',
        this.alert_type
      ]
      // console.log('aaa', this.alert_type, this.message)
      switch (this.alert_type) {
        case 'alert-success':
          cName.push('bg-green')
          break
        case 'alert-danger':
          cName.push('bg-red-dark')
          break
        default:
          cName.push('bg-blue')
      }
      return cName
    }
  },

  methods: {
    ...mapActions({
      clearAlert: 'alert/clear'
    }),

    updateTimer() {
      let now = new Date()
      // todo
      // if(this.updated_at >) {

      // }
    }
  }
}
</script>

<style scoped>
.flashm {
  z-index: 10;
}

.fix {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
