const axios = require('axios');

const UNIT = 1_000_000_000_000_000_000;

const scoreList = [] // 점수
const volumeList = []; // 7일 기준 거래량
const floorList = []; // 바닥가
const numberOfHolderList = [] // 홀더 수
// const numberOfListing = [] // 리스팅 수


async function apiCall() {
  const response = await axios("https://explorer.blockchain.line.me/v1/4380401001/addresses/tlink1kuvmugzcuntlmyyfhpdchz8dm7daj8gvhs2npt/tokens?size=30&search_from=top", {
    "headers": {
      "accept": "*/*",
      "cookie": "_trmccid=c732386b0fac9ab3; _ldbrbid=lo__pNhU9nddgx0Jal3FCrSLAUBk60IbFirXnP4Ancso3us; __is_login_sso=1; _gcl_au=1.1.962581581.1669704591; _fbp=fb.1.1669704591110.981232821; _ga_F3PSXHBMRT=GS1.1.1669704591.1.0.1669704593.58.0.0; _ga_VVXQNC9ZJV=GS1.1.1672217958.2.0.1672217958.0.0.0; _ga=GA1.2.1110819004.1669704591; __try__=1673574467336; _gid=GA1.2.1742925753.1673584414; _gat_gtag_UA_168052358_1=1",
      "Referer": "https://explorer.blockchain.line.me/cashew/address/tlink1jqp3wgctkl050aan943pz4rq9j8pnq2525fe5d?tab=token",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
      "body": null,
      "method": "GET"
  });

  const itemList = response?.data;
  console.log(itemList);

  // for(let i=0; i< itemList.length; i++) {
  //   const volume = Math.floor((itemList[i]?.volumeTraded) / UNIT); // 7일 기준 거래량
  //   const floor = Math.floor((itemList[i]?.floorPriceInKlay) / UNIT); // 바닥가
  //   const numberOfHolder = itemList[i]?.numOfOwners // 홀더 수

  //   /**** 총점 계산 ****/
  //   const score = Math.floor((volume * 0.0001) + (floor * 0.5) + (numberOfHolder * 0.7));

  //   volumeList.push(volume);
  //   floorList.push(floor);
  //   numberOfHolderList.push(numberOfHolder);
  //   scoreList.push(score);
  // }
  // console.log(scoreList);
}

console.log('#################');
apiCall();