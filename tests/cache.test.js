const Cache = require('../src/cache/cache')
const asssert = require('assert')
const operations = require('../src/common/operations')

const { storeRecord, fetchRecord } = operations

const cache = new Cache({ size: 4 })

describe('cache', () => {
  it('saves records to a table', () => {

  })
  it('fetches records from a table', () => {

  })
})
