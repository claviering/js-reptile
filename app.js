const http = require('http')
const cheerio = require('cheerio');
const fs = require('fs')
const baseUrl = 'http://gzjs.bazhuayu.com/?pageIndex='
const DetailBaseUrl = 'http://gzjs.bazhuayu.com'
const baseDir = './data/'
const startPageNum = 5
const endPageNum = 10

function downloadHtml(tmpDir, tmpFileName, html) {
  fs.mkdir(tmpDir, { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFile(tmpDir + '/' + tmpFileName, html, function(err) {
      if(err) {
          return console.log(err);
      }
    }); 
  })
}

function run () {
  for (let pageNum = startPageNum; pageNum <= endPageNum; pageNum++) {
    let tmpDir = baseDir + pageNum
    let tmpUrl = baseUrl + pageNum
    let tmpFileName = pageNum + '.html'
    console.log('tmpUrl is ', tmpUrl);
    http.get(tmpUrl, res => {
      let html = ''
      res.setEncoding('utf-8')
      res.on('data', chunk => {
        html += chunk
      })
      res.on('end', () => {
        parseHtml(html)
      })
    })
  }
}
let n = 1
function getDetailEvaluateCount (itemList, callback) {
  for (let item of itemList) {
    let tmpDetailUrl = DetailBaseUrl + item.detail
    n = n +1 
    console.log('n is ', n);
    console.log('tmpDetailUrl is ', tmpDetailUrl);
    http.get(tmpDetailUrl, res => {
      let html = ''
      res.setEncoding('utf-8')
      res.on('data', chunk => {
        html += chunk
      })
      res.on('end', () => {
        let count = getEvaluateCount(html)
        item.count = count
        callback(item)
      })
    })
  }
}

//解析html 获取内容
function parseHtml(result) {
  var $ = cheerio.load(result);
  var captionList = $('.item');
  var itemList = [];
  captionList.each(function(item) {
      var cap = $(this);
      var item = {
          phoneName: cap.find('.phone-name').text(),
          shop: cap.find('.shop').text(),
          price: cap.find('.number').text(),
          detail: cap.find('a').attr('href')
      }
      itemList.push(item);
  });
  let total = itemList.length
  let resList = []
  getDetailEvaluateCount(itemList, (res) => {
    resList.push(res)
    if (total === resList.length) {
      // console.log('resList is ', resList);
      fs.writeFile('data.json', JSON.stringify(resList), function(err) {
        if(err) {
            return console.log(err);
        }
      }); 
    }
  })
}
//解析html 评价数
function getEvaluateCount(result) {
  var $ = cheerio.load(result);
  var count = $('.tab-item').attr('data-for', 'tab2').text();
  let res = count.slice(7, -1)
  return res
}

run()
