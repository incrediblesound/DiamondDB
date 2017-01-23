import Promise from 'bluebird'

export const validate = (schema, record) => {
  var keys = Object.keys(record)
  for(let i = 0; i < keys.length; i++){
    let key = keys[i]
    if(!schema[key]){
      return Promise.reject(`No key "${key}" in schema.`)
    }
    const valueLength = schema[key][1]
    const value = `${record[key]}` // store value as string
    if(value.length > valueLength){
      return Promise.reject(`Value "${value}" too large for property "${key}".`)
    }
  }
  return Promise.resolve()
}

export function schemaLength(schema){
  const keys = Object.keys(schema)
  return keys.reduce((acc, curr) => {
    const len = schema[curr][1]
    return acc + len
  }, 0)
}

// 901946499 //
