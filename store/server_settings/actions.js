import gql from 'graphql-tag'
//import moment from 'moment/src/moment'
import { readFieldNames } from './vars.js'
import { graphClient } from '~/api/helpers/net'

const parseSettingJson = (data) => {
  let res = data

  for (let field in data) {
    // console.log("field", field)
    switch (field) {
      case 'created_at':
      case 'updated_at':
        if (!data[field]) {
          res[field] = null
        } else {
          res[field] = data[field]
          // console.log("date", field, res[field])
        }
        break
      default:
        res[field] = data[field]
    }
  }
  // console.log("result", res)

  return res
}

const actions = {
  async fetchSettings({ commit }) {
    if (this.app.store.state.server_settings.loading) {
      return false
    }
    commit('loading')

    const client = graphClient(this.app.apolloProvider.clients.defaultClient)
    let query = `
          query serverSettings {
            serverSettings {
              ${readFieldNames.join('\n')}

            }
          }
        `
    // console.log('fetching serverSettings', query)
    try {
      const res = await client.query({
        query: gql(query)
      })

      let settings = parseSettingJson(res.data.serverSettings)
      commit('load', settings)
      return settings
    } catch (e) {
      console.error('setting failed', e)
      commit('fail', e.message)
      this.dispatch('alert/error', e.message)
    }
  }
}

export default actions
