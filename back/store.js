import fs from 'fs'
import { openOrCreate, append, makeSchemaString, makeRecordString, schemaLength } from './utils/utils'
import { READ, APPEND, PAGE_SIZE } from './utils/constants'

export default class Store {
  constructor() {
    this.tables = {}
    this.root = './data/'
    this.metaFilePath = `${this.root}meta.txt`
    // this.loadTables()
  }
  init(){
    return openOrCreate(this.metaFilePath, READ).then(this.loadMeta.bind(this))
  }
  loadMeta(data) {
    // TODO
  }
  makeTable(name, schema) {
    const length = schemaLength(schema)
    this.tables[name] = { length, schema, index: 0 } // TODO eww object reference
    const schemaString = makeSchemaString(name, schema)
    append(this.metaFilePath, schemaString)
  }
  save(tableName, record) {
    const table = this.tables[tableName]
    const index = ++table.index
    const pageIdx = Math.floor(index/PAGE_SIZE)
    const recordString = makeRecordString(table, record)
    const fileName = `${this.root}/${tableName}.${pageIdx}.dat`
    const isFirst = pageIdx % PAGE_SIZE
    if(isFirst){
      return openOrCreate(fileName).then(() => {
        return append(`${this.root}${tableName}.${pageIdx}.dat`, recordString).then(writeMeta.bind(this))
      })
    } else {
      return append(`${this.root}${tableName}.${pageIdx}.dat`, recordString).then(writeMeta.bind(this))
    }
  }
  load(table, id){

  }
}
