import Store from '../back/store'

export default class Database {
  constructor(){
    this.store = new Store()
  }
  init(){
    return this.store.init()
  }
  makeTable(name, schema){
    this.store.makeTable(name, schema)
  }
  saveRecord(table, record){
    return this.store.save(table, record)
  }
  loadRecord(table, id){
    return this.store.load(table, id)
  }
}
