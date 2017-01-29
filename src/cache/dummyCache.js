const operations = require('../common/operations')
module.exports = class DummyCache {
  message(){
    return Promise.resolve(operations.success(null))
  }
}
