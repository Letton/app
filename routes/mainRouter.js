const express = require("express")
const mainRouter = express.Router()
const db = require("../db")
const jwt = require('jsonwebtoken')
const { SALT } = require('../config')

const authorization = (req, res, next) => {
    try {
        req.login = jwt.verify(req.cookies.token, SALT).login;
    } catch (e) {}
    next()
}

mainRouter.use(authorization)

mainRouter.get("/", async (req, res) => {
    const docs = await db.get().collection('posts').find().toArray()
    res.render('main/index', {route: 'main', user: req.login, posts: docs})
    
})

mainRouter.get("/users", async (req, res) => {
    const docs = await db.get().collection('users').find().toArray()
    res.render('main/users', {route: 'main', user: req.login, users: docs})
    
})

module.exports = mainRouter