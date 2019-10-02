export default function ({ app, error }) {
  // console.log('app.store.state', app.store.state.session.currentUser)
  if (!process.server && !app.store.state.session.currentUser) {
    console.log('session', app.store.state.session.currentUser)
    error({
      errorCode: 503,
      message: 'You are not allowed to see this.'
    })
  }
}
