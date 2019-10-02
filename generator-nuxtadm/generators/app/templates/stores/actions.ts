/* eslint-disable no-undef, member-delimiter-style, camelcase */

import {
  pagination,
  parseFormForServer,
  cacheDuration,
  region
} from '../../../../../shared/general'
import { loadImageWithCache } from '../../../../../shared/image'
import { ObjectId } from 'bson'
import { default<%=singularClassName %> } from './state'
import { StandardError } from '../../../../../errors/base'
import { differences } from'../../../../../shared/diff'
import moment from 'moment'
import { encode as firebaseKeyEncode } from 'firebase-key-encode'
import { pickBy } from 'lodash'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

interface SortParam {
  field: string
  dir: string
}

interface ListParam {
  page?: number
  limit?: number
  sorts?: SortParam[]
  filters: Record<string, any>
  startAfter?: any
  force?: boolean
}

interface UpdateParam {
  name: string
  value: [string, number, object]
}

interface UploadParam {
  field: string
  name: string
  file: Record<string, any>
 // <%= singularTable %>Id: string
  updateName?: boolean
}

interface UploadResult {
  path: string
  url: string
}

interface <%=singularClassName %>Param {
  _id?: string<% for(var i in fields) {%>
  <%=fields[i].name %>: <%= fields[i].jsType %><% } %>
}

function checkForm(u: <%=singularClassName %>Param): boolean {
  let required = [<% for (var i in fields) { 
    const field = fields[i] %>'<%=field.name %>',<% } %>]
  if (!u._id) {
    // required += ['memType']
  }
  for (var i in required) {
    const field = required[i]
    // console.log(field)
    if (u[field] === undefined) {
      throw Error(field + ' is required')
    }
  }

  return true
}


