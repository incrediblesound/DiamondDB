const schemaUtils = require('../src/api/utils/schema')
const assert = require('assert')

const testSchema = {
  name: ['string', 20],
  age: ['number', 5],
  dob: ['string', 8]
}

const invalidRecord_A = {
  name: 'Bob',
  agg: 12,
  dob: '03071986'
}

const invalidRecord_B = {
  name: 'John',
  age: 12,
  dob: '030719861'
}

const validRecord = {
  name: 'John',
  age: 12,
  dob: '03071986'
}

describe('schemaLength', () => {
  it('calculates the length of a record for a given schema', () => {
    const len = schemaUtils.schemaLength(testSchema)
    assert(len === 33)
  })
})

describe('validate', () => {
  it('rejects invalid keys', () => {
    schemaUtils.validate(testSchema, invalidRecord_A)
    .then(() => assert(false))
    .catch((e) => {
      assert(e === 'No key "agg" in schema.')
    })
  })
  it('rejects keys of invalid length', () => {
    schemaUtils.validate(testSchema, invalidRecord_B)
    .then(() => assert(false))
    .catch((e) => {
      assert(e === `Value "030719861" too large for property "dob".`)
    })
  })
  it('resolves valid records', () => {
    schemaUtils.validate(testSchema, validRecord)
    .then(() => assert(true))
    .catch(() => assert(false))
  })
})
