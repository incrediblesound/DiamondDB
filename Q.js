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
          console.log('Saving record...')
          this.db.saveRecord(data.table, data.record)
            .then(id => {
              next.cb(id)
            })
            .catch(error => {
              next.cb(error)
            })
          break
          case 'FETCH':
          console.log('Fetching record...')
          this.db.fetchRecord(data.table, data.id)
            .then(record => {
              next.cb(record)
            })
            .catch(error => {
              next.cb(error)
            })
          break
          case 'TABLE_CREATE':
          console.log('Creating table...')
          this.db.makeTable(data.name, data.schema)
            .then(result => {
              next.cb(result)
            })
            .catch(error => {
              next.cb(error)
            })
        }
      }
    }, 0)
  }
}

module.exports = Q
