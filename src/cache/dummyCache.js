const operations = require('../common/operations')
module.export = class DummyCache {
  message(){
    return Promise.resolve(operations.success(null))
  }
}
