const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const configRoutes = require('./routes');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Logger Middleware
let visit = 0
let counter = new Map()

var middlew = function (req, res, next) { 
  visit++
  
  url = req.originalUrl

  if(counter.has(url)){
    counter.set(url, counter.get(url) + 1)
  }
  else{
    counter.set(url, 1)
  }

  console.log('--------------------------------- LOGGING MIDDLEWARE -------------------------------------')
  console.log('Total number of requests to the server: ' + visit)
  console.log('URL: ' + url + ' ')
  console.log('HTTP_Verb: ' + req.method)
  console.log('Request_Body: ' + JSON.stringify(req.body))
  
  counter.forEach(function(value, key){
    console.log(key + ' -> ' + value)
  })
  next()
}



app.use(middlew)
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});