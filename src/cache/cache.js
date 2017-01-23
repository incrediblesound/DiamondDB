import Promise from 'bluebird'
import {
  FETCH_RECORD,
  STORE_RECORD,
  fetchRecord,
  storeRecord,
 } from '../common/operations'

export default class Cache {
  constructor(){
    this.tables = {}
  }
  storeRecord({ table, record, id }){
    this.tables[table.name] = this.tables[table.name] || {}
    this.tables[table.name][id] = record
  }
  fetchRecord(tableName, id){
    const record = this.tables[tableName] && this.tables[tableName][id]
    return Promise.resolve(record || null)
  }
  message(message){
    switch(message.operation){
      case STORE_RECORD:
        this.storeRecord(message.data)
        return Promise.resolve(1)
      case FETCH_RECORD:
        return this.fetchRecord(message.data)
    }
  }
}
