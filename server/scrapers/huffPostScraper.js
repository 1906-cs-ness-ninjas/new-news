const cheerio = require('cheerio')
const {bbcArticles} = require('../db/models')

async function scrapeHuffPostHeadlines(page) {
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
  let articles = []
  for (var i = 0; i < headlines.length; i++) {
    await page.goto(headlines[i].url, {
      timeout: 0
    })
    // await page.waitFor(5000)
    const html = await page.content()
    const $ = cheerio.load(html)
    // const article = $('.content-list-component').text()
    let article = []
    $('.content-list-component')
      .find('p')
      .each((i, tag) => {
        let arr = []
        $(tag.children).each((idx, el) => {
          // p tag
          if (!el) {
            // if it is an <a/> tag
            arr.push(el.children[0].data)
          } else {
            arr.push(el.data)
          }
        })

        article.push(arr.join(' '))
      })

    article = article.join('/n')
    headlines[i].article = article || 'Not Found'
    const tag = $('.entry-eyebrow__link')
      .text()
      .trim()
      .toLowerCase()

    const category = tag.match(
      /(science|sports|technology|world|politics)/i
    ) || ['miscellaneous']

    headlines[i].category = category[0]

    articles.push(bbcArticles.create(headlines[i]))
  }

  await Promise.all(articles)
}

module.exports = {scrapeHuffPostArticles, scrapeHuffPostHeadlines}
