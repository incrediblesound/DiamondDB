const PLRUCache = require('./PLRUCache')
const operations = require('../common/operations')
const {
  FETCH_RECORD,
  STORE_RECORD,
  success
} = operations

module.exports = class Cache {
  constructor(options){
    this.size = options.size
    this.tables = {}
  }
  storeRecord({ table, record, id }){
    this.tables[table.name] = this.tables[table.name] || new PLRUCache(this.size)
    this.tables[table.name].insert(Object.assign({ _id: id }, record))
  }
  fetchRecord({ table, id }){
    const record = this.tables[table.name] && this.tables[table.name].getById(id)
    return Promise.resolve(success(record || null))
  }
  message(message){
    console.log('cache message: ', message.operation)
    switch(message.operation){
      case STORE_RECORD:
        this.storeRecord(message.data)
        return Promise.resolve(success())
      case FETCH_RECORD:
        return this.fetchRecord(message.data)
    }
  }
}
