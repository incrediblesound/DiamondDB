import fs from 'fs'
import Promise from 'bluebird'
import { openOrCreate, append, create } from './utils/utils'
import { parseRecord, makeRecordString } from './utils/records'
import { makeSchemaString, parseMeta } from './utils/schema'
import {
  PERSIST_ALL,
  INITIALIZE_PERSISTANCE,
  MAKE_TABLE,
  UPDATE_META,
  FETCH_RECORD,
  STORE_RECORD,
  success,
  failure
 } from '../common/operations'
import { READ, APPEND, PAGE_SIZE } from './utils/constants'

const open = Promise.promisify(fs.open)
const read = Promise.promisify(fs.read)
const readFile = Promise.promisify(fs.readFile)

export default class Store {
  constructor() {
    this.root = './data/'
    this.metaFilePath = `${this.root}meta.txt`
    this.operations = []
    this.latestMetaUpdate = null
  }
  init(){
    return openOrCreate(this.metaFilePath, READ)
      .then(this._loadMeta)
      .then((tables) => success(tables))
  }
  /* called by init() */
  _loadMeta = (data) => {

    return readFile(this.metaFilePath).then(data => {
      const tableData = data.toString()
      if(tableData.length){
        return parseMeta(tableData)
      }
    })
  }
  _clearOperations() {
    const operations = this.operations.slice()
    this.operations = []
    return operations
  }
  updateMeta = () => {
    const tables = this.latestMetaUpdate && this.latestMetaUpdate.tables
    console.log(tables)
    if(tables){
      let meta = ''
      Object.keys(tables).forEach(tableName => {
        meta += makeSchemaString(tables[tableName])
      })
      return create(this.metaFilePath, meta).then(success)
    } else {
      return Promise.resolve(success())
    }
  }
  makeTable({ tableData }) {
    if(!tableData){
      return Promise.reject(failure('Create table message did not contain new table'))
    }
    const schemaString = makeSchemaString(tableData)
    return append(this.metaFilePath, schemaString).then(() => {
      return success()
    })
  }
  /* called by persist */
  _save(fileName, records) {
    return openOrCreate(fileName).then(() => {
      return append(fileName, records)
    })
  }
  fetch({ tableName, id }){
    const table = this.tables[tableName]
    const schemaLength = table.size
    const pageIdx = Math.floor(id/PAGE_SIZE)
    const recordIdx = id % PAGE_SIZE
    const fileName = `${this.root}${tableName}.${pageIdx}.dat`
    return readFile(fileName)
      .then(result => {
        const page = result.toString()
        const position = recordIdx * schemaLength
        const recordString = page.substring(position, position+schemaLength)
        const record = parseRecord(recordString, table.schema)
        return success(record)
      })
      .catch(e => {
        return failure(e)
      })

  }
  persist(){
    const operations = this._clearOperations()
    const storeOperations = this.operations.filter(op => op.operation === STORE_RECORD)
    const fileMap = storeOperations.reduce((map, op) => {
      const { table, record, id } = op.data
      const pageIdx = Math.floor(id/PAGE_SIZE)
      const fileName = `${this.root}${table.name}.${pageIdx}.dat`
      const recordString = makeRecordString(table, record)
      map[fileName] = map[fileName] || []
      map[fileName][id] = recordString
      return map
    }, {})
    const promises = Object.keys(fileMap).map(fileName => {
      const recordString = fileMap[fileName].join('')
      return this._save(fileName, recordString)
    })
    return this.updateMeta()
      .then(() => Promise.all(promises))
      .then(success)
  }
  message(message){
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
