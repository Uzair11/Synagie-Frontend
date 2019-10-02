/* eslint-disable no-undef, member-delimiter-style, camelcase */

import {
  pagination,
  parseFormForServer,
  cacheDuration,
  region
} from '~/shared/general'
import { loadImageWithCache } from '~/shared/image'
import { ObjectId } from 'bson'
import { defaultCategory } from './state'
import { StandardError } from '~/errors/base'
import { differences } from '~/shared/diff'
//import moment from 'moment/src/moment'
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
  categoryId: string
}

interface UploadResult {
  path: string
  url: string
}

interface CategoryParam {
  _id?: string
  categoryType: string
  name: string
  // parentId: string
  status: number
}

function checkForm(u: CategoryParam): boolean {
  let required = ['categoryType', 'name', 'status']
  if (!u._id) {
    // required += ['memType']
  }
  for (let i in required) {
    const field = required[i]
    // console.log(field)
    if (u[field] === undefined) {
      throw Error(field + ' is required')
    }
  }

  return true
}

export default {
  // async approveCategory({ dispatch }, id) {
  //   console.log('approving Category', id)
  //   let res = await stitchClient.callFunction('approveCategory', [new ObjectId(id)])
  //   return res
  // },
  async uploadFile(
    { commit, rootState },
    p: UploadParam
  ): Promise<UploadResult> {
    commit('loading')

    let file = (p.file) as any;
    let userId = rootState.session.currentUser.uid
    let storage = firebase.storage()
    let ref = storage.ref()
    let categoryId = p.categoryId

    let uploadPath = 'category/' + categoryId + '/' + firebaseKeyEncode(p.name)
    console.log('uploadpath', uploadPath)
    let uploadRef = ref.child(uploadPath)
    let snap = await uploadRef.put(file).catch((e) => {
      console.error('unable to upload', e)
      throw e
    })
    console.log('Uploaded a blob or file!', snap)
    let categoryRef = firebase.firestore().doc('category/' + categoryId)
    let category = (await categoryRef.get()).data() || {}

    if (category[p.field]) {
      let oldPath = category[p.field]
      let oldUploadRef = ref.child(oldPath)
      console.log('old', oldUploadRef, oldPath)
      try {
        if (oldPath !== uploadPath) {
          await oldUploadRef.getDownloadURL()
          await oldUploadRef.delete()
        } else {
          console.log('same name, skipping delete')
        }
      } catch (e) {
        console.error('unable to delete file', oldPath, e)
      }
    }

    let update: Record<string, any> = {}
    update[p.field] = uploadPath

    await loadImageWithCache(
      category,
      category.uid,
      'category/' + category.uid,
      p.field
    )
    // console.log('uploadpath', res.photo, uploadRef)
    // offer[p.field + 'URL'] = await uploadRef.getDownloadURL()
    update[p.field + 'URL'] = category[p.field + 'URL']
    commit('loading', false)
    return { path: uploadPath, url: update[p.field + 'URL'] }
  },

  async deleteCategory({ commit, dispatch, rootState, state }, id) {
    commit('loading')
    let ref = firebase.firestore().doc('category/' + id)
    let category = await ref.get()
    if (!category.exists) {
      throw new Error('Category missing')
    }

    await ref.delete()
    commit('loading', false)
  },
  async saveCategory({ commit, dispatch, rootState, state }, u: CategoryParam) {
    checkForm(u)
    commit('loading')
    console.log('saving', u)
    const isNew = !u._id
    let collection = firebase.firestore().collection('category')
    let ref = isNew ? collection.doc() : collection.doc(u._id)

    let oriCategory: any = {}

    if (!isNew) {
      let category = await ref.get()
      if (!category.exists) {
        console.error('category by id missing', u)
        throw new Error('Category missing')
      }

      oriCategory = category.data() || {}
    }

    let updated: any = {}
    let now = new Date();
    if (isNew) {
      updated = Object.assign(
        { createdAt: new Date(), updatedAt: now },
        u
      )
    } else {
      // only send changes
      // console.log('udpate', u, oriCategory)
      updated = differences(u, oriCategory)
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
        key !== '_id' &&
        key !== 'parents'
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
    let res: any[] = []
    for (let p in state.list) {
      const category = Object.assign({}, state.list[p])

      await loadImageWithCache(
        category,
        category.uid,
        'category/' + category.uid,
        'photo'
      )
      res.push(category)
    }
    commit('listOnly', res)
  },

  async fetchCategoryList(
    { commit, dispatch, rootState, state },
    p: ListParam
  ) {
    // console.log('ffff category', p)
    // if (!p.force && state.listUpdated) {
    //   const diff = moment.duration(moment().diff(state.listUpdated))
    //   console.log('diff', diff, diff.asSeconds())
    //   if (diff.asSeconds() <= cacheDuration) {
    //     return
    //   }
    // }

    commit('loading')

    const limit = p.limit ? p.limit : pagination.limit
    const page = p.page || 1
    const offset = (page - 1) * limit

    // // console.log('cursor', await cursor.toArray())
    // const list = await cursor.toArray()
    let callFunction = firebase
      .app()
      .functions(region)
      .httpsCallable('fetchCategoryList')
    let res = await callFunction({
      limit: p.limit,
      page: p.page,
      filters: p.filters,
      sorts: p.sorts
    })

    // console.log('fetchCategoryList', res)
    let list: any[] = []
    for (let c = 0; c < res.data.list.length; c++) {
      let child = res.data.list[c]
      let row = Object.assign({ _id: child._id }, child._source)
      row = await dispatch('loadCategory', row)
      // console.log('list row', row)
      list.push(row)
    }

    await commit('list', {
      list: list,
      page: res.data.page,
      limit: res.data.limit,
      count: res.data.count
    })
    // console.log('returning', list)
    // dispatch('loadChilds')
    return list
  },

  async fetchCategory({ commit, dispatch, rootState, state }, id: string) {
    if (id === 'new') {
      commit('record', defaultCategory)
      return defaultCategory
    }
    commit('loading')

    let snap = await firebase
      .firestore()
      .doc('category/' + id)
      .get()

    let res = (await snap.data()) || {}
    res._id = id

    // await loadImageWithCache(res, id, 'category/' + id, 'photo')
    console.log('row', res)
    res = await dispatch('loadCategory', res)

    await commit('record', res)
    return res
  },

  async loadCategory({ commit, rootState, dispatch }, res) {
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
          res[field] = (res[field].toDate()) // firebase - fetch single
        } else if (res[field]) {
         // res[field] = moment(res[field]) // mongodb
        }
      }
    }
    //loadparents
    if (res.parentId) {
      let parents = await dispatch('loadParents', res.parentId)
      console.log('loaded parents', res.parentId, parents)
      res.parents = parents
    } else {
      res.parents = []
    }
    // if (res.thumbnail) {
    //   res.thumbnailURL =
    //     serverURL +
    //     '/category/' +
    //     id +
    //     '/thumbnail?r=' +
    //     Math.floor(Math.random() * 1000000 + 1)
    // }

    return res
  },

  async loadParents({}, id: string): Promise<any[]> {
    let res: any[] = []
    let snap = await firebase
      .firestore()
      .doc('category/' + id)
      .get()

    if (!snap.exists) {
      console.log('parent not exists', id)
      return res
    }

    let data: any = (await snap.data()) || {}
    data._id = id
    res.push(data)
    if (data.parentId) {
      let subParents = await this.loadParents(data.parentId)
      for (let c = subParents.length - 1; c > -1; c--) {
        res.unshift(subParents[c])
      }
    }

    return res
  },

  setCategoryField({ commit, dispatch, state }, p: UpdateParam) {
    commit('updateField', p)
  },

  loading({ commit }, status?: boolean) {
    commit('loading', status)
  }
}
