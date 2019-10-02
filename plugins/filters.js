import Vue from 'vue'
import { formats } from '~/shared/general'
// import { upperFirst } from 'lodash'
const moment = require('moment')
require('moment/locale/es')

Vue.use(require('vue-moment'))

// filter for transforming date value
Vue.filter('dateFormat', function (illegibleDate, param) {
  if (!illegibleDate) {
    return
  }
  if (param === 'date') {
    return Vue.moment(illegibleDate).format(formats.date)
    //   return illegibleDate
  }

  return illegibleDate
})
