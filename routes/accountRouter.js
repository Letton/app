const express = require("express")
const accountRouter = express.Router()
const db = require("../db")
const jwt = require('jsonwebtoken')
const { SALT } = require('../config')
const crypto = require('crypto')
const { accessSync } = require("fs")

const authorization = (req, res, next) => {
    try {
        req.login = jwt.verify(req.cookies.token, SALT).login;
    } catch (e) {}
    next()
}

accountRouter.use(authorization)


accountRouter.get("/login", async (req, res) => {
    res.render('account/login', {user: req.login, error: null, route: 'account'})
    
})

accountRouter.post("/login", async (req, res) => {
    const doc = await db.get().collection('users').findOne({login: req.body.login})
    if ((!doc) || (doc.password != crypto.createHash('sha256').update(req.body.password).digest('hex'))) {
        res.render('account/login', {user: req.login, error: 'Wrong login or password', route: 'account'})
    } else {
        const token = jwt.sign({ login: req.body.login }, SALT);
        res.cookie('token', token, {
            expires: 0,
        })
        res.redirect('/')
    }
    
})

accountRouter.get("/register", async (req, res) => {
    res.render('account/register', {user: req.login, error: null, route: 'account'})
    
})

accountRouter.post("/register", async (req, res) => {
    const {login, password, repeatPassword} = req.body
    const userIp = req.socket.remoteAddress
    const doc = await db.get().collection('users').findOne({$or: [{ip: userIp}, {login: login}]})
    if (password != repeatPassword) {
        res.render('account/register', {user: req.login, error: 'Password mismatch', route: 'account'})
    } else if (doc) {
        res.render('account/register', {user: req.login, error: 'This ip or login is already registered', route: 'account'})
    } else if (password.length < 5) {
        res.render('account/register', {user: req.login, error: 'Password is too short', route: 'account'})
    } else {
        const user = {
            login: req.body.login,
            password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
            role: 'user',
            ip: req.socket.remoteAddress,
            registrationDate: new Date()
        }
        const status = await db.get().collection('users').insertOne(user)
        const token = jwt.sign({ login: req.body.login }, SALT);
        res.cookie('token', token, {
            expires: 0,
        })
        res.redirect('/')
    }  
})

accountRouter.get("/profile", async (req, res) => {
    if (req.login) {
        const doc = await db.get().collection('users').findOne({login: req.login})
        res.render('account/index.ejs', {user: doc.login, userData: doc, route: 'account'})
    } else {
        res.status;(403).render('errors/403', {user: req.login, route: 'account'})
    }
})

accountRouter.get("/logout", async (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
    
})

accountRouter.get("/:id", async (req, res) => {
    const doc = await db.get().collection('users').findOne({login: req.params.id})
    if (!doc) {
        res.status(404).render('errors/404', {user: req.login, route: 'account'})
    } else {
        res.render('account/user.ejs', {user: doc.login, userData: doc, route: 'account'})
    }
})


module.exports = accountRouter