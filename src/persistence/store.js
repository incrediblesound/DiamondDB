const fs = require('fs')
const Promise = require('bluebird')
const diskUtils = require('./utils/utils')
const recordUtils = require('./utils/records')
const schemaUtils = require('./utils/schema')
const operations = require('../common/operations')
const constants = require('./utils/constants')
const {
  PERSIST_ALL,
  INITIALIZE_PERSISTANCE,
  MAKE_TABLE,
  UPDATE_META,
  FETCH_RECORD,
  STORE_RECORD,
  success,
  failure
} = operations
const { READ, APPEND, PAGE_SIZE } = constants

const open = Promise.promisify(fs.open)
const read = Promise.promisify(fs.read)
const readFile = Promise.promisify(fs.readFile)

module.exports = class Store {
  constructor() {
    this.root = './data/'
    this.metaFilePath = `${this.root}meta.txt`
    this.operations = []
    this.latestMetaUpdate = null
  }
  init(){
    return diskUtils.openOrCreate(this.metaFilePath, READ)
      .then(this._loadMeta.bind(this))
      .then((tables) => success(tables))
  }
  /* called by init() */
  _loadMeta(data) {

    return readFile(this.metaFilePath).then(data => {
      const tableData = data.toString()
      if(tableData.length){
        return schemaUtils.parseMeta(tableData)
      }
    })
  }
  _clearOperations() {
    const operations = this.operations.slice()
    this.operations = []
    return operations
  }
  updateMeta() {
    const tables = this.latestMetaUpdate && this.latestMetaUpdate.tables
    if(tables){
      let meta = ''
      Object.keys(tables).forEach(tableName => {
        meta += schemaUtils.makeSchemaString(tables[tableName])
      })
      return diskUtils.create(this.metaFilePath, meta).then(success)
    } else {
      return Promise.resolve(success())
    }
  }
  makeTable({ tableData }) {
    if(!tableData){
      return Promise.reject(failure('Create table message did not contain new table'))
    }
    const schemaString = schemaUtils.makeSchemaString(tableData)
    return diskUtils.append(this.metaFilePath, schemaString).then(() => {
      return success()
    })
  }
  /* called by persist */
  _save(fileName, records) {
    return diskUtils.openOrCreate(fileName, 'a').then(() => {
      return diskUtils.append(fileName, records)
    })
  }
  fetch({ table, id }){
    const schemaLength = table.size
    const pageIdx = Math.floor(id/PAGE_SIZE)
    const recordIdx = id % PAGE_SIZE
    const fileName = `${this.root}${table.name}.${pageIdx}.dat`
    return readFile(fileName)
      .then(result => {
        const page = result.toString()
        const position = recordIdx * schemaLength
        const recordString = page.substring(position, position+schemaLength)
        const record = recordUtils.parseRecord(recordString, table.schema)
        return success(record)
      })
      .catch(e => {
        return failure(e)
      })

  }
  persist(){
    const operations = this._clearOperations()
    const storeOperations = operations.filter(msg => msg.operation === STORE_RECORD)
    const fileMap = storeOperations.reduce((map, op) => {
      const { table, record, id } = op.data
      const pageIdx = Math.floor(id/PAGE_SIZE)
      const fileName = `${this.root}${table.name}.${pageIdx}.dat`
      const recordString = recordUtils.makeRecordString(table, record)
      map[fileName] = map[fileName] || []
      map[fileName][id] = recordString
      return map
    }, {})
    const promises = Object.keys(fileMap).map(fileName => {
      const recordString = fileMap[fileName].join('')
      return this._save(fileName, recordString)
    })
    if(promises.length){
      return this.updateMeta()
      .then(() => Promise.all(promises))
      .then(() => success())
    } else {
      return success()
    }
  }
  message(message){
    console.log('store message: ', message.operation)
    switch(message.operation){
      case UPDATE_META:
        this.latestMetaUpdate = message.data
        return Promise.resolve()
      case STORE_RECORD:
        this.operations.push(message)
        return Promise.resolve()
      case FETCH_RECORD:
        return this.fetch(message.data)
      case MAKE_TABLE:
        return this.makeTable(message.data)
      case INITIALIZE_PERSISTANCE:
        return this.init()
      case PERSIST_ALL:
        return this.persist()
    }
  }
}
