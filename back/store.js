import fs from 'fs'
import { openOrCreate } from './utils/utils'
import { READ, APPEND } from './utils/constants'

export default class Store {
  constructor() {
    this.tables = []
    this.root = './data/'
    this.metaFilePath = `${this.root}meta.txt`
    return openOrCreate(this.metaFilePath, READ).then(() => this.loadMeta)
  }
  makeTable(name, schema) {

  }
  save(table, record) {

  }
  loadMeta(data) {
    console.log(data)
  }
}
