const diamond = require('./dist/diamond')
const server = require('./server')


/*
 * to use your own modules, swap out store and cache with a module that exposes
 * a single message() method that interprets the operations defined in common/operations
 * and returns a promise
 */

const store = new diamond.Store()
const cache = new diamond.Cache()

const db = new diamond.DB({
  store,
  cache
})

db.init({
  persist: 5000
})

// puts database in a queue that receives requests and serves responses via callback
server(db)
