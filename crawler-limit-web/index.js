const express = require('express');
const request = require('request')
const url = require('url');
const router = express.Router();
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs')
const superagent = require('superagent');
const uri = 'https://fff005.xyz/search.php?key=%E5%89%A7%E6%83%85'

// arrAll.forEach(function(item, index) {
//   request(item.imagesurl).pipe(fs.createWriteStream(`${item.id}.jpg`));
//   console.log('itemId+++', item.id)
// }) 

superagent.get(uri).end((err, res) => {
  let allurl = []
  if (err) {
    console.log('========', err)
  }
  let $ = cheerio.load(res.text)
  let rendertxt = $('.pic>ul>li')
  let length = rendertxt.length

  let i = 0
  console.log('IIIII', length)
  rendertxt.each(async (index, item) => {
    let obj = {}
    i += 1
    let href = $(item).find('a').attr('href')
    let title = $(item).find('a').attr('title')
    let imagesurl = $(item).find('img').attr('src')
    obj['id'] = i
    obj['title'] = title
    obj['imagesurl'] = imagesurl

    let newhref = url.resolve(uri, href)

    obj['src'] = await getinfo(newhref)

    allurl.push(obj)
    if (length === i) {
      allurl.forEach( (item, index) => {
        request(item.imagesurl).pipe(fs.createWriteStream(`${__dirname}/resource/${item.id}.jpg`));
      })
      fs.writeFileSync(`${__dirname}/resource/demo.js`,JSON.stringify(allurl))
      
      // 我放弃了，我不判断这个文件的存在，直接输出吧
      // fs.exists('resource', function (exist) {
      //   if (!exist) {
      //     fs.mkdir('resource', function (err) {
      //       if (err) {
      //         console.log('errr+++++', err)
      //       }
      //       allurl.forEach((item, index) => {
      //         request(item.imagesurl).pipe(fs.createWriteStream(`${__dirname}/resource/${item.id}.jpg`));
      //       })
      //       fs.writeFileSync(`${__dirname}/resource/demo.js`, JSON.stringify(allurl))

      //     })
      //   } else {
      //     fs.writeFileSync(`${__dirname}/resource/demo.js`, JSON.stringify(allurl))
      //   }
      // })
    }
  })
})

getinfo = async (newhref) => {
  let srcurl = ''
  try {
    let res = await superagent.get(newhref)
    let $ = cheerio.load(res.text)
    if ($) {
      let src = $('#my-video').children('source').eq(1).attr('src')
      srcurl = src
    }
    return srcurl
  } catch (e) {

  }

}












// function getnetWork(url, callback) {
//     http.get(url, function(res) {
//       console.log('res', res)
//         // var html = '';
//         // res.on('data', function(chunk) {
//         //     html += chunk
//         // });
//         // res.on('end', function() {
//         //     callback(cheerio.load(html))
//         // })
//     }).on('error', function(err) {
//         console.log(err.message)
//     })
// }
// getnetWork(uri, function($) {
//     // console.log(res)
//     console.log($(this))
//     // $('#right a').each(function() {
//     //     getnetWork($(this).attr('href'), function($) {
//     //         // console.log($('#artibody').text())
//     //         var time = new Date().valueOf();
//     //         var text = $('#artibody').text();
//     //         fs.writeFileSync(`./news/${time}.txt`, $('#artibody').text())
//     //     })
//     // })
// })