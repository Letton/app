const { MONGO_URL } = require('./config.js')
const { MongoClient } = require('mongodb')

let state = {
    db: null
}
  
module.exports.connect = (MONGO_URL, done) => {
    if (state.db) {
      return done()
    }
  
    MongoClient.connect(MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        return done(err)
      }
      state.db = client.db('app');
      done()
    })
}


module.exports.get = () => state.db
