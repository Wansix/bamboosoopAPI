const axios = require('axios');
const cheerio = require('cheerio');


async function dom() {
  const resp = await axios.get(
    // 'https://yjiq150.github.io/coronaboard-crawling-sample/dom'
    'https://opensea.io/collection/clonex'
    // 'https://pala.io/square/ranking'

  );
  const $ = cheerio.load(resp.data);
  console.log(resp.data);
  // const elements = $('.trackList tr');
  // console.log(elements);
  // elements.each((idx, el) => {
  //   console.log($(el).text());
  // });
}
console.log(123456);
dom();

const test = function() {
  
}

exports.test = test;