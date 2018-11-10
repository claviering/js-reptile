const http = require('http')
const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs')
const baseUrl = 'http://gzjs.bazhuayu.com/?pageIndex='  // 内容爬取地址
const DetailBaseUrl = 'http://gzjs.bazhuayu.com'  // 详情爬取地址
const startPageNum = 1  // 开始页码
const endPageNum = 91  // 结束页码

var stream = fs.createWriteStream("data.json");
let pageIndex = 1
async function app() {
  for (let pageNum = startPageNum; pageNum <= endPageNum; pageNum++) {
    let tmpUrl = baseUrl + pageNum
    console.log('loading page', tmpUrl);
    let res = await axios.get(tmpUrl)
    let $ = cheerio.load(res.data);
    let captionList = $('.item')
    captionList.each(async (index, elem) => {
      let item = {
        index: pageIndex + ' -' + index,
        phoneName: $(elem).find('.phone-name').text(),  // 获取手机名字
        shop: $(elem).find('.shop').text(),  // 获取商店名字
        price: $(elem).find('.number').text(),  // 获取价格
        detail: $(elem).find('a').attr('href')  // 获取查看详情地址
      }
      let detailUrl = DetailBaseUrl + item.detail
      console.log('loading detail', detailUrl);
      let detailRes = await axios.get(detailUrl)
      let detailCheerio = cheerio.load(detailRes.data);
      let count = detailCheerio('.tab-item').attr('data-for', 'tab2').text()
      item.count = count.slice(7, -1)
      stream.write(JSON.stringify(item) + ',' + '\n', (err) => {  // 爬取的数据保存到文件
        if (err) {
          return console.log('write file error', err);
        }
      })
      pageIndex += 1
    })
  }
}
app()