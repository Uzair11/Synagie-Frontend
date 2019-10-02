export default async ({ app }) => {
  if (process.server && process.env.API_BASE_URL) {
    // console.log('server!', process.env.API_BASE_URL)
    await app.store.dispatch('env/setApiBaseURL', {
      apiURL: process.env.API_BASE_URL,
      baseURL: process.env.BASE_URL
    })

    if (
      process.env.SOCKET_HOST ||
      process.env.SOCKET_PORT ||
      process.env.SOCKET_SECURE
    ) {
      await app.store.dispatch('env/setSocketOption', {
        host: process.env.SOCKET_HOST,
        secure: process.env.SOCKET_SECURE === 'true',
        port: process.env.SOCKET_PORT
      })
    }
  }
}
