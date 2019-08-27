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
        category = 'world'
      } else {
        category = $(aTag[0])
          .text()
          .toLowerCase()
          .trim()
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
    let idx
    $('.storytext')
      .find('p')
      .each((i, el) => {
        let subArr = []
        $(el.children).each((idx, element) => {
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
        })
        article.push(subArr.join(' '))
      })

    article =
      article[0].trim().slice(0, 5) === article[1].trim().slice(0, 5)
        ? article.slice(2)
        : article // slice to get rid of two p tag if duplicate found

    await page.waitFor(5000)

    headlines[i].article = article.join('/n') || 'Not found'

    bbcArticles.create(headlines[i])
  }
}

module.exports = {scrapeNPRArticles, scrapeNPRHeadlines}
