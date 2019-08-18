const router = require('express').Router()
const {Topic, User} = require('../../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const topics = await Topic.findAll()
    res.json(topics)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      where: {
        id: req.body.id
      },
      include: [{model: Topic}]
    })

    await foundUser.addTopics(req.body.topics)
    res.sendStatus(202)
  } catch (error) {
    next(error)
  }
})

router.delete('/edit', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      where: {
        id: req.body.id
      },
      include: [{model: Topic}]
    })

    await foundUser.removeTopics(req.body.topics)
  } catch (error) {
    next(error)
  }
})
