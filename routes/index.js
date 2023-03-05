var express = require("express");
var router = express.Router();
const basePath = process.cwd();
const fs = require("fs");
const schedule = require("node-schedule");

const {
  getInfo,
  createExportData,
  getKlayPrice,
} = require("../public/javascripts/pala.js");

const savedProjectList = require("../data/projectList.js");
const { json } = require("body-parser");

let projectList = [];
let klayPrice = 0;

const getRankinglist = async () => {
  const projectUrls = [
    "https://klaytn.api.pala.world/projects/0xce70eef5adac126c37c8bc0c1228d48b70066d03", // 밸리곰
    "https://klaytn.api.pala.world/projects/0xd643bb39f81ff9079436f726d2ed27abc547cb38", // 푸빌라
    "https://klaytn.api.pala.world/projects/0xef45d7272211f7d9c9b3b509d550e8856cd9e050", // 푸빌라 친구
    "https://klaytn.api.pala.world/projects/0xe47e90c58f8336a2f24bcd9bcb530e2e02e1e8ae", // 도싸클
    "https://klaytn.api.pala.world/projects/0x8f5aa6b6dcd2d952a22920e8fe3f798471d05901", // 선미야
    "https://klaytn.api.pala.world/projects/0x4e24762be544f0af9235ffad146f39bbe0ec7800", // 해피어타운
    "https://klaytn.api.pala.world/projects/0x6b125e9b6ae99743ef1508d682eebf6706d5c7c1", // 라온
    "https://klaytn.api.pala.world/projects/0x29421A3c92075348fCBcB04de965E802Ed187302", // 무너
    "https://klaytn.api.pala.world/projects/0x2ef68dd818931defcaff5e55f5e1fc9139c4abe4", // LGC
    "https://klaytn.api.pala.world/projects/0xe013a4Dd240B4E4821148FF786cFA050d60182Bb", // 라바
  ];

  projectList = await createExportData(projectUrls);
  return projectList;
};

const init = async () => {
  await getRankinglist();
  klayPrice = await getKlayPrice();
};

// 서버 시작시 처음 한 번 실행되는 함수들.
init();

const readDayPrice = () => {
  const path = `${basePath}/json/saveJSON.json`;
  const jsonList = fs.readFileSync(path);
  const list = JSON.parse(jsonList);

  console.log("PuuvillaFriends : ", list["PuuvillaFriends"]);

  return list;
};

const updateDayPrice = async () => {
  const result = await getRankinglist();
  const data = result.data;

  let list = {};
  for (let i = 0; i < data.length; i++) {
    list[data[i].name] = data[i].floor;
  }

  const listJSON = JSON.stringify(list, null, 2);
  const path = `${basePath}/json/saveJSON.json`;
  fs.writeFileSync(path, listJSON);
};

const setRankingList = schedule.scheduleJob("0 * * * *", function () {
  getRankinglist();
});

const setKlayPrice = schedule.scheduleJob("*/15 * * * *", async function () {
  klayPrice = await getKlayPrice();
});

const setDayPrice = schedule.scheduleJob("0 0 * * *", async function () {
  await updateDayPrice();
});

/**
 * @path {GET} http://localhost:3000
 * @description 메인
 */
router.get("/", (req, res, next) => {
  res.send("Bamboosoop");
});

/**
 * @path {GET} http://localhost:3000/api/rankingList
 * @description 랭킹 리스트 반환 API
 */
router.get("/api/rankingList", async (req, res, next) => {
  res.json(projectList);
});

/**
 * @path {GET} http://localhost:3000/api/ranking
 * @description 랭킹 정보 반환 API
 */
router.get("/api/ranking", async (req, res, next) => {
  const id = req?.query?.id;
  let result = {
    code: "404",
    msg: "Not Found",
  };

  if (id) {
    result = await getInfo(`https://klaytn.api.pala.world/projects/0x${id}`);
  }

  res.json(result);
});

router.get("/api/klayPrice", async (req, res, next) => {
  res.json(klayPrice);
});

router.get("/api/dayPrice", async (req, res, next) => {
  const dayPriceList = readDayPrice();

  res.json(dayPriceList);
});

module.exports = router;
