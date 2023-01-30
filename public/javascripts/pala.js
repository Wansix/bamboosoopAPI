const axios = require('axios');

const UNIT = 1_000_000_000_000_000_000;

/**
 * API 호출
 * @type { (url: String) => Object }
 */
async function getInfo(url) {
  const response = await axios(url, {
    "headers": {
      "accept": "application/json, text/plain, */*",
    },
      "method": "GET"
  });
  const item = response?.data;
  
  const floor = Math.floor((item?.floorPriceInKlay) / UNIT);
  const volume =  Math.floor((item?.volumeTraded) / UNIT);
  const numOfOwners = item?.numOfOwners;
  const numOfTokens = item?.numOfTokens;
  const score = Math.floor(( volume * 0.0001 ) + ( floor * 0.5 ) + ( numOfOwners * 0.7 ) - ( numOfTokens * 0.0001 ))

  return {
    name: item?.name,
    description: item?.description,
    score: score,
    url: item?.logoUrl,
    floor: floor,
    volume: volume,
    numOfOwners: numOfOwners,
    numOfTokens: numOfTokens
  }
}

/**
 * 프로젝트 병합 및 순위 설정
 * @type { (urls: Array) => Array }
 */
async function createExportData(urls) {

  const projectList = [];

  // 프로젝트 병합
  for(let i = 0; i < urls.length; i++) {
    const result = await getInfo(urls[i]);
    projectList.push(result);
  }

  // 내림차순 정렬
  projectList.sort((a, b) => {
    return b.score - a.score;
  });

  return {
    data: projectList
  }
}

module.exports = { getInfo, createExportData };