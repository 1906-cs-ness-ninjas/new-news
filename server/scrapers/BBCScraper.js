const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const db = require('../db')
const {User, Favorite, Topic, bbcArticles} = require('../db/models')

// console.log(`seeded ${users.length} users`)
console.log(`seeded successfully`)

async function srapeBBCHeadlines(page) {
  const checkDuplicateCache = {}
  const pageUrl = 'https://www.bbc.com'
  await page.goto('https://www.bbc.com/news', {
    timeout: 0
  })
  const html = await page.content()
  const $ = cheerio.load(html)
  const headlines = []
  $('.gs-c-promo')
    .each((index, element) => {
      const bodyElement = $(element).find('.gs-c-promo-body')
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

      if ($(headerElement).attr('href') && !checkDuplicateCache[title]) {
        headlines.push({title, url, category: category[0]})
        checkDuplicateCache[title] = true
      }
    })
    .get()
  return headlines
}

async function scrapeBBCArticles(headlines, page) {
  let articles = []
  for (let i = 0; i < headlines.length; i++) {
    await page.goto(headlines[i].url, {
      timeout: 0
    })
    const html = await page.content()
    const $ = cheerio.load(html)
    let header = $('.story-body__inner')
    let arr = []
    header.find('p').each((i, element) => {
      if (element.children[0]) {
        arr.push(element.children[0].data)
      }
    })
    const articleStr = arr.join('/n')
    const imgElement = $(
      '#page > div:nth-child(1) > div.container > div > div.column--primary > div.story-body > div.story-body__inner > figure > span > img'
    )

    let imageUrl
    console.log(imgElement.attr('src'))

    console.log(Object.keys(val.options))
    // .find('img'))
    // console.log($($('.p_holding_image')[0]).attr('src'), "$$$$")
    console.log('.....................')
    if (imgElement) {
      imageUrl = $(imgElement).attr('src')
    } else {
      imageUrl = $($('.p_holding_image')[0]).attr('src')
    }

    // await page.waitFor(5000)
    headlines[i].article = articleStr || 'Not found'
    headlines[i].imageUrl = imageUrl || 'No image'
    if (
      headlines[i].imageUrl === 'No image' ||
      headlines[i].article === 'Not found'
    ) {
      continue
    }

    articles.push(bbcArticles.create(headlines[i]))
  }
  await Promise.all(articles)
}

module.exports = {scrapeBBCArticles, srapeBBCHeadlines}
