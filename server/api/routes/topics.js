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
    console.log('****FOUND USER', foundUser)
    await foundUser.addTopics(['1', '2'])
    res.sendStatus(202)
  } catch (error) {
    next(error)
  }
})
