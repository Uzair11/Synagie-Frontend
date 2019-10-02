import Vue from 'vue'
import t from 'typy'
// import { upperFirst } from 'lodash'

// filter for transforming date value
Vue.filter('t', function (target, param) {
  // console.log('t', target, param)
  return t(target, param).safeObject
})
