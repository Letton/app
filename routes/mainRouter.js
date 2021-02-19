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
    res.render('main/index', {route: 'main', user: req.login, error: null})
    
})

mainRouter.get("/work", async (req, res) => {
    res.render('main/work', {route: 'main', user: req.login, error: null})
    
})

mainRouter.get("/blog", async (req, res) => {
    res.render('main/blog', {route: 'main', user: req.login, error: null})
    
})


module.exports = mainRouter