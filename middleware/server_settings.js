export default async ({ app, error }) => {
  // console.log('loaded?', app.store.state.server_settings)
  if (!app.store.state.server_settings.loaded) {
    // let res = await app.store.dispatch('server_settings/fetchSettings')
    // console.log('settings fectehd', res)
  }
}
