const DB = require('../dist/diamond').DB
const db = new DB()

const schema = {
  name: ['string', 15],
  age: ['number', 3]
}

// db.makeTable('person', schema)
//
// db.save({
//   name: 'John',
//   age: 25
// }).then((id) => {
//   db.load(id)
// })
