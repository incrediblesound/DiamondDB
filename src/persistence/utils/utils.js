import fs from 'fs'
import Promise from 'bluebird'
import { READ, APPEND } from './constants'

const openFile = Promise.promisify(fs.open)
const writeFile = Promise.promisify(fs.writeFile)
const appendFile = Promise.promisify(fs.appendFile)

export function openOrCreate(path, mode){
  return openFile(path, mode).catch((err) => create(path).catch(bail))
}

export function create(path, contents=''){
  return writeFile(path, contents).catch(bail)
}

function bail(err){
  throw new Error(err)
}

export function append(path, data){
  return appendFile(path, data).catch(bail)
}
