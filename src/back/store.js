import fs from 'fs'
import Promise from 'bluebird'
import { openOrCreate, append, create } from './utils/utils'
import { parseRecord, makeRecordString } from './utils/records'
import { makeSchemaString, parseMeta, schemaLength } from './utils/schema'
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
      const tableData = data.toString()
      if(tableData.length){
        this.tables = parseMeta(tableData)
      }
    })
  }
  updateMeta = () => {
    let meta = ''
    Object.keys(this.tables).forEach(tableName => {
      meta += makeSchemaString(tableName, this.tables[tableName])
    })
    return create(this.metaFilePath, meta)
  }
  makeTable(name, schema) {
    const size = schemaLength(schema)
    const newTable = { size, schema, index: 0 } // TODO eww object reference
    this.tables[name] = newTable
    const schemaString = makeSchemaString(name, newTable)
    return append(this.metaFilePath, schemaString).then(() => {
      return 1
    })
  }
  save(tableName, record) {
    const table = this.tables[tableName]
    let recordString
    try {
      recordString = makeRecordString(table, record)
    } catch(e){
      return Promise.resolve(e.toString())
    }
    const id = table.index++
    const pageIdx = Math.floor(id/PAGE_SIZE)
    const recordIdx = id % PAGE_SIZE
    const fileName = `${this.root}${tableName}.${pageIdx}.dat`

    if(recordIdx === 0){  /* new page! */
      return openOrCreate(fileName).then(() => {
        return append(fileName, recordString).then(this.updateMeta).then(() => id)
      })
    } else {
      return append(fileName, recordString).then(this.updateMeta).then(() => id)
    }
  }
  load(tableName, id){
    const table = this.tables[tableName]
    if(id < 0 || id >= table.index){
      return Promise.resolve(`ERROR: no record at index ${id} in table ${tableName}`)
    }
    const schemaLength = table.size
    const pageIdx = Math.floor(id/PAGE_SIZE)
    const recordIdx = id % PAGE_SIZE
    const fileName = `${this.root}${tableName}.${pageIdx}.dat`
    return readFile(fileName).then(result => {
      const page = result.toString()
      const position = recordIdx * schemaLength
      const recordString = page.substring(position, position+schemaLength)
      return parseRecord(recordString, table.schema)
    })
  }
}
