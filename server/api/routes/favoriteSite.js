const router = require('express').Router()
const {Favorite, User} = require('../../db/models')

module.exports = router

// router.get('/:userId', async (req, res, next) => {
//   try {
//     const user = await User.findOne({
//         where: {
//             id: req.params.userId
//         },
//         include: [{model: Favorite}]
//     });

//   }
//   catch(error) {
//     next(error);
//   }
// })

router.get('/:userId', async (req, res, next) => {
  try {
    const [sites] = await User.findAll({
      include: [{model: Favorite}],
      where: {
        id: req.params.userId
      }
    })

    res.json(sites.favorites)
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
      include: [{model: Favorite}]
    })

    await foundUser.removeFavorite(req.body.favorite)
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
  }
})
