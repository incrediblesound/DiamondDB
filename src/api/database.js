import Store from '../back/store'
import { BUSY, READY, INIT } from './constants'

export default class Database {
  constructor(){
    this.store = new Store()
    this.status = INIT
  }
  init(){
    return this.store.init().then(() => this.status = READY)
  }
  isReady(){
    return this.status === READY
  }
  makeTable(name, schema){
    this.status = BUSY
    return this.store.makeTable(name, schema).then(data => {
      this.status = READY
      return data
    })
  }
  saveRecord(table, record){
    this.status = BUSY
    return this.store.save(table, record).then(data => {
      this.status = READY
      return data
    })
  }
  fetchRecord(table, id){
    this.status = BUSY
    return this.store.fetch(table, id).then(data => {
      this.status = READY
      return data
    })
  }
}
