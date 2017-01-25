DiamondDB
=========
DiamondDB is a modular database system for Node.js. It consists of three parts: the database, the cache, and the persistence layer. The database is the controller of the system: the client interacts directly with the database module which in turn communicates with the cache and the persistence layer via a [standard set of messages](https://github.com/incrediblesound/DiamondDB/blob/master/src/common/operations.js). This makes it easy to switch out the cache or persistence layer with a module of your own. The cache and persistence modules that the database accepts can interface with any other library so long as they implement the message interface correctly. Below is an overview of the included modules.

Database
------------
The DiamondDB database uses schemas that specify the character length of each field in a record. There's one schema per table, and the database validates records for incorrect keys and record size. The database currently has three basic methods: fetchRecord saveRecord and makeTable.

**Make Table**   
Make table takes a table name and a schema. The table object is stored on the database module and a blocking message is sent to the persistence layer to save the table metadata to disk. That the persistence of tables is blocking and not asynchronous was a relatively arbitrary decision and may be changed in the future.

**Save Record**   
Save record first validates the record to be saved, sends a storeRecord message to the cache and then a storeRecord message to the persistence layer. Saving records is asynchronous but the record with its generated id is returned irrespective of what happens with the persistence layer.

**Fetch Record**   
Fetch record takes a table name and an id and returns the record with that id or null if not found. The database returns an error if the id is out of range for the table. The fetchRecord method first sends a fetchRecord message to the cache module. If the cache module returns a success message with data, then that message is returned. If not, a fetchRecord message is sent to the persistence module, a storeRecord message is sent to the cache, and finally the return value from the message sent to the persistence module is returned.

Cache
------
The cache module included with DiamondDB is pretty rudimentary and provides a basic way to limit reads from the file system. Basically it is just a map where each database table points to a tree-PLRU data structure.

Store
-----
The persistence module included with DiamondDB is a simple Node.js implementation that saves records in a single string in paged files. Because schemas are fixed size and there is a fixed number of records per page it just takes is a little bit of math to find the page, load the file into memory, and extract the data corresponding to a given record.

How to Use
----------
DiamondDB takes advantage of features in the most current version of Node. The main interface is `src/main.js` and requires one package (bluebird) so you'll have to run `npm install`. If you are using an earlier version of Node, you can run `webpack` to build the package for earlier versions, which will then be located in `dist/diamond.js`.

Before starting the database run `mkdir data` to make the folder for storing records. Here is an example of how to configure DiamondDB:
```javascript
const diamond = require('./src/main')

/* use the included store module */
const store = new diamond.Store()

/* use the included cache module */
const cache = new diamond.Cache({ size: 8 }) // size must be a power of 2

/* create a database instance with our cache and store modules */
const db = new diamond.Database({
  store,
  cache
})

/* initialize the db and configure it to write to disk every five seconds */
db.init({
  persist: 5000
})
```
There is also a server included that accepts the following POST requests for testing purposes. Here are some example queries for using that server:

This query creates a new table called "people" that has a schema with a fifteen character long name field and a three character long age field. If it succeeds, you'll get a `1` back. The number one means "I did it!" in computer speak:
```javascript
{
"operation":"TABLE_CREATE",
  "data": {
    "name": "people",
    "schema": {
      "name": ["string", 15],
      "age": ["number", 3]
    }
  }
}
```

This query saves the record contained in the "body" field of the post to the "people" table. It will return the ID of the saved record:
```javascript
{
"operation":"SAVE",
  "data": {
  	"table": "people",
  	"body": {
  		"name": "Abby",
  		"age": 29
  	}
  }
}
```

This query fetches and returns the record from the "people" table with the ID of 6:
```javascript
{
"operation":"FETCH",
  "data": {
	"table": "people",
	"id": 6
  }
}
```
