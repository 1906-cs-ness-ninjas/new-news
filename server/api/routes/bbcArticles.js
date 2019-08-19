const router = require('express').Router()
const {bbcArticles} = require('../../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const articles = await bbcArticles.findAll()
    res.json(articles)
  } catch (err) {
    next(err)
  }
})
