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

    await foundUser.addTopic(req.body.topic)
    res.sendStatus(202)
  } catch (error) {
    next(error)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      where: {
        id: req.body.id
      },
      include: [{model: Topic}]
    })

    await foundUser.removeTopic(req.body.topic)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

router.get('/:userId', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      where: {
        id: req.params.userId
      },
      include: [{model: Topic}]
    })
    res.send(foundUser.topics.map(topic => topic.id))
  } catch (error) {
    next(error)
  }
})
