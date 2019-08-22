const router = require('express').Router()
module.exports = router

router.use('/users', require('./routes/users'))

router.use('/topics', require('./routes/topics'))

router.use('/bbcArticles', require('./routes/bbcArticles'))

router.use('/favoriteSite', require('./routes/favoriteSite'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
