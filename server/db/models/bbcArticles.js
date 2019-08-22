const Sequelize = require('sequelize')
const db = require('../db')

const bbcArticles = db.define('articles', {
  title: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  imageUrl: {
    type: Sequelize.STRING
  },
  article: {
    type: Sequelize.TEXT
  },
  favorited: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  category: {
    type: Sequelize.STRING
  }
})

module.exports = bbcArticles
