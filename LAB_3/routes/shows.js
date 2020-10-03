const express = require('express');
const redis = require('redis')
const axios = require('axios')
const app = express();
const client = redis.createClient()
const bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//connect to redis server
client.on('connect', () => {
  console.log('Connected to Redis...')
})

//clean the cache data before running the application
client.flushdb(function (err, succeeded) {
  console.log(succeeded); // will be true if successfull
});


//homepage
app.get('/', async (req, res) => {

  try {
    let reply = await client.getAsync('shows')

    if (reply) {
      console.log('Sending from Cache.....')
      res.send(reply)
      return
    }

    let {data} = await axios.get('http://api.tvmaze.com/shows')

    if (data.length == 0){
      res.render('shows', {error: 'URL has NO Data'})
      return
    }

    res.render('shows', {shows: data}, async(err, page) => {
      if (err) throw err
      await client.setAsync('shows', page)
      console.log('Data is now Cached.....')
      res.send(page)
    })
  } catch (e) {
    console.log(e)
    res.status(404).send(e.message)
  }
})


//particular show ID
app.get('/show/:id', async (req, res) => {

  try {
    let {id} = req.params
    let reply = await client.getAsync(id)

    if (reply) {
      console.log('Sending from Cache.....')
      res.send(reply)
      return
    }

    let {data} = await axios.get(`http://api.tvmaze.com/shows/${id}`)

    res.render('showsId', data, async(err, page) => {
      if (err) throw err
      await client.setAsync(id, page)
      console.log('Data is now Cached.....')
      res.send(page)
    })
  } catch (e) {
    console.log(e)
    res.status(404).send(e.message)
  }
})


//return to homepage
app.get('/back', async(req, res) => {
  res.redirect('/')
})


//search a keyword
app.post('/search', async(req, res) => {
  try{
    let {search} = req.body

    if(!search.trim()){
      res.render('searchResult', {error: 'Input fields are Empty'})
      return
    }
    else{
      let inScoreBoard = await client.zrankAsync('searching', search.toLowerCase())

      if (inScoreBoard != null){
        await client.zincrby('searching', 1, search.toLowerCase())
      }
      else{
        await client.zaddAsync('searching', 1, search.toLowerCase())
      }

      let reply = await client.getAsync(search.toLowerCase())

      if(reply){
        console.log('Sending from Cache.....')
        res.send(reply)
        return
      }
      
      let {data} = await axios.get(`http://api.tvmaze.com/search/shows?q=${search}`)

      if (data.length == 0){
        res.render('searchResult', {error: 'No results for the search term'})
        return
      }
      res.render('searchResult', {lt: data}, async(err, page) => {
        if (err) throw err
        await client.setAsync(search.toLowerCase(), page)
        console.log('Data is now Cached....')
        res.send(page)
      })
    }
  } catch(e){
    res.status(404).send(e.message)
  }
})


//popular search
app.get('/popularsearches', async(req, res) => {
  let top = await client.zrevrangeAsync('searching', 0, 9)

  res.render('popularSearch', {popular: top})
})




module.exports = app