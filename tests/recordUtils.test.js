const recordUtils = require('../src/persistence/utils/records')
const assert = require('assert')

const testSchema = {
  name: ['string', 20],
  age: ['number', 5],
  dob: ['string', 8]
}

const validRecord = {
  name: 'John',
  age: 12,
  dob: '03071986'
}

const table = { size: 33, schema: testSchema }
const testRecordString = 'John                12   03071986'

describe('makeRecordString', () => {
  it('turns a record into a spaced string according to schema', () => {
    const recordString = recordUtils.makeRecordString(table, validRecord)
    assert(recordString === testRecordString)
  })
})

describe('parseRecord', () => {
  it('turns a record string into a JSON object', () => {
    const record = recordUtils.parseRecord(testRecordString, testSchema)
    assert.deepEqual(record, validRecord)
  })
})
