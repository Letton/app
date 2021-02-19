const MONGO_USERNAME = 'admin'
const MONGO_PASSWORD = 'Egor1020304050'
const MONGO_HOSTNAME = '3.127.248.220'
const MONGO_PORT = '27017'
const MONGO_DB = 'app'

const SALT = 'UPnJiF9y8h'

const APP_PORT = 3000

const MONGO_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

module.exports.MONGO_URL = MONGO_URL
module.exports.APP_PORT = APP_PORT
module.exports.SALT = SALT