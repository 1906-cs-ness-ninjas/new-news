const router = require('express').Router()
const {bbcArticles, User, Topic} = require('../../db/models')
const Sequelize = require('sequelize')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const articles = await bbcArticles.findAll()
    res.json(articles)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId
      },
      include: [{model: Topic}]
    })
    // res.json(user)
    const topics = []
    user.topics.forEach(element => topics.push(element.name.toLowerCase()))
    const articles = await bbcArticles.findAll({
      where: {
        category: topics
      }
    })
    res.json(articles)
  } catch (err) {
    next(err)
  }
})
