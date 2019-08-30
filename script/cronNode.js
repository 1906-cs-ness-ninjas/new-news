const cron = require('node-cron')
const shell = require('shelljs')

// Run cron job every 6 hours
cron.schedule('0 0 */6 * * *', function() {
  shell.exec('npm run scrape', function() {
    console.log('Done scraping')
  })
})
