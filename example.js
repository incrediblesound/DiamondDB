const diamond = require('./src/main')
const server = require('./server')


/*
 * to use your own modules, swap out store and cache with a module that exposes
 * a single message() method that interprets the operations defined in common/operations
 * and returns a promise
 */

const store = new diamond.Store()
const cache = new diamond.Cache({ size: 8 })

const db = new diamond.Database({
  store,
  cache
})

db.init({
  persist: 5000
})

// puts database in a queue that receives requests and serves responses via callback
server(db)
