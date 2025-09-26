# BambooSoop API

밤부숲 NFT 커뮤니티의 랭킹 시스템을 위한 백엔드 API 서버입니다.

## 📋 프로젝트 개요

밤부숲은 Klaytn 블록체인 기반 NFT 프로젝트들의 실시간 랭킹을 제공하는 커뮤니티였습니다. 이 API는 홈페이지 메인에 표시되는 NFT 순위 데이터를 제공하기 위해 개발되었습니다.

## 🎯 주요 기능

### NFT 프로젝트 랭킹 시스템
- **10개 주요 NFT 프로젝트** 실시간 모니터링
- **종합 점수 기반 랭킹**: 거래량, 바닥가, 토큰 수, 소유자 수를 종합적으로 고려
- **자동화된 데이터 수집**: 정기적인 API 호출을 통한 실시간 데이터 업데이트

### 가격 변동 추적
- **24시간 가격 변동률** 계산 및 제공
- **KLAY 가격 기반 원화 환산**
- **전일 대비 절대 변동량** 표시

## 🏗️ 기술 스택

- **Backend**: Node.js + Express.js
- **Scheduling**: node-schedule (정기 작업 실행)
- **External APIs**: 
  - Pala API (Klaytn NFT 데이터)
  - CoinMarketCap API (KLAY 가격 정보)
- **Data Processing**: axios, cheerio

## 📊 추적 대상 프로젝트

현재 10개의 Klaytn NFT 프로젝트를 모니터링합니다:

| 프로젝트명 | 컨트랙트 주소 | 설명 |
|-----------|-------------|------|
| BELLYGOM | 0xce70eef5adac126c37c8bc0c1228d48b70066d03 | 밸리곰 |
| Puuvilla Society | 0xd643bb39f81ff9079436f726d2ed27abc547cb38 | 푸빌라 |
| PuuvillaFriends | 0xef45d7272211f7d9c9b3b509d550e8856cd9e050 | 푸빌라 친구 |
| DSC MATES | 0xe47e90c58f8336a2f24bcd9bcb530e2e02e1e8ae | 도싸클 |
| Sunmiya Club | 0x8f5aa6b6dcd2d952a22920e8fe3f798471d05901 | 선미야 |
| HAPPIER TOWN | 0x4e24762be544f0af9235ffad146f39bbe0ec7800 | 해피어타운 |
| NFTxRaon Membership | 0x6b125e9b6ae99743ef1508d682eebf6706d5c7c1 | 라온 |
| Moono Week | 0x29421A3c92075348fCBcB04de965E802Ed187302 | 무너 |
| LGC LazyPeople V1 | 0x2ef68dd818931defcaff5e55f5e1fc9139c4abe4 | LGC |
| Aniverse Larva NFT | 0xe013a4Dd240B4E4821148FF786cFA050d60182Bb | 라바 |

## ⚙️ 랭킹 시스템

### 점수 계산 공식
```javascript
score = volume * 0.003 + (floor * numOfTokens * 5) / 100000 + numOfOwners * 0.4
```

- **거래량 (volume)**: 7일간 거래량
- **바닥가 (floor)**: 현재 바닥가 (KLAY 단위)
- **토큰 수 (numOfTokens)**: 총 발행량
- **소유자 수 (numOfOwners)**: 현재 소유자 수

### 자동화된 스케줄링
- **매시간**: 랭킹 데이터 업데이트
- **15분마다**: KLAY 가격 업데이트  
- **매일 자정**: 전일 가격 데이터 저장

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
COINMARKETCAP_API_KEY=your_api_key_here
```

### 3. 서버 실행
```bash
npm start
```

서버는 기본적으로 포트 8080에서 실행됩니다.

## 📁 프로젝트 구조

```
bamboosoopAPI/
├── server.js              # 메인 서버 파일
├── routes/
│   ├── index.js           # 메인 라우터 (랭킹 로직)
│   └── users.js           # 사용자 라우터
├── public/javascripts/
│   └── pala.js            # Pala API 연동 및 데이터 처리
├── data/
│   └── projectList.js     # 프로젝트 목록 정의
├── json/
│   └── saveJSON.json      # 전일 가격 데이터 저장
└── package.json           # 의존성 관리
```

## 🔧 API 엔드포인트

> **주의**: 현재 API 엔드포인트들이 주석 처리되어 있습니다. 활성화하려면 `routes/index.js`의 주석을 해제하세요.

### 예상 API 목록
- `GET /api/rankingList` - 전체 랭킹 리스트
- `GET /api/ranking?id={contractAddress}` - 특정 프로젝트 정보
- `GET /api/klayPrice` - 현재 KLAY 가격
- `GET /api/dayPrice` - 전일 가격 데이터

## 📈 데이터 흐름

1. **초기화**: 서버 시작 시 KLAY 가격 및 랭킹 데이터 수집
2. **정기 업데이트**: 스케줄링을 통한 자동 데이터 갱신
3. **가격 변동 계산**: 전일 대비 변동률 및 절대 변동량 계산
4. **데이터 저장**: JSON 파일을 통한 전일 가격 데이터 보관

## ⚠️ 현재 상태

- **커뮤니티 운영 중단**: 밤부숲 커뮤니티는 현재 운영 중단 상태
- **API 비활성화**: 엔드포인트들이 주석 처리되어 실제 API 호출 불가
- **기본 기능 동작**: 데이터 수집 및 처리 로직은 정상 작동

## 🔮 향후 개선 방향

1. **API 엔드포인트 활성화**
2. **에러 핸들링 강화**
3. **환경 변수 설정 개선**
4. **로깅 시스템 추가**
5. **데이터베이스 연동 고려**

## 📝 라이선스

이 프로젝트는 밤부숲 NFT 커뮤니티를 위해 개발되었으며, 현재는 운영 중단 상태입니다. 
