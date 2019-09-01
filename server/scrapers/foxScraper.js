const cheerio = require('cheerio')
const {bbcArticles} = require('../db/models')

async function scrapeFoxHeadlines(page) {
  await page.goto('https://www.foxnews.com/', {
    timeout: 0
  })
  const html = await page.content()
  const $ = cheerio.load(html)
  let articles = []
  $('.main')
    .find('.article')
    .each((i, el) => {
      let url = $(el.children)
        .find('a')
        .attr('href')
      let pic = $(el.children)
        .find('img')
        .attr('src')
      let imageUrl
      if (/static/g.test(pic)) {
        let img = $(el.children).find('img')[0].attribs
        if (img['data-src']) {
          imageUrl = 'https:' + img['data-src']
        } else {
          imageUrl = 'http:' + img.src
        }
      } else if (/media/g.test(pic)) {
        imageUrl = pic
      } else {
        imageUrl = 'https:' + pic
      }
      let category = url.replace(/.*\/(.*?)\/.*/g, '$1')

      let article = {title: 'hello', imageUrl, url, category}
      articles.push(article)
    })
  return articles
}
async function scrapeFoxArticles(headlines, page) {
  let articles = []
  for (let i = 0; i < headlines.length; i++) {
    try {
      // exception for
      await page.goto(headlines[i].url, {
        timeout: 0
      })
    } catch (error) {
      console.log('foxnews url not founded', headlines[i].url)
    }

    const html = await page.content()
    const $ = cheerio.load(html)
    const title = $('.headline').text()
    const article = []

    $('.article-body')
      .find('p')
      .each((i, el) => {
        let subArr = []
        $(el.children).each((idx, element) => {
          try {
            // add exception in case fail
            if (!element.data) {
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
            console.log('fox scraper error')
          }
        })
        article.push(subArr.join(' '))
      })

    // let article = $('.article-body').text().trim()

    headlines[i].title = title
    headlines[i].article = article.join('/n')
    if (!title || !article) {
      continue
    }
    articles.push(bbcArticles.create(headlines[i]))
  }
  await Promise.all(articles)
}

module.exports = {scrapeFoxArticles, scrapeFoxHeadlines}
