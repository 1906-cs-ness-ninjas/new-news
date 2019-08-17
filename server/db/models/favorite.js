const Sequelize = require('sequelize')
const db = require('../db')

const Favorite = db.define('favorite', {
  website: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  }
})

module.exports = Favorite
