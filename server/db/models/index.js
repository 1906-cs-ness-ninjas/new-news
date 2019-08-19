const User = require('./user')
const Favorite = require('./favorite')
const Topic = require('./topic')
const bbcArticles = require('./bbcArticles')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
User.belongsToMany(Favorite, {through: 'User_Favorite'})
Favorite.belongsToMany(User, {through: 'User_Favorite'})

User.belongsToMany(Topic, {through: 'User_Topic'})
Topic.belongsToMany(User, {through: 'User_Topic'})

module.exports = {
  User,
  Favorite,
  Topic,
  bbcArticles
}
