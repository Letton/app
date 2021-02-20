const { MONGO_URL, APP_PORT } = require('./config.js')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mainRouter = require('./routes/mainRouter.js')
const accountRouter = require('./routes/accountRouter.js')
const db = require('./db')
const app = express()
const jwt = require('jsonwebtoken')

app.use(cookieParser())
app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use("/", mainRouter)
app.use("/account", accountRouter)

app.use(function (req, res, next) {
    res.status(404).render('errors/404', {route: 'main', user: req.login})
})


db.connect(MONGO_URL, (err) => {
    if (err) {
        return console.log(err)
    }
    app.listen(APP_PORT, () => {
        console.log(`App listening at http://localhost:${APP_PORT}`)
    })
})

