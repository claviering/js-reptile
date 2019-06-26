const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const baseUrl = 'https://jinshuju.net/f/jdqhRB/s/nq0CQ9'

// 爬取学院档案交递信息

let headers = {
  'authority': 'jinshuju.net',
  'method': 'GET',
  'path': '/f/DAlBNT/s/UOpVwS?q%5B0%5D%5Bfield_8%5D=20152100012',
  'scheme': 'https',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'cookie': 'rs_token_nq0CQ9=20190629; jsj_uid=e990ee12-050d-4d87-8cea-e3c21cb5c2a6; _smtv=; _smt_uid=5cbaab7c.58a5b27c; Hm_lvt_21af1e71074bf2e145cd2ca5e9644c27=1560396884; start_filling_time_9Aup6m=1561347557; Hm_lvt_47cd03e974df6869353431fe4f4d6b2f=1560149393,1561347559,1561558110; referer_url=https%3A%2F%2Fjinshuju.net%2Ff%2FjdqhRB%2Fs%2Fnq0CQ9; _gd_session=eWlycGNNS1FNZy91TVo0dFhRWkttLzNVQklHNU8xbjZnYWVMNzhOd3QxWDh0Y2NXbGJXZ0hKU2xHNTZxeDJLUnBaeHlpNEZIZDdKcExsQzExTEpmRDVUZ0RaQTVWdWR1NHZYdWRIWGtoNDlwK2VDNEEwUlQwU1FMOE5FSml2aWJBenM5dnhFTHc5OGtTUWwxK2lXSXBnPT0tLXppdlFCVTZ3VzlrR1VSMDhTWUY1L0E9PQ%3D%3D--4616e0ab8c61a62a9870755410d37bbe26896fd8; Hm_lpvt_47cd03e974df6869353431fe4f4d6b2f=1561558465',
  'referer': 'https://jinshuju.net/f/DAlBNT/s/UOpVwS?q%5B0%5D%5Bfield_8%5D=20152100012',
  'upgrade-insecure-requests': 1,
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
}

const instance = axios.create({
  headers
});

let mapObject = {
  1: 'a',
  3: 'b',
  5: 'c',
  7: 'd',
  9: 'e',
  11: 'f',
  13: 'g',
  15: 'h',
}

let object = {
  a: '专业名称',
  b: '姓名',
  c: '学号',
  d: '派遣性质',
  e: '主管单位',
  f: '档案接收单位',
  g: '档案接收地址',
  h: '联系人',
}

let stream = fs.createWriteStream("学院档案交递信息.json");

async function run() {
  let id = 20152101001
  for (let index = 0; index < 300; index++) {
    let curNo = id + index
    console.log(curNo);
    let url = baseUrl + curNo // 爬取地址
    let res = await instance.get(url, {
      params: {
        'q[0][field_1]': '专业名称',
        'q[0][field_2]': '姓名',
        'q[0][field_3]': '学号',
      }
    })
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