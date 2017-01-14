class Q {
  constructor(db){
    this.db = db
    this.stack = []
  }
  register(job, cb){
    this.stack.push({ job, cb })
  }
  start(){
    console.log('Queue is listening')
    setInterval(() => {
      if(this.db.isReady() && this.stack.length){
        const next = this.stack.shift()
        const operation = next.job.operation
        const data = next.job.data
        switch(operation){
          case 'SAVE':
          this.db.saveRecord(data.table, data.body).then(id => {
            next.cb(id)
          })
          break
          case 'LOAD':
          this.db.loadRecord(data.table, data.id).then(record => {
            next.cb(record)
          })
          break
          case 'TABLE_CREATE':
          this.db.makeTable(data.name, data.schema).then(result => {
            next.cb(result)
          })
        }
      }
    }, 0)
  }
}

module.exports = Q
