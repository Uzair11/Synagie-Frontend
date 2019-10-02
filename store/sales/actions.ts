/* eslint-disable no-undef, member-delimiter-style */

import {
  pagination,
  parseFormForServer,
  cacheDuration,
  region
} from '~/shared/general'
import { loadImageWithCache } from '~/shared/image'
import { ObjectId } from 'bson'
import { defaultUser } from './state'
import { StandardError } from '~/errors/base'
import { differences } from '~/shared/diff'
//import moment from 'moment/src/moment'
import { encode as firebaseKeyEncode } from 'firebase-key-encode'
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
  force?: boolean,
  url: string,
  sortField: any,
  sortOrder: any
}

interface UpdateParam {
  name: string
  value: [string, number, object]
}

interface UploadParam {
  field: string
  name: string
  file: Record<string, any>
  userId: string
}

interface UploadResult {
  path: string
  url: string
}

interface UserParam {
  _id?: string
  first_name: string
  last_name: string
  displayName: string
  user_role: string
  photo: string
  photoURL: string
  mobile: string
  createdAt: Date
  updatedAt: Date
  email: string
  status: number
  race: string
  lang: string
  country: string
}



export default {

  async fetchList({ commit, dispatch, rootState, state }, p: ListParam) {

    if (!p.force && state.listUpdated) {
      const diff = state.listUpdated
      console.log('diff', diff, diff.asSeconds())
      if (diff.asSeconds() <= cacheDuration) {
        return
      }
    }

    commit('loading')

    const limit = p.limit ? p.limit : pagination.limit
    const page = p.page || 1
    const offset = (page - 1) * limit

    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let sortType = p.sortOrder == 'descend' ? 'desc' : 'asc'
    let sortField = p.sortField != undefined ? p.sortField : 'order_id'

    console.log(process.env.apiBaseUrl + p.url + '?page=' + page);
    let res = await this.$axios.get(process.env.apiBaseUrl + p.url + '?page='
      + page + '&size=' + p.limit + '&coloumn_sort=' + sortField + '&sort_type=' + sortType, config)

    // console.log('res', res)
    let list: any[] = []
    res.data.sales.forEach(element => {
      element.delivery = element.delivery_method ? element.delivery_method.deliveryCode : ''
      element.channel = element.channel ? element.channel.name : ''
      list.push(element);
    });

    console.log('result', list)
    commit('list', {
      list: list,
      page: 1,
      limit: 100,
      count: res.data.totalCount
    })
    // dispatch('loadChilds')
    return list
  },
  async fetchOrderDetails({ commit, dispatch, rootState, state }, url: any) {

    commit('loading')

    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let res = await this.$axios.get(process.env.apiBaseUrl + url, config)
    res = res.data
    let transformedData: any = {};
    transformedData = res;
    if (res.delivery_method)
      transformedData.deliveryMethod = res.delivery_method;
    else {
      if (res.default_delivery_method)
        transformedData.deliveryMethod = res.default_delivery_method.delivery_method;
      res.delivery_method = true
    }
   
    if (res.user)
      transformedData.user = res.user;
    else
      transformedData.user = false;

    transformedData.items = res.items;

    transformedData.items.forEach(element => {
      element.legacy_code = element.sku ? element.sku.legacy_code : ''
      element.product_name = element.sku ? element.sku.product_name : ''
      element.selling_price = element.sku ? element.sku.selling_price : ''
    });
    res = transformedData;
    res.channel = res.channel ? res.channel.name : ''
    console.log('result', res)
    commit('orderDetails', {
      orderDetails: res
    })
    // dispatch('loadChilds')
    return res
  },
  async markOrderAsComplete({ commit, dispatch, rootState, state }, url: any) {

    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let res = await this.$axios.post(process.env.apiBaseUrl + url, config)
    commit('markCompleteStatus', {
      markCompleteStatus: res
    })
    // dispatch('loadChilds')
    return res
  },
  loading({ commit }, status?: boolean) {
    commit('loading', status)
  }
}
