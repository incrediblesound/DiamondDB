DiamondDB
=========
DiamondDB was a 24hr hackathon I did after accidentally drinking an espresso fused hot chocolate in the late afternoon. Because I only drink very small amounts of caffeine, the drink had an intense effect and I was incredibly motivated to write a database.

How it Works
------------
DiamondDB uses schemas that specify the character length of each field in a record. There's one schema per table, and the records are stored in a single line in paged files. Because the length of each record is the same you can just do a little bit of math to find a record in its file.

How to Use
----------
DiamondDB is written is futuristic JavaScript so you'll need to run
`npm install`
and
`webpack`
to build the package. Then you can run `mkdir data` to make the folder for storing records and
```shell
node server
```
which will give you some nice messages telling you that there is a server listening for requests and a queue waiting for jobs. Next you can POST some JSON to `localhost:2020` to interact with the database. Here are some examples.

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

Contributing
------------
If you think DiamondDB is worth contributing to (still an open question) then feel free to open issues! I don't think Node.js is really well suited to running a database, but it is a fun project and I hope the code is simple and easy to understand.
