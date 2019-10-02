const scrollBehavior = require('./scrollBehavior')
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: 'universal',

  head: {
    title: 'Synagie 2',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'New synagie' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css' },
    { rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,700&display=swap' }],
    script: [{ src: 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js', type: 'text/javascript' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', type: 'text/javascript' },
    { src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js', type: 'text/javascript' }]
  },

  loading: { color: '#fff' },
  dev: false,
  /*
  ** Global CSS
  */
  css: ['assets/screen.scss'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // '@/plugins/antd-ui',
    { src: '@/plugins/persistedstate', ssr: false },
    { src: '@/plugins/firebase.ts', ssr: false },
    '@/plugins/filters',
    '@/plugins/i18n',
    '@/plugins/out',
    '@/plugins/fragment'
    // ssr: false
  ],

  modules: [
    // Doc: https://axios.nuxtjs.org/usage

    '@nuxtjs/axios'
  ],
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  router: {
    middleware: [
      // 'server_settings'
      'flash',
      'nested'
    ],
    scrollBehavior // auto scroll to last position
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
   
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        }),
          (config.devtool = '#source-map')
      }
    },
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        // Disable a plugin by passing false as value
        'postcss-url': true,
        'postcss-nested': {},
        'postcss-responsive-type': {},
        'postcss-hexrgba': {}
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {
          grid: true
        }
      }
    }
  },
  env: {
    apiBaseUrl: process.env.NODE_ENV === 'development'
      ? 'http://localhost:4001'
      : 'https://api.app2.synagie.com'
  },
  server: {
    port: 3060 // default: 3000
    // host: '0.0.0.0', // default: localhost
  }
}
