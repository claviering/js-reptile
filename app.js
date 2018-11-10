const http = require('http')
const cheerio = require('cheerio');
const fs = require('fs')
const baseUrl = 'http://gzjs.bazhuayu.com/?pageIndex='
const DetailBaseUrl = 'http://gzjs.bazhuayu.com'
const baseDir = './data/'
const startPageNum = 1
const endPageNum = 91

async function run (callback) {
  for (let pageNum = startPageNum; pageNum <= endPageNum; pageNum++) {
    let tmpUrl = baseUrl + pageNum
    http.get(tmpUrl, res => {
      let html = ''
      res.setEncoding('utf8')
      res.on('data', chunk => {
        html += chunk
      })
      res.on('end', () => {
        var cheerioHtml = cheerio.load(html);
        var captionList = cheerioHtml('.item');
        captionList.each(function(item) {
          var cap = cheerioHtml(this);
          var item = {
              phoneName: cap.find('.phone-name').text(),
              shop: cap.find('.shop').text(),
              price: cap.find('.number').text(),
              detail: cap.find('a').attr('href')
          }

          let tmpDetailUrl = DetailBaseUrl + item.detail
          http.get(tmpDetailUrl, res => {
            const { statusCode } = res;
            if (statusCode !== 200) {
              callback({})
              return
            }
            let detailPage = ''
            res.setEncoding('utf8')
            res.on('data', chunk => {
              detailPage += chunk
            })
            res.on('end', () => {
              var cheerioDetailPage = cheerio.load(detailPage);
              var count = cheerioDetailPage('.tab-item').attr('data-for', 'tab2').text();
              let res = count.slice(7, -1)
              item.count = res
              callback(item)
            })
          }).on('error', (e) => {
            console.error(`Got detail error: ${e}`);
            saveFailUrl('detailUrl.txt', tmpDetailUrl)
          });
        });
      })
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      saveFailUrl('tmpUrl.txt', tmpUrl)
    });
  }
  
}

function saveFailUrl(fileName, data) {
  fs.appendFile('./' + fileName, data + '\n', (err) => {
    if (err) throw err;
  });
}

let resList = []
var wstream = fs.createWriteStream('myOutput.txt');
run((res) => {
  resList.push(res)
  fs.writeFile('data.json', JSON.stringify(resList), (err) => {
    if (err) {
      return console.log('write file error', err);
    }
  })
})
