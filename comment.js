const http = require('http')
const cheerio = require('cheerio');
const fs = require('fs')
const axios = require('axios')
const commentDetailBaseUrl = 'http://gzjs.bazhuayu.com/comment/'
const commentFile = 'comment'
let commentId = ['3652063', '27140787589', '30692740683']

if (fs.existsSync(commentFile)) {
  fs.unlinkSync(commentFile)
}

function run() {
  for (let id of commentId) {
    let commentUrl = commentDetailBaseUrl + id
    axios.post(commentUrl)
    .then(res => {
      fs.writeFile(commentFile + '-' + id + '.json', JSON.stringify(res.data) + '\n')
    })
    .catch(err => {
      console.log('axios err is ', err);
    })
  }
}
run()