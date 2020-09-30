const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.render('movie')
});

module.exports = app