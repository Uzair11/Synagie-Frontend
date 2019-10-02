/* eslint-disable no-undef no-var no-redeclare */

import * as functions from 'firebase-functions'
import { Client, RequestParams } from '@elastic/elasticsearch'
import { region, languages } from './settings'
import {
  isLanguageCollection,
  pushLanguageCollection,
  allLanguageFields
} from './util'
import { ElasticClient, parseForElastic } from './elastic'
// import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'

const admin = require('firebase-admin')

interface ListResult {
  page: number
  list: any[]
  count: number
  limit: number
  error?: string
}

const collection = "<%= table %>"

export const fetch<%= pluralClassName %>List = functions.region(region).https.onCall(
  async (data, context): Promise<ListResult> => {
    const searchParams: RequestParams.Search = {
      index: collection,
      body: {
        query: {}
      }
    }

    const limit = data.limit ? parseInt(data.limit) : 10
    const page = data.page ? parseInt(data.page) : 1
    const offset = (page - 1) * limit
    searchParams.from = offset
    // if(false) {
    //   return { page: page, list: res.body.hits.hits, count: res.body.hits.total, limit: limit}
    // }

    // const text = data.text;
    // Authentication / user information is automatically added to the request.
    // const uid = context.auth.uid;
    // const name = context.auth.token.name || null;
    // const picture = context.auth.token.picture || null;
    // const email = context.auth.token.email || null;
    const auth: any = context.auth || {}
    if (!auth || !auth.uid) {
      return { page: 1, list: [], count: 0, limit: 0, error: 'access_denied' }
    }
    let c = 0

    // console.log('filters', JSON.stringify(data.filters))
    let shoulds: Record<string, any>[] = []
    // let musts : Record<string,any>[] = []
    const filters: Record<string, any>[] = []
    const filterKeys = data.filters ? Object.keys(data.filters) : []
    console.log('keys', filterKeys)
    // let selectFields: Record<string, any> = {}
    if (filterKeys.length > 0) {
      for (c = 0; c < filterKeys.length; c++) {
        const field = filterKeys[c]

        // console.log('match', JSON.stringify(data.filters[field]))
        // let key: string
        switch (field) {
          case 'search':
            console.log('search: ', data.filters['search'])
            shoulds = shoulds.concat(
              allLanguageFields('name').map(field => {
                const match: any = {}
                // match[field] = '.*' + data.filters['search'] + '.*'
                // return {
                //   regexp: match
                // }
                match[field] = data.filters['search']
                return {
                  match: match
                }
              })
            )

            // selectFields = { score: { $meta: 'textScore' } }
            break
          //   for (key in data.filters[field]) {
          //     filters[key] = new RegExp(data.filters[field][key])
          //   }
          //   console.log('match', JSON.stringify(filters[key]))
          //   break
          default:
            // console.log('match', JSON.stringify(data.filters[field]))
            for (let iF = 0; iF < data.filters[field].length; iF++) {
              //support for term + range - https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html
              // const cond: any = {}
              // cond[key] = data.filters[field][iF]
              console.log(
                'filter cond:',
                JSON.stringify(data.filters[field][iF])
              )
              filters.push(data.filters[field][iF])
            }
        }
      }
    }
    let sorts: Record<string, any>[] = []
    if (data.sorts && data.sorts.length > 0) {
      for (let c = 0; c < data.sorts.length; c++) {
        const sort = data.sorts[c]

        let newSort : any = {}
        newSort[sort.field] = sort.dir === 'desc' ? 'desc' : 'asc'
        sorts.push(newSort)
      }
    } else {
      sorts.push({ 'createdAt': 'desc'})
    }

    if (filters.length > 0 || shoulds.length > 0) {
      searchParams.body.query = { bool: {} }
      if (filters.length > 0) {
        searchParams.body.query.bool['filter'] = filters
      }
      if (shoulds.length > 0) {
        searchParams.body.query.bool['should'] = shoulds
      }
      // searchParams.body.query.match_all = filters
    } else {
      searchParams.body.query = { match_all: {} }
    }
    console.log('query', JSON.stringify(searchParams.body.query))
    searchParams.body.sort = sorts
    searchParams.body.size = limit

    //   searchParams.body.fields = [
    //     "_source"
    // ]
    // searchParams.body._source = {
    //   includes:
    // }

    const es: Client = ElasticClient()
    const res = await es.search(searchParams)
    // console.log('searched', res.body.hits.total, res.body.hits.hits)
    // console.log('filters', JSON.stringify(filters))
    // console.log('sorts', data.sorts)

    // let list = []
    // for (let i in baby_attribute) {
    //   list.push(baby_attribute[i])
    // }

    return {
      page: page,
      list: res.body.hits.hits,
      count: res.body.hits.total,
      limit: limit
    }
  }
)



