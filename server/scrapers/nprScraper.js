const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const {bbcArticles} = require('../db/models')

async function scrapeNPRHeadlines(page) {
  await page.goto('https://www.npr.org/', {
    timeout: 0
  })
  const html = await page.content()
  const $ = cheerio.load(html)
  const headlines = $('.story-wrap')
    .map((index, element) => {
      const bodyElement = $(element).find('.story-text')
      const imageElement = $(element).find('.img')
      let imageUrl = $(imageElement).attr('src')
      const title = $(bodyElement)
        .find('.title')
        .text()

      const aTag = $(bodyElement).find('a')

      let url = aTag['1'] && aTag['1'].attribs.href

      let category = ''

      if (/(Asia|Europe|National|World)/i.test($(aTag[0]).text())) {
        category = ['world']
      } else {
        category = $(aTag[0])
          .text()
          .toLowerCase()
          .trim()
          .match(
            /(science|sports|technology|world|politics|environment|business)/i
          ) || ['miscellaneous']
      }

      if (title && imageUrl && url) {
        return {title, imageUrl, url, category: category[0]}
      }
    })
    .get()
  return headlines
}
async function scrapeNPRArticles(headlines, page) {
  for (var i = 0; i < headlines.length; i++) {
    await page.goto(headlines[i].url, {
      timeout: 0
    })
    const html = await page.content()
    const $ = cheerio.load(html)
    const article = $('.storytext').text()
    await page.waitFor(5000)
    headlines[i].article = article || 'Not found'

    bbcArticles.create(headlines[i])
  }
}

module.exports = {scrapeNPRArticles, scrapeNPRHeadlines}
