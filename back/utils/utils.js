import fs from 'fs'
import Promise from 'bluebird'
import { READ, APPEND } from './constants'

const openFile = Promise.promisify(fs.open)
const writeFile = Promise.promisify(fs.writeFile)
const appendFile = Promise.promisify(fs.appendFile)

export function openOrCreate(path, mode){
  return openFile(path, mode).catch((err) => create(path, mode).catch(bail))
}

function create(path, mode){
  return writeFile(path, '').catch(bail)
}

function bail(err){
  throw new Error(err)
}

export function append(path, data){
  return appendFile(path, data).catch(bail)
}

export function schemaLength(schema){
  const keys = Object.keys(schema)
  return keys.reduce((acc, curr) => {
    const len = schema[curr][1]
    return acc + len
  }, 0)
}

export function parseMeta(metaString){
  const list = metaString.split('\n')
  return list.reduce((acc, curr) => {
    if(!curr || !curr.length) return acc

    const [head, tail, len] = curr.split('__');
    const props = tail.split('.')
    const schema = props.reduce((acc2, curr2) => {
      const [key, type, len] = curr2.split(';')
      acc2[key] = [type, parseInt(len)]
      return acc2
    }, {})
    acc[head] = { schema, length: parseInt(len) }
    return acc
  }, {})
}

export function makeSchemaString(name, schema){
  // 'person__name;string;15.age;number;3\n'
  const keys = Object.keys(schema)
  const pieces = keys.map(key => {
    const data = schema[key]
    return `${key};${data[0]};${data[1]}`
  })
  return `${name}__${pieces.join('.')}\n`
}

export function makeRecordString(table, record){
  const temp = []
  temp.length = table.length
  temp.fill(' ')
  var cursorPosition = 0
  var currentPosition = 0
  Object.keys(record).forEach(key => {
    const valueLength = table.schema[key][1]
    const value = `${record[key]}` // store value as string
    if(value.length > valueLength){
      throw new Error(`Value "${value}" too long for property "${key}".`)
    }
    for(let i = 0, l = value.length; i<l; i++){
      temp[cursorPosition] = value[i]
      cursorPosition++
      currentPosition++
    }
    cursorPosition += (valueLength - currentPosition) // jump ahead to next space in record
    currentPosition = 0
  })
  return temp.join('')
}

export function parseRecord(recordString, schema){
  let counter = 0
  return Object.keys(schema).reduce((acc, curr) => {
    const len = schema[curr][1]
    const value = recordString.substring(counter, counter+len)
    if(schema[curr][0] === 'number'){
      acc[curr] = parseInt(value)
    } else {
      acc[curr] = trimTail(value)
    }
    counter += len
    return acc
  }, {})
}

function trimTail(string){
  if(string[string.length-1] === ' '){
    return trimTail(string.substring(0, string.length-1))
  } else {
    return string
  }
}
