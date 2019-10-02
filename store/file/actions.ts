/* eslint-disable no-undef, member-delimiter-style, camelcase */

import {
  pagination,
  parseFormForServer,
  cacheDuration,
  region
} from '~/shared/general'
import { loadImageWithCache } from '~/shared/image'
import { mimeTypes } from '~/shared/mime'
import { ObjectId } from 'bson'
import { defaultFile } from './state'
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
  userId?: string
  fileId: string
  updateName: boolean
}

interface UploadResult {
  path: string
  url: string
  file: any
}

interface FileParam {
  _id?: string
  createdBy: string
  fileType: string
  name: string
  path: string
  filename: string
  weight: number
  mimeType: string
  storageType: string
  target: string
  purpose: string
}

function checkForm(u: FileParam): boolean {
  let required = ['fileType', 'name']
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
  // async approveFile({ dispatch }, id) {
  //   console.log('approving File', id)
  //   let res = await stitchClient.callFunction('approveFile', [new ObjectId(id)])
  //   return res
  // },
  async uploadFile(
    { commit, rootState },
    p: UploadParam
  ): Promise<UploadResult> {
    commit('loading')

    let inputFile: any = p.file
    let storage = firebase.storage()
    let ref = storage.ref()
    let fileId = p.fileId
    let userId = p.userId || rootState.session.currentUser.uid
    let uploadPath =
      'file/' + fileId + '/' + userId + '/' + firebaseKeyEncode(p.name)
    console.log('uploadpath', uploadPath)
    let uploadRef = ref.child(uploadPath)
    let snap = await uploadRef.put(inputFile).catch((e) => {
      console.error('unable to upload', e)
      throw e
    })
    // console.log('Uploaded a blob or file!', snap)
    let fileRef = firebase.firestore().doc('file/' + fileId)
    let file = (await fileRef.get()).data() || {}
    // console.log('old file', fileId, file)

    if (file[p.field]) {
      // console.log('deleting old file', file[p.field], file)
      let oldPath = file[p.field]
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
    }

    let update: Record<string, any> = {}
    update[p.field] = uploadPath
    update[p.field + 'URL'] = null
    file[p.field] = uploadPath
    file[p.field + 'URL'] = null
    file._id = fileId

    if (p.updateName) {
      file.name = p.file.name
      file.filename = file.name
    }

    await fileRef.update(update)
    await loadImageWithCache(file, fileId, 'file/' + fileId, p.field)
    // console.log('uploadpath', res.photo, uploadRef)
    // offer[p.field + 'URL'] = await uploadRef.getDownloadURL()
    commit('loading', false)
    commit('record', file)
    return { path: uploadPath, url: file[p.field + 'URL'], file: file }
  },

  async deleteFile({ commit, dispatch, rootState, state }, id) {
    commit('loading')
    let ref = firebase.firestore().doc('file/' + id)
    let file = await ref.get()
    if (!file.exists) {
      throw new Error('File missing')
    }

    await ref.delete()
    commit('loading', false)
  },
  async saveFile({ commit, dispatch, rootState, state }, u: FileParam) {
    console.log('ssss', u.mimeType, u)
    if (u.mimeType && !u.fileType) {
      if (u.mimeType.startsWith('image/')) {
        u.fileType = 'image'
      } else if (u.mimeType.startsWith('audio/')) {
        u.fileType = 'audio'
      } else if (mimeTypes[u.mimeType]) {
        u.fileType = mimeTypes[u.mimeType]
      } else {
        u.fileType = 'doc' //anything else
      }
    }
    checkForm(u)
    commit('loading')
    const isNew = !u._id
    let collection = firebase.firestore().collection('file')
    let ref = isNew ? collection.doc() : collection.doc(u._id)
    // console.log('ssss', u, ref.id)
    let oriFile: any = {}

    if (!isNew) {
      let file = await ref.get()
      if (!file.exists) {
        console.error('file by id missing', u)
        throw new Error('File missing')
      }

      oriFile = file.data() || {}
    }

    let updated: any = {}
    let now = new Date()
    if (isNew) {
      updated = Object.assign(
        { createdAt: now, updatedAt: now },
        u
      )
    } else {
      // only send changes
      // console.log('udpate', u, oriFile)
      updated = differences(u, oriFile)
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
      console.log('setting', updated)
      if (!updated.createdBy && !oriFile.createdBy) {
        updated.createdBy = rootState.session.currentUser.uid
      }
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
      const file = Object.assign({}, state.list[p])

      await loadImageWithCache(file, file.uid, 'file/' + file.uid, 'photo')
      res.push(file)
    }
    commit('listOnly', res)
  },

  async fetchFileList({ commit, dispatch, rootState, state }, p: ListParam) {
    console.log('fetching file', p)
    if (!p.force && state.listUpdated) {
      const diff =(state.listUpdated)
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
      .functions(region)
      .httpsCallable('fetchFileList')
    let res = await callFunction({
      limit: p.limit,
      page: p.page,
      filters: p.filters,
      sorts: p.sorts
    })

    // console.log('res', res)
    let list: any[] = []
    for (let c = 0; c < res.data.list.length; c++) {
      let child = res.data.list[c]
      let row = Object.assign({ _id: child._id }, child._source)
      row = await dispatch('loadFile', row)
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
    // dispatch('loadChilds')
    return list
  },

  async fetchFile({ commit, dispatch, rootState, state }, id: string) {
    if (id === 'new') {
      commit('record', defaultFile)
      return defaultFile
    }
    commit('loading')

    let snap = await firebase
      .firestore()
      .doc('file/' + id)
      .get()

    let res = (await snap.data()) || {}
    res._id = id

    // await loadImageWithCache(res, id, 'file/' + id, 'photo')
    console.log('row', res)
    res = await dispatch('loadFile', res)

    await commit('record', res)
    return res
  },

  async loadFile({ commit, rootState }, res) {
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
          res[field] = (res[field]) // mongodb
        }
      }
    }
    // if (res.thumbnail) {
    //   res.thumbnailURL =
    //     serverURL +
    //     '/file/' +
    //     id +
    //     '/thumbnail?r=' +
    //     Math.floor(Math.random() * 1000000 + 1)
    // }

    return res
  },

  setFileField({ commit, dispatch, state }, p: UpdateParam) {
    commit('updateField', p)
  },

  loading({ commit }, status?: boolean) {
    commit('loading', status)
  }
}
