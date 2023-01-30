const axios = require('axios');
const request = require('graphql-request');

const UNIT = 1_000_000_000_000_000_000;

const scoreList = [] // 점수
const volumeList = []; // 7일 기준 거래량
const floorList = []; // 바닥가
const numberOfHolderList = [] // 홀더 수
// const numberOfListing = [] // 리스팅 수


async function apiCall() {
  const response = await axios("https://klaytn.api.pala.world/projects/chart?page=1&limit=10&order_by=volumeTraded.desc&date_duration=7&category=all", {
    "headers": {
      "accept": "application/json, text/plain, */*",
    },
      "body": null,
      "method": "GET"
  });

  const itemList = response?.data?.items;
  console.log(itemList);

  for(let i=0; i< itemList.length; i++) {
    const volume = Math.floor((itemList[i]?.volumeTraded) / UNIT); // 7일 기준 거래량
    const floor = Math.floor((itemList[i]?.floorPriceInKlay) / UNIT); // 바닥가
    const numberOfHolder = itemList[i]?.numOfOwners // 홀더 수

    /**** 총점 계산 ****/
    const score = Math.floor((volume * 0.0001) + (floor * 0.5) + (numberOfHolder * 0.7));

    volumeList.push(volume);
    floorList.push(floor);
    numberOfHolderList.push(numberOfHolder);
    scoreList.push(score);
  }
  console.log(scoreList);
}

async function openSeaAPI() {
  const result = await axios("https://opensea.io/__api/graphql/", {
    "headers": {
      "content-type": "application/json",
      "x-signed-query": "63489507b20802f566ba41b521df338cf068d5fe949d08732049b32eb94a36bc",
    },
    "body": "{\"id\":\"CollectionInfoPollingQuery\",\"query\":\"query CollectionInfoPollingQuery(\\n  $collection: CollectionSlug!\\n) {\\n  collection(collection: $collection) {\\n    ...CollectionInfoInnerLive_data\\n    id\\n  }\\n}\\n\\nfragment CollectionInfoInnerLive_data on CollectionType {\\n  ...collection_stats\\n}\\n\\nfragment collection_stats on CollectionType {\\n  statsV2 {\\n    totalListed\\n    numOwners\\n    totalQuantity\\n    totalSupply\\n    totalVolume {\\n      unit\\n      symbol\\n    }\\n    floorPrice {\\n      unit\\n      symbol\\n    }\\n  }\\n  collectionOffers(first: 1) {\\n    edges {\\n      node {\\n        perUnitPriceType {\\n          unit\\n          symbol\\n        }\\n        id\\n      }\\n    }\\n  }\\n}\\n\",\"variables\":{\"collection\":\"clonex\"}}",
    "method": "POST",
  });

  console.log(result);
}

console.log('#################');
// apiCall();
openSeaAPI();