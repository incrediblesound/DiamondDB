export function makeRecordString(table, record){
  const temp = []
  temp.length = table.size
  temp.fill(' ')
  var cursorPosition = 0
  var currentPosition = 0
  Object.keys(record).forEach(key => {
    if(!table.schema[key]){
      throw new Error(`No key "${key}" in schema.`)
    }
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
  return Object.keys(schema).reduce((record, property) => {
    const len = schema[property][1]
    const value = recordString.substring(counter, counter+len)
    if(schema[property][0] === 'number'){
      record[property] = parseInt(value)
    } else {
      record[property] = trimTail(value)
    }
    counter += len
    return record
  }, {})
}

function trimTail(string){
  const arr = string.split('')
  while(arr.length && arr[arr.length-1] === ' '){
    arr.pop()
  }
  return arr.join('')
}
