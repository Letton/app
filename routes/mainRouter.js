const express = require("express")
const mainRouter = express.Router()
const db = require("../db")
const jwt = require('jsonwebtoken')
const { SALT } = require('../config')
const https = require('https')

const authorization = (req, res, next) => {
    try {
        req.login = jwt.verify(req.cookies.token, SALT).login;
    } catch (e) {}
    next()
}

mainRouter.use(authorization)

mainRouter.get("/", async (req, res) => {
    const docs = (await db.get().collection('posts').find().toArray()).reverse()
    res.render('main/index', {route: 'main', user: req.login, posts: docs})
    
})

mainRouter.get("/users", async (req, res) => {
    const docs = await db.get().collection('users').find().toArray()
    res.render('main/users', {route: 'main', user: req.login, users: docs})
    
})

mainRouter.get("/news", async (req, res) => {
    https.get('https://newsapi.org/v2/top-headlines?country=ru&apiKey=720175800a3244bebd813868caf9355b', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
            const news = JSON.parse(data)
            res.render('main/news', {route: 'main', user: req.login, news: news.articles})
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
})

module.exports = mainRouter