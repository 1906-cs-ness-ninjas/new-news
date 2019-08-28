const router = require('express').Router()
const {Favorite, User} = require('../../db/models')

module.exports = router

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId
      },
      include: [{model: Favorite}]
    })
    res.send(user.favorites)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {url, userId} = req.body
    const user = await User.findOne({
      where: {
        id: userId
      },
      include: [{model: Favorite}]
    })

    const urlId = await Favorite.findOne({
      where: {
        website: url
      },
      attribute: ['id']
    })

    await user.addFavorite(urlId)

    res.send(urlId)
  } catch (error) {
    next(error)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    const {userId} = req.body
    const user = await User.findOne({
      where: {
        id: userId
      },
      include: [{model: Favorite}]
    })

    // const urlId = await Favorite.findOne({
    //   where: {
    //     website: url
    //   },
    //   attribute: ['id']
    // })
    // console.log(req.body.site)
    await user.removeFavorite(req.body.site)

    res.send()
  } catch (error) {
    next(error)
  }
})
