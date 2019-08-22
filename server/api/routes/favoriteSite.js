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

router.post('/', async (req, res, next) => {
  try {
    const {url, userId} = req.body
    console.log(req.body)
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
