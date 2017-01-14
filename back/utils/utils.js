import fs from 'fs'
import Promise from 'bluebird'
import { READ, APPEND } from './constants'

const openFile = Promise.promisify(fs.open)
const writeFile = Promise.promisify(fs.writeFile)

export function openOrCreate(path, mode){
  return openFile(path, mode).catch((err) => create(path, mode).catch(bail))
}

function create(path, mode){
  console.log('BOOO!')
  return writeFile(path, 'test').catch(bail)
}

function bail(err){
  throw new Error(err)
}
