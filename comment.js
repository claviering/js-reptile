const fs = require('fs')
const axios = require('axios')
const commentDetailBaseUrl = 'http://gzjs.bazhuayu.com/comment/'
const commentFile = 'comment'
let commentId = ['3652063', '27140787589', '30692740683'] // 爬取评价

function run() {
  for (let id of commentId) {
    let commentUrl = commentDetailBaseUrl + id // 爬取地址
    axios.post(commentUrl)
    .then(res => {
      fs.writeFile(commentFile + '-' + id + '.json', JSON.stringify(res.data) + '\n') // 爬取结果保存到文件
    })
    .catch(err => {
      console.log('axios err is ', err);
    })
  }
}
run()