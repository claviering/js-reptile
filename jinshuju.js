const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const baseUrl = 'https://jinshuju.net/f/DAlBNT/s/UOpVwS?q%5B0%5D%5Bfield_8%5D='

// 爬取学院派遣信息

let headers = {
  'authority': 'jinshuju.net',
  'method': 'GET',
  'path': '/f/DAlBNT/s/UOpVwS?q%5B0%5D%5Bfield_8%5D=20152100012',
  'scheme': 'https',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'cookie': 'rs_token_UOpVwS=20150601; jsj_uid=e990ee12-050d-4d87-8cea-e3c21cb5c2a6; _smtv=; _smt_uid=5cbaab7c.58a5b27c; country_code=CN; Hm_lvt_47cd03e974df6869353431fe4f4d6b2f=1557047835,1557747828; referer_url=https%3A%2F%2Fjinshuju.net%2Ff%2FZrVXyJ%2Fs%2FqwyEek; _gd_session=emlpeFkzM3haS2d2VUNGOFdYMStMSVhjSnN3WGtFU0VjMk5Ld3NUWGdNbjVFTWtISmp0eDN0MmNkYjFlNkFKZmtIbDgyeEdhMlpBOXMwWjI0MVNocUVpb29CZ21CeXVHSm1UTmg4bUhTZmlNMGtrQms4aTlUYU1YN3F1UnFpQ3NpM29BUVlXRUtZb1BKLzM5SkNPMFNBPT0tLWxldU92VFVqcFB2cVI0VGVEYnR5OFE9PQ%3D%3D--de105392bae8a3c4d1d35541ff37a0aab31a8b15; Hm_lpvt_47cd03e974df6869353431fe4f4d6b2f=1559376434',
  'referer': 'https://jinshuju.net/f/DAlBNT/s/UOpVwS?q%5B0%5D%5Bfield_8%5D=20152100012',
  'upgrade-insecure-requests': 1,
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
}

const instance = axios.create({
  headers
});

let mapObject = {
  1: 'studentNo',
  3: 'studentName',
  5: 'mobile',
  7: 'studentClass',
  9: 'way',
  11: 'address',
  13: 'organizer',
  15: 'dispatchUnit',
}

let object = {
  studentNo: '学号',
  studentName: '姓名',
  mobile: '手机',
  studentClass: '专业',
  way: '派遣性质',
  address: '报到地址',
  organizer: '主管单位',
  dispatchUnit: '具体派遣单位'
}

let stream = fs.createWriteStream("师范班数据.json");

async function run() {
  let id = 20152101001
  for (let index = 0; index < 300; index++) {
    let curNo = id + index
    console.log(curNo);
    let url = baseUrl + curNo // 爬取地址
    let res = await instance.get(url)
    let $ = cheerio.load(res.data)
    let data = $('td', 'tbody')
    if (!data || !data.length) {
      return
    }
    data.each((index, elem) => {
      let text = $(elem).text().trim()
      if (index % 2)
        object[mapObject[index]] = text
    })
    stream.write(JSON.stringify(object) + ',')
  }
}

run()