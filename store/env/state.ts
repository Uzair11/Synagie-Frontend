'use strict'

export default () => ({
  title: '',
  format: {
    // date: "LLLLL",
    // datetime: "LLLLL ss"
    date: 'D-MMM-Y',
    datetime: 'D-MMM-Y LT',
    inputDate: 'D-M-YYYY',
    inputDateTime: 'D-M-YYYY HH:mm:ssZ'
  },

  apiURL: '',
  baseURL: '',

  socketClient: null,
  socketChannel: null,
  locale: 'en',

  countries: require('~/static/country.json'),
  fetchingCountries: false,
  sidebarCollapsed: false
})
