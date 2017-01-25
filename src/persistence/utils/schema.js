
const parseMeta = (metaString) => {
  const list = metaString.split('\n')
  return list.reduce((tables, tableString) => {
    if(!tableString || !tableString.length) return tables

    const [name, schemaText, size, idx] = tableString.split('__');
    const props = schemaText.split('.')
    const schema = props.reduce((map, prop) => {
      const [key, type, len] = prop.split(';')
      map[key] = [type, parseInt(len)]
      return map
    }, {})
    tables[name] = { name, schema, size: parseInt(size), index: parseInt(idx) }
    return tables
  }, {})
}

const makeSchemaString = (table) => {
  // 'person__name;string;15.age;number;3\n'
  const schema = table.schema
  const keys = Object.keys(schema)
  const pieces = keys.map(key => {
    const data = schema[key]
    return `${key};${data[0]};${data[1]}`
  })
  return `${table.name}__${pieces.join('.')}__${table.size}__${table.index}\n`
}

module.exports = {
  parseMeta,
  makeSchemaString
}
