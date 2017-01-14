const DB = require('./dist/diamond').DB
const Q = require('./Q')
const http = require('http')

const headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 60 // Seconds.
};
const port = process.env.PORT || 2020
const ip = '127.0.0.1'

const db = new DB()
const q = new Q(db)

console.log('DiamondDB initializing...')
db.init().then(() => {
  console.log('Initialized, starting server...')
  const server = http.createServer(requestHandler);
  server.listen(port, ip);
  console.log('Server started...')
  q.start()
})


function requestHandler(req, res){
  res.writeHead(200, headers);
  retrieveData(req, function(data){
    if(req.url === '/query'){
      q.register(data, (result) => {
        res.end(JSON.stringify(result))
      })
    } else {
      req.end()
    }
  })
}

function retrieveData(request, cb){
  let result = ''
  request.on('data', (chunk) => {
        result += chunk.toString();
    });
  request.on('end', () => {
    cb(JSON.parse(result));
  })
}
