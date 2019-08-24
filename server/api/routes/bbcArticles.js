const router = require('express').Router()
const {bbcArticles, User, Topic, Favorite} = require('../../db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
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
      include: [{model: Topic}, {model: Favorite}]
    })

    const topics = []
    let articlesArr = []
    user.topics.forEach(element => topics.push(element.name.toLowerCase()))

    user.favorites.forEach(async element => {
      let articles = bbcArticles.findAll({
        where: {
          category: topics,
          url: {[Op.like]: '%' + element.website.split('.')[1] + '%'}
        }
      })
      articlesArr = articlesArr.concat(articles)

    })
    
    let allArticles = await Promise.all(articlesArr)
    const finalArray = []
    for (let i = 0; i < allArticles.length; i++) {
      let favArticles = allArticles[i]
      for (let j = 0; j < favArticles.length; j++) {
        finalArray.push(favArticles[j])
      }
    }

    res.send(finalArray)
  } catch (err) {
    next(err)
  }
})
