const PLRUCache = require('../src/cache/PLRUCache')
const assert = require('assert')

let record_a = { _id: 1 }
let record_b = { _id: 2 }
const cache = new PLRUCache(4)

describe('PLRU Cache', () => {
  it('stores records', () => {
    cache.insert(record_a)
    cache.insert(record_b)
    assert(cache.items[0] === record_a && cache.items[2] === record_b)
  })
  it('retrieves records', () => {
    const first = cache.getById(1)
    const second = cache.getById(2)
    assert(first === record_a && second === record_b)
  })
})
