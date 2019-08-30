'use strict'

const db = require('../server/db')
const {
  scrapeBBCArticles,
  scrapeBBCHeadlines
} = require('../server/scrapers/BBCScraper')
const {
  scrapeHuffPostHeadlines,
  scrapeHuffPostArticles
} = require('../server/scrapers/huffPostscraper')
const {
  scrapeNPRHeadlines,
  scrapeNPRArticles
} = require('../server/scrapers/nprScraper')
const {
  scrapeFoxHeadlines,
  scrapeFoxArticles
} = require('../server/scrapers/foxScraper')
const {bbcArticles} = require('../server/db/models')

const puppeteer = require('puppeteer')

async function scrape() {
  await db.sync({force: false})
  // bbcArticles.destroy({
  //   where: {},
  //   truncate: true,
  //   force: true
  // })
  console.log('db synced!')
  const browser = await puppeteer.launch({headless: false})
  try {
    const page = await browser.newPage()
    /*!NPR Scraper*/
    const NPRHeadlines = await scrapeNPRHeadlines(page)
    await scrapeNPRArticles(NPRHeadlines, page)

    /*!Fox Scraper*/
    const Foxheadlines = await scrapeFoxHeadlines(page)
    await scrapeFoxArticles(Foxheadlines, page)

    /*!HUffpost Scraper*/
    const HPheadlines = await scrapeHuffPostHeadlines(page)
    await scrapeHuffPostArticles(HPheadlines, page)

    /*!BBC Scraper */
    const BBCheadlines = await scrapeBBCHeadlines(page)
    await scrapeBBCArticles(BBCheadlines, page)
  } catch (error) {
    console.log(error)
  } finally {
    await browser.close()
  }
}

async function runScrape() {
  console.log('scraping...')
  try {
    await scrape()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runScrape()
}

module.exports = scrape
