const express = require("express")
const adminRouter = express.Router()
const db = require("../db")
const jwt = require('jsonwebtoken')
const { SALT } = require('../config')

const authorization = (req, res, next) => {
    try {
        req.login = jwt.verify(req.cookies.token, SALT).login;
    } catch (e) {}
    next()
}

adminRouter.use(authorization)

adminRouter.get("/", async (req, res) => {
    const doc = await db.get().collection('users').findOne({login: req.login})
    if (!doc) {
        res.render('errors/403')
    } else if (doc.role != 'admin') {
        res.render('errors/403')
    } else {
        res.render('admin/index', {route: 'admin', user: req.login})
    }
})

adminRouter.get("/add", async (req, res) => {
    const doc = await db.get().collection('users').findOne({login: req.login})
    if (!doc) {
        res.render('errors/403')
    } else if (doc.role != 'admin') {
        res.render('errors/403')
    } else {
        res.render('admin/add', {route: 'admin', user: req.login})
    }
})

adminRouter.post("/add", async (req, res) => {
    const doc = await db.get().collection('users').findOne({login: req.login})
    if (!doc) {
        res.render('errors/403')
    } else if (doc.role != 'admin') {
        res.render('errors/403')
    } else {
        const {title, text} = req.body
        const post = {
            number: (await db.get().collection('posts').find().toArray()).length,
            title: title,
            text: text,
            creationDate: new Date()
        }
        const status = await db.get().collection('posts').insertOne(post)
        res.redirect('/admin')
    }
})


module.exports = adminRouter