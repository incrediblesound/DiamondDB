const fs = require('fs')
const operations = require('../../common/operations')

const { failure } = operations

const openFile = promisify(fs.open)
const writeFile = promisify(fs.writeFile)
const appendFile = promisify(fs.appendFile)

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

function promisify(func){
  return function(...args){
    return new Promise((resolve, reject) => {
      args.push(function(err, data){
        if(err) return reject(err)
        return resolve(data)
      })
      return func.apply(null, args)
    })
  }
}

module.exports = {
  create,
  openOrCreate,
  append,
  promisify
}
