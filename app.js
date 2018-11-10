const http = require('http')
const cheerio = require('cheerio');
const fs = require('fs')
const baseUrl = 'http://gzjs.bazhuayu.com/?pageIndex='  // 内容爬取地址
const DetailBaseUrl = 'http://gzjs.bazhuayu.com'  // 详情爬取地址
const startPageNum = 1  // 开始页码
const endPageNum = 91  // 结束页码
if (fs.existsSync('detailUrl.txt')) {  // 判断文件是否存在，存在就删除
  fs.unlinkSync('detailUrl.txt')
}
if (fs.existsSync('tmpUrl.txt')) {
  fs.unlinkSync('tmpUrl.txt')
}
if (fs.existsSync('data.json')) {
  fs.unlinkSync('data.json')
}

var stream = fs.createWriteStream("data.json");

function run () {
  for (let pageNum = startPageNum; pageNum <= endPageNum; pageNum++) {  // 循环 1 到 91 页
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
              phoneName: cap.find('.phone-name').text(),  // 获取手机名字
              shop: cap.find('.shop').text(),  // 获取商店名字
              price: cap.find('.number').text(),  // 获取价格
              detail: cap.find('a').attr('href')  // 获取查看详情地址
          }

          let tmpDetailUrl = DetailBaseUrl + item.detail
          http.get(tmpDetailUrl, res => {
            let detailPage = ''
            res.setEncoding('utf8')
            res.on('data', chunk => {
              detailPage += chunk
            })
            res.on('end', () => {
              var cheerioDetailPage = cheerio.load(detailPage);
              var count = cheerioDetailPage('.tab-item').attr('data-for', 'tab2').text();  // 获取评价数
              let res = count.slice(7, -1)
              item.count = res
              stream.write(JSON.stringify(item) + '\n', (err) => {  // 爬取的数据保存到文件
                if (err) {
                  return console.log('write file error', err);
                }
              })
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
  fs.appendFile('./' + fileName, data + '\n', (err) => {  // 失败的地址数据保存到文件
    if (err) throw err;
  });
}
run()
