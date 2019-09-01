const cheerio = require('cheerio')
const {bbcArticles} = require('../db/models')

const categories = {
  'goats and soda': 'world',
  'code switch': 'tech',
  elections: 'politics',
  law: 'politics',
  'the salt': 'world'
}

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
      const tag = $(aTag[0])
        .text()
        .toLowerCase()
        .trim()
      if (/(Asia|Europe|National|World)/i.test(tag)) {
        category = 'world'
      } else if (categories[tag]) {
        category = categories[tag]
      } else {
        category = tag
      }

      if (title && imageUrl && url) {
        return {title, imageUrl, url, category}
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
    let article = []
    $('.storytext')
      .find('p')
      .each((i, el) => {
        let subArr = []
        $(el.children).each((idx, element) => {
          try {
            // add exception in case npr scraper fail
            if (!element.data) {
              // a tag is found within p tag
              if (element.children) {
                if (element.children[0]) {
                  if (element.children[0].data) {
                    subArr.push(element.children[0].data)
                  }
                }
              }
            } else {
              subArr.push(element.data)
            }
          } catch (error) {
            console.log('npr scraper error')
          }
        })
        article.push(subArr.join(' '))
      })
    try {
      // add exception for empty article array
      article =
        article[0].trim().slice(0, 5) === article[1].trim().slice(0, 5)
          ? article.slice(2)
          : article // slice to get rid of the p tag duplicate
    } catch (error) {
      console.log('npr p tag error')
    }

    // await page.waitFor(5000)

    headlines[i].article = article.join('/n') || 'Not found'

    bbcArticles.create(headlines[i])
  }
}

module.exports = {scrapeNPRArticles, scrapeNPRHeadlines}
