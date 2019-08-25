const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const db = require('../db')
const {bbcArticles} = require('../db/models')

// console.log(`seeded ${users.length} users`)
console.log(`seeded successfully`)

async function scrapeFoxHeadlines(page) {
  await page.goto('https://www.foxnews.com/', {
    timeout: 0
  })
  const html = await page.content()
  const $ = cheerio.load(html)
  const headlines = $('.content')
    // eslint-disable-next-line complexity
    .map((index, element) => {
      const singleArticle = $(element).find('article')
      const bodyElement = $(singleArticle).find('.title')
      const title = $(bodyElement)
        .text()
        .trim()
      const urlElement = $(bodyElement).find('a')
      let url = $(urlElement).attr('href')
      if (url) {
        if (!/https:/.test(url)) {
          url = 'https:' + $(urlElement).attr('href')
        }
      }
      const imageElement = $(singleArticle).find('.m')
      const imageSource = $(imageElement).find('img')
      const imageUrl = 'https' + $(imageSource).attr('src')

      let category, tag
      if (url) {
        tag = url.replace(/.*\/(.*?)\/.*/g, '$1')
        category = tag.match(
          /(science|sports|tech|world|politics|environment|business|us|media)/i
        ) || ['miscellaneous']
      }
      if (title && $(urlElement).attr('href') && imageUrl && category) {
        return {title, url, imageUrl, category: category[0]}
      }
    })
    .get()
  return headlines
}
async function scrapeFoxArticles(headlines, page) {
  for (var i = 0; i < headlines.length; i++) {
    await page.goto(headlines[i].url, {
      timeout: 0
    })
    const html = await page.content()
    const $ = cheerio.load(html)
    const article = $('.article-body')
      .text()
      .trim()
    headlines[i].article = article
    bbcArticles.create(headlines[i])
  }
}

module.exports = {scrapeFoxArticles, scrapeFoxHeadlines}
