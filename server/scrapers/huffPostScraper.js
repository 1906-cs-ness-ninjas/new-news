const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const db = require('../db')
const {User, Favorite, Topic, bbcArticles} = require('../db/models')

async function scrapeHuffPostHeadlines(page) {
  const pageUrl = 'https://www.huffpost.com/'
  await page.goto('https://www.huffpost.com/', {
    timeout: 0
  })
  const html = await page.content()
  const $ = cheerio.load(html)
  const headlines = $('.zone__content')
    .map((index, element) => {
      const bodyElement = $(element).find('.card__content')
      const outterImageElement = $(bodyElement).find('.card__image__src')
      const imageUrl = $(outterImageElement).attr('src')
      const headerElement = $(bodyElement).find('.card__image__wrapper')
      const title = $(headerElement).attr('aria-label')

      const url = $(headerElement).attr('href')

      if (title && url && imageUrl) {
        return {title, url, imageUrl}
      }
    })
    .get()
  return headlines
}
async function scrapeHuffPostArticles(headlines, page) {
  for (var i = 0; i < headlines.length; i++) {
    // const browser = await puppeteer.launch({ headless: false});
    // const page = await browser.newPage();
    // console.log(headlines[i].url)
    await page.goto(headlines[i].url, {
      timeout: 0
    })
    await page.waitFor(5000)
    const html = await page.content()
    const $ = cheerio.load(html)
    const article = $('.content-list-component').text()
    headlines[i].article = article || 'Not Found'
    const tag = $('.entry-eyebrow__link')
      .text()
      .trim()
      .toLowerCase()

    const category = tag.match(
      /(science|sports|technology|world|politics)/i
    ) || ['miscellaneous']
    // console.log('********CATEGORY', category)
    // console.log('********TAG', tag)
    headlines[i].category = category[0]
    // console.log(headlines)
    bbcArticles.create(headlines[i])
  }
}

module.exports = {scrapeHuffPostArticles, scrapeHuffPostHeadlines}