//===* begin sync to elasticsearch and language *===/
export const onCreate<%= singularClassName %> = functions
  .region(region)
  .firestore.document('<%= table %>/{id}').
  onCreate(
    async (snap, context): Promise<any> => {
    console.log('oncreate', snap)
    const record = snap.data() || {}
    // console.log('records??', records)
    const id = context.params.id

    let now = new Date()
    now = new Date(now.toUTCString())
    let createdAt = record.createdAt
    if(!createdAt) {
      let ref = admin.firestore().doc('<%= table %>/' + id)
      await ref.update({ createdAt: now })
      createdAt = now
    }

    console.log('create <%= singularClassName %>', id, record)
    if (isLanguageCollection(collection)) {
      pushLanguageCollection(collection, record, id).catch((e: any) => {
        console.error('unable to push collection', e)
      })
    }

    const es: Client = ElasticClient()
    const pushData: Record<string, any> = Object.assign({}, parseForElastic(record, id), {
      
    })

    const doc1: RequestParams.Index = {
      index: collection,
      id: id,
      body: pushData
    }
    console.log('pushing ES', doc1)
    await es.index(doc1)
    // let update = Object.assign({ uid: id, createdAt: createdAt }, record)

    return true
  }
)

export const onUpdate<%= singularClassName %> = functions.region(region).firestore.document('<%= table %>/{id}').onUpdate(
  async (change, context): Promise<any> => {
    // console.log('change?', context)
    const record : any = change.after.data()
    // console.log('records??', records)
    const id : string = context.params.id
    console.log('updated <%= singularClassName %>', id, record)

    if (isLanguageCollection(collection)) {
      pushLanguageCollection(collection, record, id).catch((e: any) => {
        console.error('unable to push collection', e)
      })
    }

    const es: Client = ElasticClient()
    const pushData: Record<string, any> = Object.assign({}, parseForElastic(record, id), {
      
    })

    const doc1: RequestParams.Index = {
      index: collection,
      id: id,
      body: pushData
    }
    console.log('pushing ES', doc1)
    await es.index(doc1)
    // let update = Object.assign({ uid: id }, record)

    return true
  }
)

export const onDelete<%= singularClassName %> = functions.region(region).firestore.document('<%= table %>/{id}').onDelete(
  async (snap, context): Promise<any> => {
    // console.log('change?', context)
    const record = snap.data()
    // console.log('records??', records)
    const id = context.params.id
    console.log('delete <%= singularClassName %>', id, record)

    if(isLanguageCollection(collection)) {
      for(var l = 0; l < languages.length; l++) {
        let lang = languages[l]

        let ref = admin.firestore().collection(collection+'_'+lang).doc(id)
        let snap = await ref.get()
        if(snap.exists) {
          await ref.delete()
        }
      }
    }

    let es: Client = ElasticClient()
    await es.delete({
      index: collection,
      id: id,
    })

    return true
  }
)

//===* end sync to elasticsearch *===/

// insert into index.ts
// import {
//   fetch<%= pluralClassName %>List,
//   onCreate<%= singularClassName %>,
//   onUpdate<%= singularClassName %>,
//   onDelete<%= singularClassName %>
// } from './trigger<%= singularClassName %>'

