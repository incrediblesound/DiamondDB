const fs = require('fs')
const constants = require('./constants')
const operations = require('../../common/operations')
const Promise = require('bluebird')

const { READ, APPEND } = constants
const { failure } = operations

const openFile = Promise.promisify(fs.open)
const writeFile = Promise.promisify(fs.writeFile)
const appendFile = Promise.promisify(fs.appendFile)

function openOrCreate(path, mode){
  return openFile(path, mode).catch((err) => create(path).catch(_bail))
}

function create(path, contents=''){
  return writeFile(path, contents).catch(_bail)
}

function _bail(err){
  return failure(err)
}

function append(path, data){
  return appendFile(path, data).catch(_bail)
}

module.exports = {
  create,
  openOrCreate,
  append
}
