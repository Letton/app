const express = require("express")
const adminRouter = express.Router()
const db = require("../db")
const jwt = require('jsonwebtoken')
const { SALT } = require('../config')
var striptags = require('striptags')

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
        res.status(403).render('errors/403')
    } else if (doc.role != 'admin') {
        res.status(403).render('errors/403')
    } else {
        const posts = await db.get().collection('posts').find().toArray()
        res.render('admin/index', {route: 'admin', user: req.login, posts: posts})
    }
})

adminRouter.get("/add", async (req, res) => {
    const doc = await db.get().collection('users').findOne({login: req.login})
    if (!doc) {
        res.status(403).render('errors/403')
    } else if (doc.role != 'admin') {
        res.status(403).render('errors/403')
    } else {
        res.render('admin/add', {route: 'admin', user: req.login})
    }
})

adminRouter.post("/add", async (req, res) => {
    const doc = await db.get().collection('users').findOne({login: req.login})
    if (!doc) {
        res.status(403).render('errors/403')
    } else if (doc.role != 'admin') {
        res.status(403).render('errors/403')
    } else {
        let {title, description, text} = req.body
        text = striptags(text, ['strong', 'h2', 'h3', 'h4', 'a', 'p', 'i', 'ol', 'ul', 'li', 'blockquote', 'br'])
        const post = {
            number: (await db.get().collection('posts').find().toArray()).length,
            title: title,
            description: description,
            text: text,
            author: req.login,
            creationDate: new Date()
        }
        const status = await db.get().collection('posts').insertOne(post)
        res.redirect('/admin')
    }
})

adminRouter.get("/delete/:id", async (req, res) => {
    const user = await db.get().collection('users').findOne({login: req.login})
    if (user.role != 'admin') {
        res.status(403).render('errors/403')
    } else {
        const doc = await db.get().collection('posts').findOne({number: parseInt(req.params.id)})
        if (!doc) {
            res.status(404).render('errors/404')
        } else {
            db.get().collection('posts').deleteOne({number: parseInt(req.params.id)})
            res.redirect('/admin')
        }
    }
})

module.exports = adminRouter