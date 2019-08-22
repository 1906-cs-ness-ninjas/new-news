'use strict'

const db = require('../server/db')
const {User, Favorite, Topic, bbcArticles} = require('../server/db/models')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const {scrapeBBCArticles} = require('../server/scrapers/BBCScraper')
const {srapeBBCHeadlines} = require('../server/scrapers/BBCScraper')
const {scrapeHuffPostHeadlines} = require('../server/scrapers/huffPostscraper')
const {scrapeHuffPostArticles} = require('../server/scrapers/huffPostscraper')
const {scrapeNPRHeadlines} = require('../server/scrapers/nprScraper')
const {scrapeNPRArticles} = require('../server/scrapers/nprScraper')

const topics = [
  {name: 'science'},
  {name: 'sports'},
  {name: 'tech'},
  {name: 'world'},
  {name: 'politics'}
]

const sites = [
  {website: 'https://www.bbc.com'},
  {website: 'https://www.huffpost.com/'},
  {website: 'https://news.yahoo.com/'},
  {website: 'https://www.npr.org/'}
]

async function seed() {
  await db.sync({force: false})
  console.log('db synced!')

  // const browser = await puppeteer.launch({headless: false})
  // try {
  //   const page = await browser.newPage()
  //   //!NPR Scraper
  //   const NPRHeadlines = await scrapeNPRHeadlines(page)
  //   await scrapeNPRArticles(NPRHeadlines, page)
  //   //!HUffpost Scraper
  //   const HPheadlines = await scrapeHuffPostHeadlines(page)
  //   await scrapeHuffPostArticles(HPheadlines, page)
  //   // //!BBC Scraper
  //   const BBCheadlines = await srapeBBCHeadlines(page)
  //   await scrapeBBCArticles(BBCheadlines, page)
  // } catch (error) {
  //   console.log(error)
  // } finally {
  //   await browser.close()
  // }

  await Promise.all([
    User.create({email: 'bob@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])

  await Promise.all(
    sites.map(site => {
      return Favorite.create(site)
    })
  )

  await Promise.all(
    topics.map(topic => {
      return Topic.create(topic)
    })
  )
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
