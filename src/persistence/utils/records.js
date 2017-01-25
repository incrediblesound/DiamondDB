const makeRecordString = (table, record) => {
  const temp = []
  temp.length = table.size
  temp.fill(' ')
  var cursorPosition = 0
  var currentPosition = 0
  Object.keys(record).forEach(key => {
    let value = record[key].toString()
    let valueLength = table.schema[key][1]
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

const parseRecord = (recordString, schema) => {
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
  if(string[string.length-1] !== ' ') return string
  const arr = string.split('')
  while(arr.length && arr[arr.length-1] === ' '){
    arr.pop()
  }
  return arr.join('')
}

module.exports = {
  parseRecord,
  makeRecordString
}
