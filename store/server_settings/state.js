const state = () => ({
  readFields: [
    'app_name: String!',
    'asset_url: String!',
    'default_locale: String!',
    'debug_mode: Boolean!',
    'default_input_date_format: String!',
    'lan_path: String!'
  ],

  settings: {},
  loading: false,
  loaded: false
})

export default state
