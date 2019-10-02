export default function({ app, error }) {
  if (app.store.state.alert.message) {
    app.store.dispatch('alert/clear')
  }
}
