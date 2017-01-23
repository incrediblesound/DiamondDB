import Store from '../persistence/store'
import { BUSY, READY, INIT } from './constants'
import {
  makeTable,
  initialize,
  fetchRecord,
  storeRecord,
  updateMeta,
  writeToDisk
 } from '../common/operations'
import { validate, schemaLength } from './utils/schema'

export default class Database {
  constructor(options){
    this.persist = options.store
    this.cache = options.cache
    this.tables = {}
    this.status = INIT
  }
  init(options){
    return this.persist.message(initialize())
    .then((success) => {
      this.tables = success.data || {}  /* success message holds payload on data */
      this.status = READY
      return this.start(options)
    })
    .catch(() => {
      this.status = READY
      return 'new database initialized'
    })
  }
  start({ persist }){
    if(persist !== false){
      setInterval(() => {
        this.writeToDisk()
      }, persist )
    }
    return 1
  }
  isReady(){
    return this.status === READY
  }
  makeTable(name, schema){
    const size = schemaLength(schema)
    const newTable = { name, size, schema, index: 0 } // TODO eww object reference
    this.tables[name] = newTable
    /* Question: is it necessary to persist tables on creation?
     * We re-write all tables on calls to writeToDisk()
     */
    this.status = BUSY
    return this.persist.message(makeTable(newTable))
      .then(() => {
        this.status = READY
        return 1
      })
      .catch(() => {
        this.status = READY
        return 0
      })
  }
  saveRecord(tableName, record){
    const table = this.tables[tableName]
    return validate(table.schema, record)
      .then(() => {
        const id = table.index++
        return this.cache.message(storeRecord(table, record, id)).then(() => {
          this.persist.message(storeRecord(table, record, id))
          .then(() => {
            return Object.assign({ _id: id }, record)
          })
          .catch(() => 0)
        })
      })
      .catch(e => {
        return Promise.reject(e)
      })

  }
  fetchRecord(tableName, id){
    const table = this.tables[tableName]
    if(id < 0 || id >= table.index){
      return Promise.reject(`ERROR: no record at index ${id} in table ${tableName}`)
    }
    return this.cache.message(fetchRecord(table, id)).then((response) => {
      if(response.operation === 'SUCCESS'){
        return response.data
      } else {
        return this.persist.message(fetchRecord(table, id)).then((response) => {
          if(response.operation === 'SUCCESS'){
            return response.data
          } else {
            return null
          }
        })
      }
    })
  }
  writeToDisk(){
    this.persist.message(updateMeta(this.tables))
    return this.persist.message(writeToDisk())
  }
}
