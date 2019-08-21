const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const db = require('../db')
const {User, Favorite, Topic, bbcArticles} = require('../db/models')

// console.log(`seeded ${users.length} users`)
console.log(`seeded successfully`)

async function srapeBBCHeadlines(page) {
  const pageUrl = 'https://www.bbc.com'
  await page.goto('https://www.bbc.com/news', {
    timeout: 0
  })
  const html = await page.content()
  const $ = cheerio.load(html)
  const headlines = $('.gs-c-promo')
    .map((index, element) => {
      const bodyElement = $(element).find('.gs-c-promo-body')
      const imageElement = $(element).find('.gs-c-promo-image')
      const headerElement = $(bodyElement).find('.gs-c-promo-heading')
      const titleElement = $(element).find('.gs-c-promo-heading__title')

      let url = ''
      if (/https:/.test($(headerElement).attr('href'))) {
        url = $(headerElement).attr('href')
      } else {
        url = pageUrl.concat($(headerElement).attr('href'))
      }

      const category = url.match(
        /(science|sports|technology|world|politics)/i
      ) || ['miscellaneous']
      const title = $(titleElement).text()

      return {title, url, category: category[0]}
    })
    .get()
  return headlines
}
async function scrapeBBCArticles(headlines, page) {
  for (var i = 0; i < headlines.length; i++) {
    // const browser = await puppeteer.launch({ headless: false});
    // const page = await browser.newPage();
    // console.log(headlines[i].url)
    await page.goto(headlines[i].url, {
      timeout: 0
    })
    const html = await page.content()
    const $ = cheerio.load(html)
    const article = $('.story-body__inner').text()
    const imgElement = $(
      '#page > div:nth-child(1) > div.container > div > div.column--primary > div.story-body > div.story-body__inner > figure > span > img'
    )
    const imageUrl = $(imgElement).attr('src')
    await page.waitFor(5000)
    headlines[i].article = article || 'Not found'
    headlines[i].imageUrl = imageUrl || 'No image'
    if (
      headlines[i].imageUrl === 'No image' ||
      headlines[i].imageUrl === 'Not found'
    ) {
      continue
    }

    bbcArticles.create(headlines[i])
  }
}

module.exports = {scrapeBBCArticles, srapeBBCHeadlines}
