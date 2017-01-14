import fs from 'fs'
import Promise from 'bluebird'
import {
  openOrCreate,
  append,
  makeSchemaString,
  makeRecordString,
  parseMeta,
  parseRecord,
  schemaLength } from './utils/utils'
import { READ, APPEND, PAGE_SIZE } from './utils/constants'
const open = Promise.promisify(fs.open)
const read = Promise.promisify(fs.read)
const readFile = Promise.promisify(fs.readFile)

export default class Store {
  constructor() {
    this.tables = {}
    this.root = './data/'
    this.metaFilePath = `${this.root}meta.txt`
  }
  init(){
    return openOrCreate(this.metaFilePath, READ).then(this.loadMeta)
  }
  loadMeta = (data) => {
    return readFile(this.metaFilePath).then(data => {
      this.tables = parseMeta(data.toString())
    })
  }
  makeTable(name, schema) {
    const length = schemaLength(schema)
    this.tables[name] = { length, schema, index: 0 } // TODO eww object reference
    const schemaString = makeSchemaString(name, schema, length)
    append(this.metaFilePath, schemaString)
  }
  save(tableName, record) {
    const table = this.tables[tableName]
    const index = table.index++
    const pageIdx = Math.floor(index/PAGE_SIZE)
    const recordString = makeRecordString(table, record)
    const fileName = `${this.root}${tableName}.${pageIdx}.dat`
    const recordIdx = pageIdx % PAGE_SIZE
    if(recordIdx === 1){  /* new page! */
      return openOrCreate(fileName).then(() => {
        return append(fileName, recordString).then(() => index)
      })
    } else {
      return append(fileName, recordString).then(() => index)
    }
  }
  load(tableName, id){
    const table = this.tables[tableName]
    const schemaLength = table.length
    const pageIdx = Math.floor(id/PAGE_SIZE)
    const recordIdx = pageIdx % PAGE_SIZE
    const fileName = `${this.root}${tableName}.${pageIdx}.dat`
    return readFile(fileName).then(result => {
      const page = result.toString()
      const position = recordIdx*schemaLength
      const recordString = page.substring(position, position+schemaLength)
      return parseRecord(recordString, table.schema)
    })
  }
}
