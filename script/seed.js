'use strict'

const db = require('../server/db')
const {User, Favorite, Topic, bbcArticles} = require('../server/db/models')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const topics = [
  {name: 'Science'},
  {name: 'Sport'},
  {name: 'Tech'},
  {name: 'Fashion'},
  {name: 'Politics'}
]

const sites = [
  {website: 'https://www.bbc.com'},
  {website: 'https://www.huffpost.com/'},
  {website: 'https://news.yahoo.com/'}
]

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()

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

  const headlines = await srapeHeadlines(page)
  await scrapeArticles(headlines, page)

  // console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}
async function srapeHeadlines(page) {
  const pageUrl = 'https://www.bbc.com'
  await page.goto('https://www.bbc.com/news')
  const html = await page.content()
  const $ = cheerio.load(html)
  const headlines = $('.gs-c-promo')
    .map((index, element) => {
      const bodyElement = $(element).find('.gs-c-promo-body')
      const imageElement = $(element).find('.gs-c-promo-image')
      const headerElement = $(bodyElement).find('.gs-c-promo-heading')
      const titleElement = $(element).find('.gs-c-promo-heading__title')
      const url = pageUrl.concat($(headerElement).attr('href'))
      const title = $(titleElement).text()
      return {title, url}
    })
    .get()
  return headlines
}
async function scrapeArticles(headlines, page) {
  for (var i = 0; i < headlines.length; i++) {
    // const browser = await puppeteer.launch({ headless: false});
    // const page = await browser.newPage();
    console.log(headlines[i].url)
    await page.goto(headlines[i].url)
    const html = await page.content()
    const $ = cheerio.load(html)
    const article = $('.story-body__inner').text()
    const imgElement = $(
      '#page > div:nth-child(1) > div.container > div > div.column--primary > div.story-body > div.story-body__inner > figure > span > img'
    )
    const imageUrl = $(imgElement).attr('src')
    headlines[i].article = article
    headlines[i].imageUrl = imageUrl || 'No image'
    console.log(headlines)
    bbcArticles.create(headlines[i])
  }
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
