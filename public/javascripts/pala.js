const axios = require("axios");

const UNIT = 1_000_000_000_000_000_000;

const contractList = [
  "0xce70eef5adac126c37c8bc0c1228d48b70066d03", // 밸리곰
  "0xd643bb39f81ff9079436f726d2ed27abc547cb38", // 푸빌라
  "0xef45d7272211f7d9c9b3b509d550e8856cd9e050", // 푸빌라 친구
  "0xe47e90c58f8336a2f24bcd9bcb530e2e02e1e8ae", // 도싸클
  "0x8f5aa6b6dcd2d952a22920e8fe3f798471d05901", // 선미야
  "0x4e24762be544f0af9235ffad146f39bbe0ec7800", // 해피어타운
  "0x6b125e9b6ae99743ef1508d682eebf6706d5c7c1", // 라온
  "0x29421A3c92075348fCBcB04de965E802Ed187302", // 무너
  "0x2ef68dd818931defcaff5e55f5e1fc9139c4abe4", // LGC
  "0xe013a4Dd240B4E4821148FF786cFA050d60182Bb", // 라바
];

/**
 * API 호출
 * @type { (url: String) => Object }
 */
async function getInfo(url, volumeList) {
  const response = await axios(url, {
    headers: {
      accept: "application/json, text/plain, */*",
    },
    method: "GET",
  });
  const item = response?.data;

  let volume = 0;
  for (let i = 0; i < volumeList.length; i++) {
    if (
      item.contractAddress.toUpperCase() ===
      volumeList[i].contractAddress.toUpperCase()
    ) {
      volume = volumeList[i].volume7days;
    }
  }

  const floor = Math.floor(item?.floorPriceInKlay / UNIT);

  const numOfOwners = item?.numOfOwners;
  const numOfTokens = item?.numOfTokens;
  const score = Math.floor(
    volume * 0.0001 + floor * 0.5 + numOfOwners * 0.7 - numOfTokens * 0.0001
  );

  return {
    name: item?.name,
    contractAddress: item?.contractAddress,
    description: item?.description,
    score: score,
    url: item?.logoUrl,
    floor: floor,
    volume: volume,
    numOfOwners: numOfOwners,
    numOfTokens: numOfTokens,
  };
}

/**
 * 프로젝트 병합 및 순위 설정
 * @type { (urls: Array) => Array }
 */
async function createExportData(urls) {
  const projectList = [];
  const volumeList7days = await get7daysVolume();

  // 프로젝트 병합
  for (let i = 0; i < urls.length; i++) {
    const result = await getInfo(urls[i], volumeList7days);
    projectList.push(result);
  }

  // 내림차순 정렬
  projectList.sort((a, b) => {
    return b.score - a.score;
  });

  return {
    data: projectList,
  };
}

const checkContractAddress = (_address) => {
  for (let i = 0; i < contractList.length; i++) {
    if (contractList[i].toUpperCase() === _address.toUpperCase()) {
      // console.log(contractList[i].toUpperCase(), "//", _address.toUpperCase());
      return true;
    }
  }
  return false;
};

const getTotalPages = async (_chartLimit) => {
  const chart7dayUrl = `https://klaytn.api.pala.world/projects/chart?page=1&limit=${_chartLimit}&order_by=volumeTraded.desc&date_duration=7&category=all`;
  const response = await axios(chart7dayUrl, {
    headers: {
      accept: "application/json, text/plain, */*",
    },
    method: "GET",
  });

  const data = response.data;
  const totalPages = data.meta.totalPages;

  return totalPages;
};

const getChart7days = async () => {
  const chart7daysList = [];
  const chartLimit = 10;

  const totalPages = await getTotalPages(chartLimit);

  for (let i = 1; i <= totalPages; i++) {
    const chart7dayUrl = `https://klaytn.api.pala.world/projects/chart?page=${i}&limit=${chartLimit}&order_by=volumeTraded.desc&date_duration=7&category=all`;
    const response = await axios(chart7dayUrl, {
      headers: {
        accept: "application/json, text/plain, */*",
      },
      method: "GET",
    });

    const data = response.data;
    const items = data.items;

    items.forEach((element) => {
      const contractAddress = element.projectContractAddress;
      const volume7days = Math.floor(element?.volumeTraded / UNIT);

      if (checkContractAddress(contractAddress)) {
        const chart7daysContent = {
          contractAddress: contractAddress,
          volume7days: volume7days,
        };
        chart7daysList.push(chart7daysContent);
      }
    });
  }
  return chart7daysList;
  // console.log(chart7daysList);
};

const get7daysVolume = async () => {
  return await getChart7days();
};

module.exports = { getInfo, createExportData };
