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

  async fetchSupplierList({ commit, dispatch, rootState, state }, p: ListParam) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let res = await this.$axios.get(process.env.apiBaseUrl + '/users', config)

    // console.log('res', res)
    let list: any[] = []
    for (let c = 0; c < res.data.length; c++) {
      let row = res.data[c]
      row.first_name = row.first_name ? row.first_name : ''
      row.last_name = row.last_name ? row.last_name : ''
      row.company = row.company ? ' (' + row.company + ')' : ''
      row.supplier = row.first_name + ' ' + row.last_name + row.company + ' ' + row.user_id + ' '
      list.push(row)
    }
    console.log(list);
    commit('supplierList', {
      supplierList: list
    })
    // dispatch('loadChilds')
    return list

  },
  async fetchChannelsList({ commit, dispatch, rootState, state }, p: ListParam) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let res = await this.$axios.get(process.env.apiBaseUrl + '/channels', config);
    let list: any = [];
    res.data.forEach(element => {
      if (element.is_gwp_enabled == 1) {
        // element.isActive=false;
        list.push(element);
      }
    });
    commit('channelsList', {
      channelsList: list
    })
    // dispatch('loadChilds')
    return res.data

  },
  async addSku({ commit, dispatch, rootState, state }, p: any) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    if (p.sku.split(','.length > 0)) {

      let ids: any = [];
      let listSku = p.sku.split(',');
      listSku.forEach(element => {
        ids.push(element);
      });
      let save = { ids: ids };
    }
    let res = await this.$axios.get(process.env.apiBaseUrl + '/sku/' + p.sku, config);
    if (res.data.error) {
      return res.data;
    }
    else {
      let data: any = [];
      data.push({ quantity: p.quantity, sku_id: p.sku, name: res.data.product_name });
      if (res.data.child_skus) {
        if (res.data.child_skus.length > 0) {
          res.data.child_skus.forEach(element => {
            data.push({ quantity: p.quantity, sku_id: element.sku_id, name: element.product_name });
          });

        }
      }

      commit('productAList', {
        productAList: data
      })
      // dispatch('loadChilds')
      return data
    }


  },
  async addBulkSku({ commit, dispatch, rootState, state }, p: any) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let save = {}
    if (p.sku.split([',', ' ', '\r']).length > 0) {

      let ids: string[] = [];
      let listSku = p.sku.split((/[\n, ]+/))
      listSku.forEach(element => {
        ids.push(element);
      });
      save = { ids: ids };
    }
    let data: any = [];
    let res = await this.$axios.post(process.env.apiBaseUrl + '/sku/bulk', save, config);
    if (res.data.error) {
      return res.data;
    }
    else {
      res.data.skus.forEach(element => {
        data.push({ quantity: p.quantity, sku_id: p.sku, name: element.product_name });
      });
      if (res.data.skus.child_skus) {
        if (res.data.skus.child_skus.length > 0) {
          res.data.skus.child_skus.forEach(element => {
            data.push({ quantity: p.quantity, sku_id: element.sku_id, name: element.product_name });
          });

        }
      }


      commit('productAList', {
        productAList: data
      })
      // dispatch('loadChilds')
      return data
    }


  },
  async addSkuSetB({ commit, dispatch, rootState, state }, p: any) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }

    let res = await this.$axios.get(process.env.apiBaseUrl + '/sku/' + p.sku, config);
    if (res.data.error) {
      return res.data;
    }
    else {
      let data: any = [];
      data.push({ quantity: p.quantity, sku_id: p.sku, name: res.data.product_name });
      if (res.data.child_skus) {
        if (res.data.child_skus.length > 0) {
          res.data.child_skus.forEach(element => {
            data.push({ quantity: p.quantity, sku_id: element.sku_id, name: element.product_name });
          });

        }
      }

      commit('productBList', {
        productAList: data
      })
      // dispatch('loadChilds')
      return data
    }


  },
  async addBulkSkuSetB({ commit, dispatch, rootState, state }, p: any) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }
    let save = {}
    if (p.sku.split([',', ' ', '\r']).length > 0) {

      let ids: string[] = [];
      let listSku = p.sku.split((/[\n, ]+/))
      listSku.forEach(element => {
        ids.push(element);
      });
      save = { ids: ids };
    }
    let data: any = [];
    let res = await this.$axios.post(process.env.apiBaseUrl + '/sku/bulk', save, config);
    if (res.data.error) {
      return res.data;
    }
    else {
      res.data.skus.forEach(element => {
        data.push({ qtquantityy: p.quantity, sku_id: p.sku, name: element.product_name });
      });
      if (res.data.skus.child_skus) {
        if (res.data.skus.child_skus.length > 0) {
          res.data.skus.child_skus.forEach(element => {
            data.push({ quantity: p.quantity, sku_id: element.sku_id, name: element.product_name });
          });

        }
      }

      commit('productBList', {
        productAList: data
      })
      // dispatch('loadChilds')
      return data
    }


  },
  async addRewards({ commit, dispatch, rootState, state }, p: any) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }

    let res = await this.$axios.get(process.env.apiBaseUrl + '/sku/' + p.sku, config);
    if (res.data.error) {
      return res.data;
    }
    else {
      let data: any = [];
      let discountType = ''
      let promo_type = ''
      console.log(p.discountType)
      if (p.discountType == 1) {
        discountType = '$' + p.discount + ' Off'
        promo_type = 'AMOUNT_OFF'
      } else if (p.discountType == 2) {
        discountType = p.discount + ' % Off'
        promo_type = 'PERCENT_OFF'
      } else {
        discountType = ''
      }
      let qty = '';
      if (p.maxquantity) {
        qty = p.quantity + " to " + p.maxquantity
      }
      else {
        p.maxquantity = null;
      }
      data.push({
        quantity: p.quantity, sku_id: p.sku, name: res.data.product_name, promo: discountType
        , promo_type: promo_type, max_quantity: p.maxquantity, qty: qty
      });
      if (res.data.child_skus) {
        if (res.data.child_skus.length > 0) {
          res.data.child_skus.forEach(element => {
            data.push({
              quantity: p.quantity, sku_id: element.sku_id, name: element.product_name, promo: discountType,
              promo_type: promo_type, max_quantity: p.maxquantity, qty: qty
            });
          });

        }
      }

      commit('rewardsList', {
        rewardsList: data
      })
      // dispatch('loadChilds')
      return data
    }

  },
  async addPromotion({ commit, dispatch, rootState, state }, p: any) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }

    let res = await this.$axios.post(process.env.apiBaseUrl + '/gwp/promotions/add/', p, config);


    return res

  },
  async searchPromotion({ commit, dispatch, rootState, state }, url: any) {


    commit('loading')
    const config = {
      headers: { 'token': localStorage.getItem("token") }
    }

    let res = await this.$axios.get(process.env.apiBaseUrl + url, config);
    let list: any = []
    let channelName = ''
    res.data.forEach(element => {
      let data = {}
     element.channels.forEach(channel => {
        channelName = channelName + channel.name + ","
      });
      data = {
        channelName: channelName, code: element.code, start_date: element.start_date,
        end_date: element.end_date, name: element.name, merchnat_id: element.supplier.user_id

      }
      list.push(data);
    });
   console.log(list);

    return list

  },

  loading({ commit }, status?: boolean) {
    commit('loading', status)
  }
}
