const MongoClient = require('mongodb').MongoClient;

const mongoConfig = {
  serverUrl: 'mongodb://localhost:27017/',
  database: 'Patel-Dhruv-CS554-Lab1'
};

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl,{ useUnifiedTopology: true, useNewUrlParser: true});
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};