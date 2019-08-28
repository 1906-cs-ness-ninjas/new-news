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

router.get('/:userId/favArticles', async (req, res, next) => {
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

router.get('/:userId/recArticles', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId
      },
      include: [{model: Favorite}]
    })

    const recommendEngine = {
      bbc: true,
      foxnews: true,
      npr: true,
      huffpost: true
    }

    let allArticles = []
    user.favorites.forEach(favorite => {
      const fav = favorite.dataValues.website.split('.')[1]
      recommendEngine[fav] = false
    })

    const favWebsite = []
    for (let key in recommendEngine) {
      if (recommendEngine[key]) {
        favWebsite.push(key)
      }
    }

    favWebsite.forEach(site => {
      const articles = bbcArticles.findAll({
        where: {url: {[Op.like]: '%' + site + '%'}}
      })
      allArticles.push(articles)
    })
    const article = await Promise.all(allArticles)
    const finalArray = [].concat.apply([], article)
    res.send(finalArray)
  } catch (err) {
    next(err)
  }
})