export default {
  async uploadFile({ commit, rootState }, p: UploadParam): Promise<UploadResult> {
    commit('loading')

    let inputFile = p.file
    let userId = rootState.session.currentUser.uid
    let storage = firebase.storage()
    let ref = storage.ref()
    let <%=singularTable %>Id = p.<%=singularTable %>Id

    let uploadPath = '<%= table %>/' + <%=singularTable %>Id + '/' + firebaseKeyEncode(p.name)
    console.log('uploadpath', uploadPath)
    let uploadRef = ref.child(uploadPath)
    let snap = await uploadRef.put(inputFile).catch(e => {
      console.error('unable to upload', e)
      throw e
    })
    console.log('Uploaded a blob or file!', snap)
    let <%=singularTable %>Ref = firebase.firestore().doc('<%= table %>/' + <%=singularTable %>Id)
    let <%=singularTable %> = (await <%=singularTable %>Ref.get()).data() || {}

    if (<%=singularTable %>[p.field]) {
      let oldPath = <%=singularTable %>[p.field]
      let oldUploadRef = ref.child(oldPath)
      console.log('old', oldUploadRef, oldPath)
      try {
        if (oldPath !== uploadPath) {
          await oldUploadRef.delete()
        } else {
          console.log('same name, skipping delete')
        }
      } catch (e) {
        console.error('unable to delete file', oldPath, e)
      }
    }// xczxc

    let update: Record<string, any> = {}
    update[p.field] = uploadPath
    update[p.field + 'URL'] = null
    <%= singularTable %>[p.field] = uploadPath
    <%= singularTable %>[p.field + 'URL'] = null
    <%= singularTable %>._id = <%= singularTable %>Id

    await <%= singularTable %>Ref.update(update)
    await loadImageWithCache(<%=singularTable %>, <%=singularTable %>Id, '<%= table %>/' + <%=singularTable %>Id, p.field)
    // console.log('uploadpath', res.photo, uploadRef)
    // offer[p.field + 'URL'] = await uploadRef.getDownloadURL()
    commit('loading', false)
    return { path: uploadPath, url: <%= singularTable %>[p.field + 'URL'] }
  },

  async delete<%= singularClassName %>({ commit, dispatch, rootState, state }, id) {
    commit('loading')
    let ref = firebase.firestore().doc('<%= table %>/' + id)
    let <%=singularTable%> = await ref.get()
    if (!<%=singularTable%>.exists) {
      throw new Error('<%=singularClassName%> missing')
    }

    await ref.delete()
    commit('loading', false)
  },
  async save<%= singularClassName %>({ commit, dispatch, rootState, state }, u: <%= singularClassName %>Param) {
    checkForm(u)
    commit('loading')
    console.log('saving', u)
    const isNew = !u._id
    let collection = firebase.firestore().collection('<%= table %>')
    let ref = isNew ? collection.doc() : collection.doc(u._id)

    let ori<%= singularClassName %> : any = {}

    if (!isNew) {
      let <%=singularTable %> = await ref.get()
      if (!<%=singularTable %>.exists) {
        console.error('<%=singularTable %> by id missing', u)
        throw new Error('<%=singularClassName %> missing')
      }

      ori<%= singularClassName %> = <%=singularTable %>.data() || {}
    }
    
    let updated : any = {}
    let now = moment().toDate()
    if (isNew) {
      updated = Object.assign({ createdAt: moment().toDate(), updatedAt: now }, u)
    } else {
      // only send changes
      // console.log('udpate', u, ori<%= singularClassName %>)
      updated = differences(u, ori<%= singularClassName %>)
    }
    // console.log('ori updated', Object.assign({}, updated))
    updated = pickBy(
      updated,
      (value, key) =>
        u.hasOwnProperty(key) &&
        key !== 'created_at' &&
        key !== 'updated_at' &&
        key !== 'createdAt' &&
        key !== 'updatedAt' &&
        key !== '_id'
    )

    if (Object.keys(updated).length > 0) {
      updated = parseFormForServer(updated)
      // console.log('changed field', updated)
      if (!isNew) {
        updated.updatedAt = now
        console.log('update', updated)
        let res = await ref.update(updated)
        // console.log('res', res)
      } else {
        let res = await ref.set(updated)
        console.log('res', res)
        u._id = ref.id
      }
    }

    commit('loading', false)
    return u
  },
  
  async loadChilds({ commit, state }) {
    let res : any[] = []
    for (let p in state.list) {
      const <%= singularTable %> = Object.assign({}, state.list[p])

      await loadImageWithCache(<%= singularTable %>, <%= singularTable %>.uid, '<%= table %>/' + <%= singularTable %>.uid, 'photo')
      res.push(<%= singularTable %>)
    }
    commit('listOnly', res)
  },

  async fetch<%=pluralClassName %>List({ commit, dispatch, rootState, state }, p: ListParam) {
    console.log('fetching <%= table %>', p)
    if (!p.force && state.listUpdated) {
      const diff = moment.duration(moment().diff(state.listUpdated))
      console.log('diff', diff, diff.asSeconds())
      if (diff.asSeconds() <= cacheDuration) {
        return
      }
    }
    
    commit('loading')

    const limit = p.limit ? p.limit : pagination.limit
    const page = p.page || 1
    const offset = (page - 1) * limit

    // // console.log('cursor', await cursor.toArray())
    // const list = await cursor.toArray()
    let callFunction = firebase
      .app()
      .functions(region).httpsCallable('fetch<%= pluralClassName %>List')
    let res = await callFunction({
      limit: p.limit,
      page: p.page,
      filters: p.filters,
      sorts: p.sorts
    })

    // console.log('res', res)
    let list : any[] = []
    for (let c = 0; c < res.data.list.length; c++) {
      let child = res.data.list[c]
      let row = Object.assign({ _id: child._id }, child._source)
      row = await dispatch('load<%= singularClassName %>', row)
      // console.log('list row', row)
      list.push(row)
    }

    console.log('result', list)
    await commit('list', {
      list: list,
      page: res.data.page,
      limit: res.data.limit,
      count: res.data.count
    })
    //dispatch('loadChilds')
    return list
  },

  async fetch<%= singularClassName %>({ commit, dispatch, rootState, state }, id: string) {
    if(id === 'new') {
      commit('record', default<%=singularClassName %>)
      return default<%=singularClassName %>
    }
    commit('loading')

    let snap = await firebase
      .firestore()
      .doc('<%= table %>/' + id)
      .get()

    let res = await snap.data() || {}
    res._id = id

    // await loadImageWithCache(res, id, '<%= table %>/' + id, 'photo')
    console.log('row', res)
    res = await dispatch('load<%= singularClassName %>', res)

    await commit('record', res)
    return res
  },

  async load<%= singularClassName %>({ commit, rootState }, res) {
    // console.log('loadOrder', res)
    // res._id = new ObjectId(res._id)
    let currentUser = rootState.session.currentUser
    if (res.user_id === currentUser.uid) {
      res.user = currentUser
      res.userName = currentUser.firstName + ' ' + currentUser.lastName
    }

    for (let field in res) {
      if (field.endsWith('_at') || field.endsWith('At')) {
        if (res[field] && res[field].toDate) {
          // console.log('loading offer', field, res[field])
          res[field] = moment(res[field].toDate()) // firebase - fetch single
        } else if (res[field]) {
          res[field] = moment(res[field]) // mongodb
        }
      }
    }
    // if (res.thumbnail) {
    //   res.thumbnailURL =
    //     serverURL +
    //     '/<%= table %>/' +
    //     id +
    //     '/thumbnail?r=' +
    //     Math.floor(Math.random() * 1000000 + 1)
    // }

    return res
  },

  set<%= singularClassName %>Field({ commit, dispatch, state }, p: UpdateParam) {
    commit('updateField', p)
  },

  loading({ commit }, status?: boolean) {
    commit('loading', status)
  }
}
