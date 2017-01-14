const DB = require('../dist/diamond').DB
const db = new DB()

db.init().then(() => {
  const schema = {
    name: ['string', 15],
    age: ['number', 3]
  }

  db.loadRecord('person', 0).then(record => { console.log(record)})
  // db.makeTable('person', schema)
  // //
  // db.saveRecord('person', {
  //   name: 'John',
  //   age: 25
  // }).then(id => {
  //     // console.log(record)
  // })
})
