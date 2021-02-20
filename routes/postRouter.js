const express = require("express")
const postsRouter = express.Router()
const db = require("../db")
const jwt = require('jsonwebtoken')
const { SALT } = require('../config')

const authorization = (req, res, next) => {
    try {
        req.login = jwt.verify(req.cookies.token, SALT).login;
    } catch (e) {}
    next()
}

postsRouter.use(authorization)

postsRouter.get("/:id", async (req, res) => {
    const doc = await db.get().collection('posts').findOne({number: parseInt(req.params.id)})

    if (!doc) {
        res.status(404).render('errors/404')
    } else {
        res.render('post/index', {route: 'post', post: doc, user: req.login})
    }
})


module.exports = postsRouter