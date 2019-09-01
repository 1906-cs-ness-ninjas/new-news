const cheerio = require('cheerio')
const {bbcArticles} = require('../db/models')

async function scrapeBBCHeadlines(page) {
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
      let subArr = []
      $(element.children).each((idx, el) => {
        try {
          // in case el.children[0] is undefined
          if (!el.data) {
            subArr.push(el.children[0].data)
          } else {
            subArr.push(el.data)
          }
        } catch (error) {
          console.log('bbc p tag error')
        }
      })
      arr.push(subArr.join(' '))
    })
    const articleStr = arr.join('/n')
    let imageUrl
    if ($('.story-body').find('img')[0]) {
      imageUrl = $('.story-body').find('img')[0].attribs.src
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

module.exports = {scrapeBBCArticles, scrapeBBCHeadlines}
