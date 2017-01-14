import Store from '../back/store'

export default class Database {
  constructor(){
    this.store = new Store()
  }
  makeTable(name, schema){
    this.store.makeTable(name, schema)
  }
  saveRecord(table, record){
    this.store.save(table, record)
  }
}
