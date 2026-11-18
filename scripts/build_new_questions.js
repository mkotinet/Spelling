// scripts/build_new_questions.js
// Generates 100 brand-new high-quality Korean spelling questions (20 per level x 5 levels = 100 questions)
// Validates 100% against korean_grammar_validator.js

const fs = require('fs');
const path = require('path');
const validator = require('../korean_grammar_validator.js');

const rawQuestions = [
  // ==========================================
  // LEVEL 1: 초등/기초 (IDs 5001 - 5020)
  // ==========================================
  {
    level: "초등/기초",
    sentence: "발을 동동 구르며 이제 [ (     ) ] 하고 울먹였다.",
    options: ["어떡해", "어떻게", "어떠케", "어떻해"],
    answerIndex: 0,
    explanation: "'어떡해'(이)가 올바른 표준 표기입니다. '어떻게 해'가 줄어든 말로, 문장 끝에서 서술어로 쓰입니다. (한글 맞춤법 제35항 붙임 2)",
    rule: "한글 맞춤법 제35항 붙임 2",
    standardWord: "어떡해",
    dictDefinition: "‘어떻게 해’가 줄어든 말",
    pos: "구",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%96%B4%EB%96%A1%ED%95%B4"
  },
  {
    level: "초등/기초",
    sentence: "부드럽고 푹신한 솜 [ (     ) ]를 베고 잠자리에 들었다.",
    options: ["배개", "베개", "베게", "배게"],
    answerIndex: 1,
    explanation: "'베개'(이)가 올바른 표준 표기입니다. '베다'의 어간 '베-'에 접미사 '-개'가 붙어 명사가 된 단어입니다. (한글 맞춤법 제19항)",
    rule: "한글 맞춤법 제19항",
    standardWord: "베개",
    dictDefinition: "잠을 자거나 누울 때 머리를 괴는 물건",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B2%A0%EA%B0%9C"
  },
  {
    level: "초등/기초",
    sentence: "식사가 끝나자마자 싱크대에서 그릇 [ (     ) ]를 도왔다.",
    options: ["설겆이", "설거지", "설거찌", "설겆찌"],
    answerIndex: 1,
    explanation: "'설거지'(이)가 올바른 표준 표기입니다. 현대 국어에서는 어원이 분명하지 않아 소리대로 적습니다. (표준어 규정 제17항)",
    rule: "표준어 규정 제17항",
    standardWord: "설거지",
    dictDefinition: "먹고 난 뒤의 그릇, 냄비 따위를 씻어 치우는 일",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%84%A4%EA%B1%B0%EC%A7%80"
  },
  {
    level: "초등/기초",
    sentence: "보글보글 뚝배기에서 끓는 돼지고기 [ (     ) ]가 정말 맛있었다.",
    options: ["김치찌게", "김치찌기", "김치찌개", "김치찌계"],
    answerIndex: 2,
    explanation: "'김치찌개'(이)가 올바른 표준 표기입니다. 찌개류 음식은 '찌개'로 적는 것이 바릅니다. (한글 맞춤법 제19항)",
    rule: "한글 맞춤법 제19항",
    standardWord: "김치찌개",
    dictDefinition: "배추김치에 고기, 두부 따위를 넣고 자작하게 끓인 찌개",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B9%80%EC%B9%98%EC%CC%8C%EA%B0%9C"
  },
  {
    level: "초등/기초",
    sentence: "따뜻한 봄바람이 불어오자 얼었던 얼음이 [ (     ) ] 녹아내렸다.",
    options: ["금새", "금세", "금시", "금쎄"],
    answerIndex: 1,
    explanation: "'금세'(이)가 올바른 표준 표기입니다. '금시(今時)에'의 준말이므로 '금세'로 적습니다. (한글 맞춤법 제35항)",
    rule: "한글 맞춤법 제35항",
    standardWord: "금세",
    dictDefinition: "지금 바로. ‘금시에’가 줄어든 말",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B8%88%EC%84%B8"
  },
  {
    level: "초등/기초",
    sentence: "잘 익은 옥수수를 알알이 떼지 않고 [ (     ) ] 베어 물었다.",
    options: ["통채로", "통째로", "통째루", "통채루"],
    answerIndex: 1,
    explanation: "'통째로'(이)가 올바른 표준 표기입니다. '나누지 아니한 덩어리 그대로'의 뜻을 더하는 접미사는 '-째'입니다. (한글 맞춤법 제26항)",
    rule: "한글 맞춤법 제26항",
    standardWord: "통째로",
    dictDefinition: "나누지 아니한 덩어리 그대로",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%86%B5%EC%97%B8%EB%A1%9C"
  },
  {
    level: "초등/기초",
    sentence: "넘어져도 씩씩하게 다시 일어나는 [ (     ) ] 장난감을 보며 용기를 냈다.",
    options: ["오뚜기", "오뚜귀", "오뚝이", "오뚝기"],
    answerIndex: 2,
    explanation: "'오뚝이'(이)가 올바른 표준 표기입니다. 부사 '오뚝'에 접미사 '-이'가 붙어 명사가 된 단어이므로 원형을 밝혀 적습니다. (한글 맞춤법 제19항)",
    rule: "한글 맞춤법 제19항",
    standardWord: "오뚝이",
    dictDefinition: "밑을 무겁게 하여 쓰러뜨려도 곧 오뚝 일어서는 어린아이들의 장난감",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%98%A4%EB%9A%9D%EC%9D%B4"
  },
  {
    level: "초등/기초",
    sentence: "하늘에 무지개가 두 개나 뜬 [ (     ) ] 풍경을 바라보았다.",
    options: ["희안한", "희한한", "희한됫", "희안됫"],
    answerIndex: 1,
    explanation: "'희한한'(이)가 올바른 표준 표기입니다. 매우 드물거나 신기함을 뜻하는 한자어 '稀罕'에서 유래하여 '희한하다'가 표준어입니다. (표준국어대사전)",
    rule: "표준어 규정 (한자 어원 표기)",
    standardWord: "희한하다",
    dictDefinition: "매우 드물거나 신기하다",
    pos: "형용사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%9D%AC%ED%95%9C%ED%95%98%EB%8B%A4"
  },
  {
    level: "초등/기초",
    sentence: "방과 후 분식집에서 친구들과 매콤달콤한 [ (     ) ]를 사 먹었다.",
    options: ["떡복이", "떡볶기", "떡복기", "떡볶이"],
    answerIndex: 3,
    explanation: "'떡볶이'(이)가 올바른 표준 표기입니다. 동사 '볶다'의 어간에 접미사 '-이'가 결합한 파생어입니다. (한글 맞춤법 제19항)",
    rule: "한글 맞춤법 제19항",
    standardWord: "떡볶이",
    dictDefinition: "가래떡을 토막 내어 쇠고기, 채소, 어묵 따위와 함께 볶은 음식",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%96%A1%EB%B3%B6%EC%9D%B4"
  },
  {
    level: "초등/기초",
    sentence: "운동장을 달리고 돌아와 손과 발을 [ (     ) ] 씻었다.",
    options: ["깨끗이", "깨끗히", "깨끗스레", "깨끗이히"],
    answerIndex: 0,
    explanation: "'깨끗이'(이)가 올바른 표준 표기입니다. 어간 받침이 'ㅅ'으로 끝나는 형용사 뒤에는 부사 파생 접미사 '-이'가 붙습니다. (한글 맞춤법 제51항)",
    rule: "한글 맞춤법 제51항",
    standardWord: "깨끗이",
    dictDefinition: "더러운 것이 없이 맑고 말끔하게",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B9%A8%EB%81%97%EC%9D%B4"
  },
  {
    level: "초등/기초",
    sentence: "선생님이 내주신 수수께끼의 정답을 [ (     ) ] 생각해 보았다.",
    options: ["곰곰히", "곰곰스레", "곰곰이", "곰곰"],
    answerIndex: 2,
    explanation: "'곰곰이'(이)가 올바른 표준 표기입니다. 첩어(겹친 말) 뒤에 결합하는 부사 파생 접미사는 '-이'입니다. (한글 맞춤법 제51항)",
    rule: "한글 맞춤법 제51항",
    standardWord: "곰곰이",
    dictDefinition: "여러모로 깊이 생각하는 모양",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B3%B0%EA%B3%B0%EC%9D%B4"
  },
  {
    level: "초등/기초",
    sentence: "개울가에 놓인 크고 [ (     ) ] 바위 위에 걸터앉았다.",
    options: ["넙적한", "넓적한", "넓쩍한", "넙쩍한"],
    answerIndex: 1,
    explanation: "'넓적한'(이)가 올바른 표준 표기입니다. 어간 '넓-'에 접미사 '-적하다'가 결합할 때 어간 형태를 밝혀 적습니다. (한글 맞춤법 제21항)",
    rule: "한글 맞춤법 제21항",
    standardWord: "넓적하다",
    dictDefinition: "판판하고 꽤 넓다",
    pos: "형용사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%84%93%EC%A0%81%ED%95%98%EB%8B%A4"
  },
  {
    level: "초등/기초",
    sentence: "푸른 잔디가 끝없이 펼쳐진 [ (     ) ] 운동장을 신나게 달렸다.",
    options: ["넓다란", "넙다란", "넓따란", "널따란"],
    answerIndex: 3,
    explanation: "'널따란'(이)가 올바른 표준 표기입니다. '넓-'에 접미사가 붙어 겹받침 끝소리가 나지 않는 것은 소리대로 적습니다. (한글 맞춤법 제21항)",
    rule: "한글 맞춤법 제21항",
    standardWord: "널따랗다",
    dictDefinition: "꽤 널찍하고 크다",
    pos: "형용사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%84%90%EB%94%B0%EB%9E%87%EB%8B%A4"
  },
  {
    level: "초등/기초",
    sentence: "주말 아침에 일과를 시작하려고 [ (     ) ] 잠자리에서 일어났다.",
    options: ["일찌기", "일찍이", "일찍히", "일찌키"],
    answerIndex: 1,
    explanation: "'일찍이'(이)가 올바른 표준 표기입니다. 부사 '일찍'에 접미사 '-이'가 붙은 말이므로 원형을 밝혀 '일찍이'로 적습니다. (한글 맞춤법 제25항)",
    rule: "한글 맞춤법 제25항",
    standardWord: "일찍이",
    dictDefinition: "일찌감치. 예정보다 빠른 시간에",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9D%BC%EC% obstacles"
  },
  {
    level: "초등/기초",
    sentence: "소풍 갈 생각에 신이 나서 절로 [ (     ) ]를 흥얼거렸다.",
    options: ["코노래", "콧노래", "콧노레", "코노레"],
    answerIndex: 1,
    explanation: "'콧노래'(이)가 올바른 표준 표기입니다. 순우리말 합성어로 뒷말의 첫소리가 'ㄴ' 앞에서 [ㄴ] 소리가 덧나므로 사이시옷을 받쳐 적습니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항 (사이시옷)",
    standardWord: "콧노래",
    dictDefinition: "입을 다문 채 콧소리로 부르는 노래",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%BD%A7%EB%85%B8%EB%9E%98"
  },
  {
    level: "초등/기초",
    sentence: "하얗게 쌓인 눈밭 위에 뽀드득 소리를 내며 첫 [ (     ) ]을 남겼다.",
    options: ["발자옥", "발자국", "발자욱", "발짜국"],
    answerIndex: 1,
    explanation: "'발자국'(이)가 올바른 표준 표기입니다. 현대 국어 표준어 규정에서 '발자욱'을 버리고 '발자국'만을 표준어로 삼았습니다. (표준어 규정 제17항)",
    rule: "표준어 규정 제17항",
    standardWord: "발자국",
    dictDefinition: "발로 밟은 자리에 남은 모양",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B0%9C%EC%9E%90%EA%B5%AD"
  },
  {
    level: "초등/기초",
    sentence: "새콤하고 감칠맛 나는 전통 음식인 [ (     ) ]를 밥에 얹어 먹었다.",
    options: ["가자미식혜", "가자미식해", "가자미식혱", "가자미식행"],
    answerIndex: 1,
    explanation: "'가자미식해'(이)가 올바른 표준 표기입니다. 곡식과 생선을 삭혀 만든 발효 음식은 '식해(食醯)'이며, 밥알을 띄운 달콤한 음료는 '식혜(食醯)'입니다. (표준어 규정)",
    rule: "표준어 규정 (동음이의어 구별)",
    standardWord: "식해",
    dictDefinition: "생선에 곡식과 소금, 고춧가루 따위를 넣어 삭힌 음식",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B0%80%EC%9E%90%EB%AF%B8%EC%8B%9D%ED%95%B4"
  },
  {
    level: "초등/기초",
    sentence: "가족들과 함께 [ (     ) ] 식탁에 둘러앉아 이야기를 나누었다.",
    options: ["어제저녁", "어제져녁", "어젯져녁", "어젯저녁에"],
    answerIndex: 0,
    explanation: "'어제저녁'(이)가 널리 쓰이는 표준 합성어입니다. '어제'와 '저녁'이 결합하여 한 단어로 굳어진 표준어입니다. (표준어 규정)",
    rule: "표준어 규정 (합성어 표기)",
    standardWord: "어제저녁",
    dictDefinition: "어제의 저녁",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%96%B4%EC%A0%9C%EC%A0%80%EB%85%81"
  },
  {
    level: "초등/기초",
    sentence: "새들에게 줄 모이를 손으로 한 [ (     ) ] 쥐어 모이통에 뿌려주었다.",
    options: ["웅큼", "움큼", "웅컴", "움컴"],
    answerIndex: 1,
    explanation: "'움큼'(이)가 올바른 표준 표기입니다. '움켜쥐다'에서 비롯된 말로 모음 조화 및 자음 표기에 따라 '움큼'이 표준어입니다. (표준어 규정 제17항)",
    rule: "표준어 규정 제17항",
    standardWord: "움큼",
    dictDefinition: "손으로 한 줌 쥘 만한 분량을 세는 단위",
    pos: "의존 명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9B%80%ED%81%BC"
  },
  {
    level: "초등/기초",
    sentence: "할머니께서 들려주시던 정다운 옛날이야기가 문득 [ (     ) ] 미소를 지었다.",
    options: ["생각 나", "생각나", "생각내", "생각 내"],
    answerIndex: 1,
    explanation: "'생각나'(이)가 올바른 표준 표기입니다. '생각나다'는 기억이나 생각이 떠오름을 뜻하는 하나의 합성 동사이므로 붙여 적습니다. (한글 맞춤법 제2항)",
    rule: "한글 맞춤법 제2항 (합성어 띄어쓰기)",
    standardWord: "생각나다",
    dictDefinition: "어떤 대상에 대한 기억이나 관심이 마음에 떠오르다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%83%9D%EA%B0%81%EB%82%98%EB%8B%A4"
  },

  // ==========================================
  // LEVEL 2: 중등/필수 (IDs 5021 - 5040)
  // ==========================================
  {
    level: "중등/필수",
    sentence: "고향에 계신 부모님께 감사한 마음을 담은 편지를 우체통에 [ (     ) ].",
    options: ["붙였다", "부첫다", "부쳤다", "붙엿다"],
    answerIndex: 2,
    explanation: "'부쳤다'(이)가 올바른 표준 표기입니다. 편지나 물건을 보내는 것은 '부치다'이고, 맞닿아 떨어지지 않게 하는 것은 '붙이다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항 (구별하여 적는 말)",
    standardWord: "부치다",
    dictDefinition: "편지나 물건 따위를 보내다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B6%80%EC%B9%98%EB%8B%A4"
  },
  {
    level: "중등/필수",
    sentence: "골든벨 퀴즈 대회에서 마지막 최고난도 문제의 정답을 정확히 [ (     ) ].",
    options: ["맞췄다", "맞혔다", "마췄다", "마혓다"],
    answerIndex: 1,
    explanation: "'맞혔다'(이)가 올바른 표준 표기입니다. 문제의 답을 맞히는 것은 '맞히다(맞다의 사동사)'이고, 둘 이상의 대상을 비교하거나 주문하는 것은 '맞추다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "맞히다",
    dictDefinition: "적중하다. 문제의 답을 옳게 대다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%A7%9E%ED%9E%88%EB%8B%A4"
  },
  {
    level: "중등/필수",
    sentence: "마을 주민들의 화합을 위해 동네 어귀에서 큰 잔치를 [ (     ) ].",
    options: ["벌렸다", "버렸다", "벌렸다네", "벌였다"],
    answerIndex: 3,
    explanation: "'벌였다'(이)가 올바른 표준 표기입니다. 일이나 놀이판을 차려 놓는 것은 '벌이다'이고, 사이를 넓히거나 틈을 내는 것은 '벌리다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "벌이다",
    dictDefinition: "일을 계획하여 시작하거나 판을 차려 놓다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B2%8C%EC%9D%B4%EB%8B%A4"
  },
  {
    level: "중등/필수",
    sentence: "저 먼 지평선 [ (     ) ]로 붉은 노을이 아름답게 물들고 있었다.",
    options: ["넘어", "너머", "넘머", "너엄"],
    answerIndex: 1,
    explanation: "'너머'(이)가 올바른 표준 표기입니다. 공간이나 경계의 저편을 가리키는 명사는 '너머'이며, 동사 '넘다'의 활용형은 '넘어'입니다. (한글 맞춤법 제19항)",
    rule: "한글 맞춤법 제19항",
    standardWord: "너머",
    dictDefinition: "높이나 경계를 나타내는 사물의 저쪽 공간",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%84%88%EB%A8%B8"
  },
  {
    level: "중등/필수",
    sentence: "새콤달콤한 소스를 곁들여 나른한 봄날에 잃어버린 입맛을 [ (     ) ].",
    options: ["돋구었다", "돋우었다", "돋구았다", "돋우았다"],
    answerIndex: 1,
    explanation: "'돋우었다'(이)가 올바른 표준 표기입니다. 입맛, 기운, 호기심 등을 북돋는 것은 '돋우다'이며, '돋구다'는 안경의 도수 따위를 높일 때만 씁니다. (표준어 규정 제17항)",
    rule: "표준어 규정 제17항",
    standardWord: "돋우다",
    dictDefinition: "기분, 감정, 식욕 따위를 북돋워 높이다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8F%8B%EC%9A%B0%EB%8B%A4"
  },
  {
    level: "중등/필수",
    sentence: "프라이팬에 요리를 만들기 위해 달걀을 깨뜨리고 남은 [ (     ) ]를 버렸다.",
    options: ["달걀껍질", "달걀껍데기", "달걀껍덕이", "달걀껍대기"],
    answerIndex: 1,
    explanation: "'달걀껍데기'(이)가 올바른 표준 표기입니다. 달걀, 조개, 소라처럼 단단한 겉면은 '껍데기'라 하고, 사과나 귤처럼 무른 겉면은 '껍질'이라 합니다. (표준어 규정)",
    rule: "표준어 규정 (단어의 쓰임 구분)",
    standardWord: "달걀껍데기",
    dictDefinition: "달걀의 겉을 싸고 있는 단단한 물질",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8B%AC%EA%B1%80%EA%BB%8D%EB%8D%B0%EA%B8%B0"
  },
  {
    level: "중등/필수",
    sentence: "조국의 평화와 독립을 위해 자신의 온 청춘을 아낌없이 [ (     ) ].",
    options: ["바쳤다", "받쳤다", "받혔다", "밭쳤다"],
    answerIndex: 0,
    explanation: "'바쳤다'(이)가 올바른 표준 표기입니다. 마음이나 정성을 드리는 것은 '바치다'이고, 밑을 괴는 것은 '받치다', 소나 차에 들이받히는 것은 '받히다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "바치다",
    dictDefinition: "정성을 다하여 드리거나 어떤 일에 온 힘을 기울이다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B0%94%EC%B9%98%EB%8B%A4"
  },
  {
    level: "중등/필수",
    sentence: "아침마다 싱그러운 바람을 맞으며 친구와 함께 [ (     ) ]을 걸었다.",
    options: ["등교길", "등굣길", "등교낄", "등굣낄"],
    answerIndex: 1,
    explanation: "'등굣길'(이)가 올바른 표준 표기입니다. 한자어 '등교(登校)'와 순우리말 '길'이 결합하여 뒷말 첫소리가 된소리로 발음되므로 사이시옷을 받쳐 적습니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항 (사이시옷)",
    standardWord: "등굣길",
    dictDefinition: "학교에 갈 때 다니는 길",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%93%B1%EA%B5%A3%EA%B8%B8"
  },
  {
    level: "중등/필수",
    sentence: "어두운 방 안을 은은하게 밝히는 [ (     ) ] 하나를 켜 두었다.",
    options: ["초불", "촛뿔", "초뿔", "촛불"],
    answerIndex: 3,
    explanation: "'촛불'(이)가 올바른 표준 표기입니다. 한자어 '초(燭)'와 순우리말 '불'의 결합으로 뒷말 첫소리가 된소리 [촛뿔/초뿔]로 나므로 사이시옷을 적습니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항",
    standardWord: "촛불",
    dictDefinition: "초에 켠 불",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%B4%93%EB%B6%88"
  },
  {
    level: "중등/필수",
    sentence: "배가 들어오기를 기다리며 강가 조용한 [ (     ) ]에 서 있었다.",
    options: ["나룻터", "나루터", "나루텃", "나룯터"],
    answerIndex: 1,
    explanation: "'나루터'(이)가 올바른 표준 표기입니다. 뒷말의 첫소리가 거센소리('ㅌ')인 경우에는 사이시옷을 받쳐 적지 않습니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항 (거센소리 앞 사이시옷 배제)",
    standardWord: "나루터",
    dictDefinition: "나룻배가 닿고 떠나는 일정한 장소",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%82%98%EB%A3%A8%ED%84%B0"
  },
  {
    level: "중등/필수",
    sentence: "선반 [ (     ) ]에 놓여 있는 국어사전을 조심스럽게 꺼냈다.",
    options: ["윗쪽", "위쪽", "웃쪽", "윋쪽"],
    answerIndex: 1,
    explanation: "'위쪽'(이)가 올바른 표준 표기입니다. 된소리('ㅉ') 앞에서는 사이시옷을 받쳐 적지 않으므로 '위쪽'이 표준어입니다. (표준어 규정 제12항)",
    rule: "표준어 규정 제12항 (된소리 앞 사이시옷 배제)",
    standardWord: "위쪽",
    dictDefinition: "위가 되는 편이나 방향",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9C%84%EC%BD%95"
  },
  {
    level: "중등/필수",
    sentence: "상자 안에 들어 있는 사과의 전체 [ (     ) ]를 하나씩 세어 보았다.",
    options: ["갯수", "개수", "개쑤", "갯쑤"],
    answerIndex: 1,
    explanation: "'개수'(이)가 올바른 표준 표기입니다. '개수(個數)'는 순수 한자어이므로 6개 예외 단어(곳간, 셋방, 숫자, 찻간, 툇간, 횟수)를 제외하고는 사이시옷을 쓰지 않습니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항 (순수 한자어 사이시옷 배제)",
    standardWord: "개수",
    dictDefinition: "하나하나 낱개의 수",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B0%9C%EC%88%98"
  },
  {
    level: "중등/필수",
    sentence: "현미경 렌즈의 [ (     ) ]을 정확히 맞추어 세포의 형태를 관찰했다.",
    options: ["촛점", "초점", "초쩜", "촛쩜"],
    answerIndex: 1,
    explanation: "'초점'(이)가 올바른 표준 표기입니다. '초점(焦點)'은 순수 한자어 결합이므로 사이시옷을 받쳐 적지 않습니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항",
    standardWord: "초점",
    dictDefinition: "광선이 모이는 점이나 관심이 집중되는 대상",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%B4%88%EC%A0%90"
  },
  {
    level: "중등/필수",
    sentence: "오랜 노력 끝에 결실을 맺은 땀방울의 값진 [ (     ) ]를 인정받았다.",
    options: ["댓가", "대까", "대가", "댓까"],
    answerIndex: 2,
    explanation: "'대가'(이)가 올바른 표준 표기입니다. '대가(代價)'는 한자어이므로 사이시옷을 붙이지 않는 것이 표준입니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항",
    standardWord: "대가",
    dictDefinition: "일을 하거나 물건을 넘겨주고 받는 보수나 가치",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8C%80%EA%B0%80"
  },
  {
    level: "중등/필수",
    sentence: "대학생이 되어 학교 근처에 작은 [ (     ) ]을 하나 얻어 자취를 시작했다.",
    options: ["세방", "셋방", "섿방", "셉방"],
    answerIndex: 1,
    explanation: "'셋방'(이)가 올바른 표준 표기입니다. '셋방(貰房)'은 한자어 사이시옷 예외 6개(곳간, 셋방, 숫자, 찻간, 툇간, 횟수) 중 하나로 사이시옷을 인정합니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항 (한자어 사이시옷 예외 6개)",
    standardWord: "셋방",
    dictDefinition: "세를 내고 빌려 쓰는 방",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%85%8B%EB%B0%A9"
  },
  {
    level: "중등/필수",
    sentence: "체력 단련을 위해 매일 줄넘기를 하는 [ (     ) ]를 점차 늘려 나갔다.",
    options: ["회수", "횓수", "횟수", "횝수"],
    answerIndex: 2,
    explanation: "'횟수'(이)가 올바른 표준 표기입니다. '횟수(回數)'는 한자어 사이시옷 예외 6개 단어에 해당하여 사이시옷을 적습니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항",
    standardWord: "횟수",
    dictDefinition: "반복하여 일어나는 차례의 수",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%9A%9F%EC%88%98"
  },
  {
    level: "중등/필수",
    sentence: "암호를 풀기 위해 칠판에 적힌 복잡한 [ (     ) ]의 규칙을 추리했다.",
    options: ["숫자", "수자", "숟자", "숩자"],
    answerIndex: 0,
    explanation: "'숫자'(이)가 올바른 표준 표기입니다. '숫자(數字)'는 한자어 사이시옷 예외 6개 단어 중 하나입니다. (한글 맞춤법 제30항)",
    rule: "한글 맞춤법 제30항",
    standardWord: "숫자",
    dictDefinition: "수를 나타내는 글자",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%88%AB%EC%9E%90"
  },
  {
    level: "중등/필수",
    sentence: "피리를 불며 흥겹게 부르는 전통 민요인 [ (     ) ] 노랫가락에 어깨춤이 절로 났다.",
    options: ["닐리리", "늴리리", "늬리리", "니리리"],
    answerIndex: 1,
    explanation: "'늴리리'(이)가 올바른 표준 표기입니다. 자음을 첫소리로 가지고 있는 음절의 'ㅢ'는 원음 표기 원칙에 따라 '늴'로 적습니다. (표준어 규정 제9항)",
    rule: "표준어 규정 제9항",
    standardWord: "늴리리",
    dictDefinition: "피리 따위의 악기 소리를 흉내 낸 흥겨운 말",
    pos: "감탄사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8A%B4%EB%A6%AC%EB%A6%AC"
  },
  {
    level: "중등/필수",
    sentence: "마당에 빨래를 널어 따스한 [ (     ) ]에 바짝 말렸다.",
    options: ["햇빛", "해빛", "해볕", "햇볕"],
    answerIndex: 3,
    explanation: "'햇볕'(이)가 올바른 표준 표기입니다. 따뜻하게 내리쬐는 열기나 기운을 뜻할 때는 '햇볕'을 쓰고, 눈에 보이는 빛 자체를 뜻할 때는 '햇빛'을 씁니다. (표준어 규정)",
    rule: "표준어 규정 (유의어 구별)",
    standardWord: "햇볕",
    dictDefinition: "해가 내리쬐는 기운이나 볕",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%95%AB%EB%B3%97"
  },
  {
    level: "중등/필수",
    sentence: "모든 사람이 평화롭고 건강하게 지내기를 바라는 간절한 [ (     ) ]이 담겨 있었다.",
    options: ["바램", "바램이", "바람", "바람이"],
    answerIndex: 2,
    explanation: "'바람'(이)가 올바른 표준 표기입니다. '바라다'의 명사형은 '바람'이며, '바램'은 색이 변한다는 뜻의 '바래다'에서 온 말입니다. (한글 맞춤법 제19항)",
    rule: "한글 맞춤법 제19항",
    standardWord: "바람",
    dictDefinition: "어떤 일이 뜻대로 이루어지기를 바라는 마음",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B0%94%EB%9E%8C"
  },

  // ==========================================
  // LEVEL 3: 고등/심화 (IDs 5041 - 5060)
  // ==========================================
  {
    level: "고등/심화",
    sentence: "결승선 직전에 앞서가던 경쟁 상대를 단숨에 [ (     ) ] 1위로 골인했다.",
    options: ["제치고", "젖히고", "재치고", "젇히고"],
    answerIndex: 0,
    explanation: "'제치고'(이)가 올바른 표준 표기입니다. 경쟁 상대를 물리치거나 거치적거리지 않게 젖혀 놓는 것은 '제치다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "제치다",
    dictDefinition: "경쟁 상대보다 앞서거나 방해되는 것을 물리치다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%A0%9C%EC%B9%98%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "수험생들은 그동안 갈고닦은 실력을 발휘하여 무사히 시험을 [ (     ) ].",
    options: ["치뤘다", "치럿다", "치루었다", "치렀다"],
    answerIndex: 3,
    explanation: "'치렀다'(이)가 올바른 표준 표기입니다. 기본형이 '치르다'이므로 어간 '치르-' 뒤에 '-었-'이 결합하면 'ㅡ'가 탈락하여 '치렀다'가 됩니다. '치루다'는 비표준어입니다. (한글 맞춤법 제18항)",
    rule: "한글 맞춤법 제18항 (으 탈락)",
    standardWord: "치르다",
    dictDefinition: "어떤 일을 겪어 내다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%B9%98%EB%A5%B4%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "퇴근길에 식재료를 사기 위해 마트에 잠깐 [ (     ) ].",
    options: ["들렀다", "들렸다", "들럿다", "들리었다"],
    answerIndex: 0,
    explanation: "'들렀다'(이)가 올바른 표준 표기입니다. 지나는 길에 잠깐 방문하는 것은 '들르다'이므로 과거형은 '들렀다'입니다. '들리다'는 귀에 소리가 닿거나 물건을 들어 올리는 뜻입니다. (한글 맞춤법 제18항)",
    rule: "한글 맞춤법 제18항",
    standardWord: "들르다",
    dictDefinition: "지나는 길에 잠깐 들어가 머무르다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%93%A4%EB%A5%B4%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "초겨울을 앞두고 온 가족이 모여 정성껏 배추김치를 [ (     ) ].",
    options: ["담궜다", "담갔다", "담갓다", "담구었다"],
    answerIndex: 1,
    explanation: "'담갔다'(이)가 올바른 표준 표기입니다. 기본형이 '담그다'이므로 어미 '-았-'이 결합하면 '담갔다'가 표준형입니다. '담궜다'는 잘못된 표기입니다. (한글 맞춤법 제18항)",
    rule: "한글 맞춤법 제18항",
    standardWord: "담그다",
    dictDefinition: "김치, 장, 술 따위를 익거나 삭히기 위하여 재료를 버무려 그릇에 넣다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8B%B4%EA%B7%B8%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "외출하기 전에 가스 밸브와 현관문을 단단히 [ (     ) ].",
    options: ["잠궜다", "잠갓다", "잠갔다", "잠구었다"],
    answerIndex: 2,
    explanation: "'잠갔다'(이)가 올바른 표준 표기입니다. 기본형 '잠그다'의 어간에 어미 '-았-'이 붙어 '잠갔다'로 활용합니다. (한글 맞춤법 제18항)",
    rule: "한글 맞춤법 제18항",
    standardWord: "잠그다",
    dictDefinition: "문이나 자물쇠를 채우거나 밸브를 닫다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9E%A0%EA%B7%B8%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "아침에 늦잠을 자고 일어났더니 머리카락이 온통 [ (     ) ] 헝클어져 있었다.",
    options: ["부시시하게", "부스스하게", "부스스스", "부시시스"],
    answerIndex: 1,
    explanation: "'부스스하게'(이)가 올바른 표준 표기입니다. '부시시하다'는 비표준어이며, 양성 모음화 현상이 아닌 '부스스하다'가 표준어입니다. (표준어 규정 제17항)",
    rule: "표준어 규정 제17항",
    standardWord: "부스스하다",
    dictDefinition: "머리털이나 깃털 따위가 어지럽게 일어서 있다",
    pos: "형용사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B6%80%EC%8A%A4%EC%8A%A4%ED%95%98%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "방 청소를 오랫동안 하지 않아 바닥에 책과 옷가지들이 아무렇게나 [ (     ) ] 있었다.",
    options: ["널부러져", "널브러져", "널부러저", "널브러저"],
    answerIndex: 1,
    explanation: "'널브러져'(이)가 올바른 표준 표기입니다. '널부러지다'는 잘못된 표기이며, '널브러지다'가 표준어입니다. (표준국어대사전)",
    rule: "표준어 규정 (모음 표기)",
    standardWord: "널브러지다",
    dictDefinition: "너절하게 흐트러져 늘어지다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%84%90%EB%B8%8C%EB%9F%AC%EC%A7%80%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "새해에는 네가 소망하는 모든 일들이 다 이루어지길 진심으로 [ (     ) ].",
    options: ["바래", "바라", "바래어", "바램"],
    answerIndex: 1,
    explanation: "'바라'(이)가 올바른 표준 표기입니다. 동사 '바라다'의 어간 '바라-'에 어말 어미 '-아'가 결합하면 '바라'가 됩니다. '바래'는 비표준형입니다. (한글 맞춤법 제18항)",
    rule: "한글 맞춤법 제18항",
    standardWord: "바라다",
    dictDefinition: "어떤 일이 이루어지기를 원하다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B0%94%EB%9D%BC%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "한여름 대낮의 뜨거운 [ (     ) ] 아래에서 농부들이 땀 흘리며 일하고 있었다.",
    options: ["뙤약볓", "뙈약볕", "뙈약볓", "뙤약볕"],
    answerIndex: 3,
    explanation: "'뙤약볕'(이)가 올바른 표준 표기입니다. 강하게 내리쬐는 뜨거운 볕을 뜻하며 '뙤약볕'으로 표기합니다. (표준국어대사전)",
    rule: "표준어 규정",
    standardWord: "뙤약볕",
    dictDefinition: "여름철에 몹시 뜨겁게 내리쬐는 볕",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%99%84%EC%95%BD%EB%B3%97"
  },
  {
    level: "고등/심화",
    sentence: "반에서 혼자 백 점을 맞았다고 친구들 앞에서 잘난 척하며 [ (     ) ] 태도는 옳지 않다.",
    options: ["으스대는", "으시대는", "으시대엿던", "으스데는"],
    answerIndex: 0,
    explanation: "'으스대는'(이)가 올바른 표준 표기입니다. 우쭐대며 뽐내는 것은 '으스대다'이며, '으시대다'는 비표준어입니다. (표준어 규정 제17항)",
    rule: "표준어 규정 제17항",
    standardWord: "으스대다",
    dictDefinition: "어울리지 아니하게 우쭐거리며 뽐내다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9C%BC%EC%8A%A4%EB%8C%80%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "시험 기간 내내 딴전 피우지 않고 도서관에서 [ (     ) ] 문제집만 파고들었다.",
    options: ["주구장창", "주야장청", "주야장천", "주구장청"],
    answerIndex: 2,
    explanation: "'주야장천'(이)가 올바른 표준 표기입니다. 한자어 '晝夜長川'에서 유래한 성어로 '주구장창'은 널리 퍼진 잘못된 표현입니다. (표준어 규정)",
    rule: "표준어 규정 (성어 표기)",
    standardWord: "주야장천",
    dictDefinition: "밤낮으로 쉬지 아니하고 연달아",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%A3%BC%EC%95%BC%EC%9E%A5%EC%B2%9C"
  },
  {
    level: "고등/심화",
    sentence: "기계 점검을 소홀히 했다가 공장 가동이 멈추는 큰 [ (     ) ]이 났다.",
    options: ["사단", "사탈", "사발", "사달"],
    answerIndex: 3,
    explanation: "'사달'(이)가 올바른 표준 표기입니다. 사고나 탈을 뜻하는 순우리말은 '사달'이며, '사단(事端)'은 사건의 단서나 근원을 뜻하므로 '사단이 나다'는 비표준 표현입니다. (표준국어대사전)",
    rule: "표준어 규정 (고유어와 한자어 구별)",
    standardWord: "사달",
    dictDefinition: "사고나 탈",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%82%AC%EB%8B%AC"
  },
  {
    level: "고등/심화",
    sentence: "아이를 밴 임산부는 결코 [ (     ) ]이 아니므로 무거운 짐을 들지 않도록 배려해야 한다.",
    options: ["홑몸", "홀몸", "홑몸이", "홀몸이"],
    answerIndex: 0,
    explanation: "'홑몸'(이)가 올바른 표준 표기입니다. '홑몸'은 임신하지 않은 몸을 뜻하고, '홀몸'은 혈혈단신으로 딸린 식구나 배우자가 없는 사람을 뜻합니다. (표준국어대사전)",
    rule: "표준어 규정 (유의어 구별)",
    standardWord: "홑몸",
    dictDefinition: "아이를 배지 아니한 몸. 또는 곁에 딸린 사람이 없는 몸",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%99%87%EB%8Post"
  },
  {
    level: "고등/심화",
    sentence: "무리한 사업 확장으로 인해 공들여 쌓아 올린 가업이 하루아침에 [ (     ) ]이 났다.",
    options: ["풍지박산", "풍비박살", "풍지박살", "풍비박산"],
    answerIndex: 3,
    explanation: "'풍비박산'(이)가 올바른 표준 표기입니다. 바람에 날리고 우박에 흩어진다는 뜻의 한자어 '風飛雹散'에서 유래하였으며 '풍지박산'은 잘못된 표기입니다. (표준어 규정)",
    rule: "표준어 규정 (한자 성어 표기)",
    standardWord: "풍비박산",
    dictDefinition: "사방으로 날아가 흩어짐",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%92%8D%EB%B9%84%EB%B0%95%EC%82%B0"
  },
  {
    level: "고등/심화",
    sentence: "적군에게 완전히 포위당한 아군은 그야말로 [ (     ) ]의 위기에 직면했다.",
    options: ["절대절명", "절체절명", "절체절맹", "절대절맹"],
    answerIndex: 1,
    explanation: "'절체절명'(이)가 올바른 표준 표기입니다. 몸도 목숨도 다할 지경이라는 한자어 '絶體絶命'이 표준 성어입니다. (표준국어대사전)",
    rule: "표준어 규정 (한자 성어)",
    standardWord: "절체절명",
    dictDefinition: "어찌할 수 없는 매우 위태롭고 절박한 처지",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%A0%88%EC%B2%B4%EC%A0%88%EB%AA%85"
  },
  {
    level: "고등/심화",
    sentence: "내 일은 내가 알아서 할 테니 제발 쓸데없는 [ (     ) ]은 거두어 주길 바란다.",
    options: ["오지랍", "오지랍이", "오지랖", "오지랖이"],
    answerIndex: 2,
    explanation: "'오지랖'(이)가 올바른 표준 표기입니다. 옷의 앞자락을 뜻하며 참견이 지나침을 비유할 때 '오지랖이 넓다'로 표기합니다. 받침은 'ㅍ'입니다. (한글 맞춤법 제4항)",
    rule: "한글 맞춤법 제4항",
    standardWord: "오지랖",
    dictDefinition: "웃옷이나 웃기모 등의 앞자락. 남의 일에 지나치게 참견하는 간섭",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%98%A4%EC%A7%80%EB%9E%AF"
  },
  {
    level: "고등/심화",
    sentence: "옷에 음식을 자주 흘리고 다니는 사람은 꼼꼼하지 못하고 [ (     ) ]는 핀잔을 듣기 쉽다.",
    options: ["칠칠맞다", "칠칠하다", "칠칠맞지 못하다", "칠칠맞은"],
    answerIndex: 2,
    explanation: "'칠칠맞지 못하다'(이)가 올바른 표준 표기입니다. '칠칠하다/칠칠맞다'는 성품이 깨끗하고 야무지다는 긍정적 표현이므로, 덜렁거리는 사람에게는 부정 어미를 붙여 '칠칠맞지 못하다'로 써야 맞습니다. (표준어 규정)",
    rule: "표준어 규정 (반의 부정 표현)",
    standardWord: "칠칠맞다",
    dictDefinition: "성질이나 일 처리가 반듯하고 야무지다 (부정어와 함께 쓰여 반대 의미 표현)",
    pos: "형용사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%B9%A0%EC%B9%A0%EB%A7%9E%EB%8B%A4"
  },
  {
    level: "고등/심화",
    sentence: "뱀 한 마리가 따뜻한 양지바른 바위 위에 둥그렇게 [ (     ) ]를 틀고 누워 있었다.",
    options: ["또아리", "또와리", "똬리아", "똬리"],
    answerIndex: 3,
    explanation: "'똬리'(이)가 올바른 표준 표기입니다. '또아리'의 준말 형태인 '똬리'만을 표준어로 삼았습니다. (표준어 규정 제14항)",
    rule: "표준어 규정 제14항 (준말 표기)",
    standardWord: "똬리",
    dictDefinition: "짐을 머리에 일 때 머리에 받치는 둥근 고리, 또는 뱀 따위가 몸을 둥글게 만 모양",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%98%AC%EB%A6%AC"
  },
  {
    level: "고등/심화",
    sentence: "채점관은 틀린 문제의 번호 옆에 붉은색 펜으로 큼직하게 [ (     ) ]를 쳤다.",
    options: ["가새표", "가새포", "가새효", "가새페"],
    answerIndex: 0,
    explanation: "'가새표'(이)가 올바른 표준 표기입니다. 'X'자 모양의 부호를 뜻하는 전통 고유어 표준어는 '가새표'이며, '가위표'도 복수 표준어입니다. (표준어 규정 제26항)",
    rule: "표준어 규정 제26항",
    standardWord: "가새표",
    dictDefinition: "틀리거나 취소함을 나타내는 가새(X) 모양의 표",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B0%80%EC%83%88%ED%91%9C"
  },
  {
    level: "고등/심화",
    sentence: "후반전 종료 직전에 터진 결승골이 치열했던 두 팀의 승패를 [ (     ) ].",
    options: ["갈음했다", "가늠했다", "가름했다", "갈음됫다"],
    answerIndex: 2,
    explanation: "'가름했다'(이)가 올바른 표준 표기입니다. 쪼개거나 승부·우열을 가르는 것은 '가름하다'이고, 다른 것으로 대체하는 것은 '갈음하다', 어림잡아 헤아리는 것은 '가늠하다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "가름하다",
    dictDefinition: "쪼개거나 나누다. 승부나 우열을 판가름하다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B0%80%EB%A6%84%ED%95%98%EB%8B%A4"
  },

  // ==========================================
  // LEVEL 4: 수능/기출 (IDs 5061 - 5080)
  // ==========================================
  {
    level: "수능/기출",
    sentence: "그는 이번 프로젝트의 총괄 책임자[ (     ) ] 무거운 사명감을 느끼고 있었다.",
    options: ["로써", "로써는", "로서의", "로서"],
    answerIndex: 3,
    explanation: "'로서'(이)가 올바른 표준 표기입니다. 지위나 신분, 자격을 나타내는 격 조사는 '-로서'이며, 수단이나 도구, 재료를 나타낼 때는 '-로써'를 씁니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항 (격 조사 구분)",
    standardWord: "로서",
    dictDefinition: "지위나 신분 또는 자격을 나타내는 격 조사",
    pos: "조사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%A1%9C%EC%84%9C"
  },
  {
    level: "수능/기출",
    sentence: "우리 팀은 끈질긴 협동심과 투지[ (     ) ] 역전승을 거두는 쾌거를 이룩했다.",
    options: ["로써", "로서", "로서는", "로써의"],
    answerIndex: 0,
    explanation: "'로써'(이)가 올바른 표준 표기입니다. 어떤 일의 수단, 방법, 도구를 나타내는 부사격 조사는 '-로써'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "로써",
    dictDefinition: "재료, 수단, 도구 또는 시간을 한정할 때 쓰는 격 조사",
    pos: "조사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%A1%9C%EC%8D%A8"
  },
  {
    level: "수능/기출",
    sentence: "사과를 먹[ (     ) ] 배를 먹든 네가 원하는 과일을 자유롭게 골라라.",
    options: ["던", "든", "던지", "던가"],
    answerIndex: 1,
    explanation: "'든'(이)가 올바른 표준 표기입니다. 어느 것이 선택되어도 상관없음을 나타내는 연결 어미는 '-든지/든'이며, 과거를 회상할 때는 '-던'을 씁니다. (한글 맞춤법 제56항)",
    rule: "한글 맞춤법 제56항 (선택과 회상의 구분)",
    standardWord: "든",
    dictDefinition: "어느 것이 선택되어도 상관없음을 나타내는 연결 어미. ‘-든지’의 준말",
    pos: "어미",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%93%A0"
  },
  {
    level: "수능/기출",
    sentence: "어릴 적에 살[ (     ) ] 고향 마을을 십 년 만에 다시 찾아가 보았다.",
    options: ["든", "던", "든지", "든가"],
    answerIndex: 1,
    explanation: "'던'(이)가 올바른 표준 표기입니다. 지난 일을 돌이켜 생각하는 과거 회상의 관형사형 어미는 '-던'입니다. (한글 맞춤법 제56항)",
    rule: "한글 맞춤법 제56항",
    standardWord: "던",
    dictDefinition: "과거에 완료되지 않고 지속되던 상태를 회상함을 나타내는 관형사형 어미",
    pos: "어미",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8D%98"
  },
  {
    level: "수능/기출",
    sentence: "어제 개봉한 그 영화를 직접 보았는데 내용이 참 감동적이[ (     ) ].",
    options: ["대", "대라", "데", "대요"],
    answerIndex: 2,
    explanation: "'데'(이)가 올바른 표준 표기입니다. 화자가 직접 경험하여 알게 된 사실을 회상하여 전달할 때는 '-더라'의 뜻인 '-데'를 씁니다. 남의 말을 전할 때는 '-대'입니다. (한글 맞춤법 제53항)",
    rule: "한글 맞춤법 제53항",
    standardWord: "데",
    dictDefinition: "화자가 직접 경험한 사실을 나중에 보고하듯이 말할 때 쓰는 종결 어미",
    pos: "어미",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8D%B0"
  },
  {
    level: "수능/기출",
    sentence: "선생님께서 이번 주말 과제는 월요일 아침까지 제출하라고 하시[ (     ) ].",
    options: ["대", "데", "뎨", "대라"],
    answerIndex: 0,
    explanation: "'대'(이)가 올바른 표준 표기입니다. 남이 말한 내용을 간접적으로 전달함을 나타내는 종결 어미는 '-다고 해'가 줄어든 '-대'입니다. (한글 맞춤법 제53항)",
    rule: "한글 맞춤법 제53항",
    standardWord: "대",
    dictDefinition: "남이 말한 내용을 간접적으로 전달할 때 쓰는 종결 어미. ‘-다고 해’의 준말",
    pos: "어미",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8C%80"
  },
  {
    level: "수능/기출",
    sentence: "올해 우리 학교 축구부의 경기 승[ (     ) ]이 지난해보다 크게 올랐다.",
    options: ["율", "률", "뉼", "뉼이"],
    answerIndex: 1,
    explanation: "'률'(이)가 올바른 표준 표기입니다. 모음이나 'ㄴ' 받침 뒤에는 '율'로 적고, 그 외의 받침('ㅇ' 등) 뒤에는 '률'로 적습니다. (한글 맞춤법 제11항)",
    rule: "한글 맞춤법 제11항 (두음 법칙 및 율/률 규정)",
    standardWord: "승률",
    dictDefinition: "경기에서 이긴 비율",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%8A%B9%EB%A5%A0"
  },
  {
    level: "수능/기출",
    sentence: "전체 예산 중 연구 개발비가 차지하는 비[ (     ) ]을 대폭 확대했다.",
    options: ["률", "율", "뉼", "률이"],
    answerIndex: 1,
    explanation: "'율'(이)가 올바른 표준 표기입니다. 앞 글자 '비(比)'가 모음으로 끝나므로 두음법칙에 따라 '율'로 표기합니다. (한글 맞춤법 제11항)",
    rule: "한글 맞춤법 제11항",
    standardWord: "비율",
    dictDefinition: "다른 수나 양에 대한 어떤 수나 양의 비",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B9%84%EC%9C%A8"
  },
  {
    level: "수능/기출",
    sentence: "바지 기장이 너무 짧아서 세탁소에 맡겨 단을 조금 [ (     ) ].",
    options: ["늘렸다", "느렸다", "늘렷다", "늘였다"],
    answerIndex: 3,
    explanation: "'늘였다'(이)가 올바른 표준 표기입니다. 길이를 길게 하는 것은 '늘이다'이고, 수량이나 면적, 시간을 많게 하는 것은 '늘리다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "늘이다",
    dictDefinition: "본디보다 길이를 길게 하다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8A%98%EC%9D%B4%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "회사의 경영진은 업무 효율을 높이기 위해 직원 수를 크게 [ (     ) ].",
    options: ["늘렸다", "늘였다", "늘렷다", "느렸다"],
    answerIndex: 0,
    explanation: "'늘렸다'(이)가 올바른 표준 표기입니다. 인원, 수량, 면적, 규모 등을 더 많게 하는 것은 '늘리다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "늘리다",
    dictDefinition: "수량, 부피, 세력 따위를 본디보다 많거나 크게 하다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8A%98%EB%A6%AC%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "뜨거운 사막의 모래언덕 위로 이글거리는 태양이 붉게 [ (     ) ].",
    options: ["작렬했다", "작열했다", "작혈했다", "작녈했다"],
    answerIndex: 1,
    explanation: "'작열했다'(이)가 올바른 표준 표기입니다. 불이나 태양이 이글이글 뜨겁게 타오르는 것은 '작열(灼熱)'이며, 포탄이나 운동 경기에서 홈런이 터지는 것은 '작렬(炸裂)'입니다. (표준국어대사전)",
    rule: "표준어 규정 (동음이의 한자어 구별)",
    standardWord: "작열하다",
    dictDefinition: "불이나 햇볕 따위가 몹시 뜨겁게 타오르다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9E%91%EC%97%B4%ED%95%98%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "경기 9회 말 투아웃 상황에서 대타의 시원한 만루 홈런이 [ (     ) ].",
    options: ["작열했다", "작녈했다", "작렬했다", "작혈했다"],
    answerIndex: 2,
    explanation: "'작렬했다'(이)가 올바른 표준 표기입니다. 포탄이나 힘찬 기세가 세차게 터지는 것은 '작렬(炸裂)'입니다. (표준국어대사전)",
    rule: "표준어 규정",
    standardWord: "작렬하다",
    dictDefinition: "포탄 따위가 터져 맹렬히 흩어지다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9E%91%EB%A0%AC%ED%95%98%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "부모님의 말씀을 듣지 않고 방황하며 어머니의 속을 몹시 [ (     ) ].",
    options: ["썩였다", "썩혔다", "써겼다", "썩혓다"],
    answerIndex: 0,
    explanation: "'썩였다'(이)가 올바른 표준 표기입니다. 걱정이나 근심으로 마음이나 속을 애태우는 것은 '썩이다'이며, 유기물을 부패하게 하거나 재능을 사장시키는 것은 '썩히다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "썩이다",
    dictDefinition: "걱정이나 근심으로 마음을 몹시 괴롭게 하다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%8D%A9%EC%9D%B4%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "그는 뛰어난 컴퓨터 프로그래밍 재능을 시골에서 그냥 [ (     ) ]엔 너무 아까웠다.",
    options: ["썩이기", "써기기", "썩히기", "썩히기이"],
    answerIndex: 2,
    explanation: "'썩히기'(이)가 올바른 표준 표기입니다. 재능이나 실력을 발휘하지 못하고 묻어두는 것은 '썩히다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "썩히다",
    dictDefinition: "재능이나 물건 따위를 쓰지 아니하고 그대로 두다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%8D%A9%ED%9E%88%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "생선 토막에 매콤한 간장 양념을 붓고 불을 줄여 자작하게 [ (     ) ].",
    options: ["졸였다", "졸렸다", "조렷다", "조렸다"],
    answerIndex: 3,
    explanation: "'조렸다'(이)가 올바른 표준 표기입니다. 고기나 생선을 양념하여 국물이 바짝 줄어들게 끓이는 것은 '조리다'이고, 초조하여 마음을 졸이는 것은 '졸이다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "조리다",
    dictDefinition: "고기나 생선, 채소 따위를 양념하여 국물이 거의 없게 끓이다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%A1%B0%EB%A6%AC%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "발표 결과를 기다리는 내내 합격 여부가 걱정되어 몹시 가슴을 [ (     ) ].",
    options: ["졸였다", "조렸다", "졸렸다", "조렷다"],
    answerIndex: 0,
    explanation: "'졸였다'(이)가 올바른 표준 표기입니다. 속을 태우거나 조마조마해하는 것은 '졸이다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "졸이다",
    dictDefinition: "속을 태우거나 조마조마해하다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%A1%B8%EC%9D%B4%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "삶은 국수의 물기를 빼기 위해 촘촘한 채반에 국수를 [ (     ) ].",
    options: ["받쳤다", "바쳤다", "밭쳤다", "받혔다"],
    answerIndex: 2,
    explanation: "'밭쳤다'(이)가 올바른 표준 표기입니다. 체나 거름망으로 건더기와 액체를 거르는 것은 '밭치다'입니다. (한글 맞춤법 제57항)",
    rule: "한글 맞춤법 제57항",
    standardWord: "밭치다",
    dictDefinition: "체 따위로 물기를 빼거나 가려내다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%B0%A5%EC%B9%98%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "면접실에 들어가기 전에 거울을 보며 단정하게 옷[ (     ) ]를 가다듬었다.",
    options: ["매무새", "매무시", "매무세", "메무시"],
    answerIndex: 1,
    explanation: "'매무시'(이)가 올바른 표준 표기입니다. 옷을 입거나 매만져 고치는 동작/손질을 가리킬 때는 '옷매무시를 고치다'라고 하며, 옷차림의 겉모양새는 '옷매무새'라고 합니다. (표준어 규정)",
    rule: "표준어 규정 (유의어 구별)",
    standardWord: "매무시",
    dictDefinition: "옷을 입을 때 매만지는 뒷단속이나 동작",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%A7%A4%EB%AC%B4%EC%8B%9C"
  },
  {
    level: "수능/기출",
    sentence: "청소년기에는 다양한 독서와 체험 활동을 통해 자신의 소질과 적성을 적극적으로 [ (     ) ]해야 한다.",
    options: ["개발", "계발", "게발", "걔발"],
    answerIndex: 1,
    explanation: "'계발'(이)가 올바른 표준 표기입니다. 잠재된 지혜나 능력, 소질을 일깨우는 것은 '계발(啓發)'이며, 자원이나 기술, 제품을 발전시키는 것은 '개발(開發)'입니다. (표준국어대사전)",
    rule: "표준어 규정",
    standardWord: "계발하다",
    dictDefinition: "잠재되어 있는 소질, 지능, 능력 따위를 일깨워 발전시키다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B3%84%EB%B0%9C%ED%95%98%EB%8B%A4"
  },
  {
    level: "수능/기출",
    sentence: "깊은 산속을 걷다가 갑자기 거대한 야생 멧돼지와 정면으로 [ (     ) ] 소스라치게 놀랐다.",
    options: ["맞닥닥거려", "맞닥쳐서", "맞닥뜨려서", "맞닥뜨려"],
    answerIndex: 3,
    explanation: "'맞닥뜨려'(이)가 올바른 표준 표기입니다. '맞닥뜨리다'와 '맞닥뜨리다'는 복수 표준어로 맞서 마주침을 뜻합니다. (표준어 규정 제26항)",
    rule: "표준어 규정 제26항",
    standardWord: "맞닥뜨리다",
    dictDefinition: "뜻밖에 마주 대하다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%A7%9E%EB%8B%A5%EB%96%A8%EB%A6%AC%EB%8B%A4"
  },

  // ==========================================
  // LEVEL 5: 일반/실무 (IDs 5081 - 5100)
  // ==========================================
  {
    level: "일반/실무",
    sentence: "부서장이 기안서 내용을 검토한 뒤 최종적으로 서류에 [ (     ) ]를 마쳤다.",
    options: ["결재", "결제", "결재를", "결제를"],
    answerIndex: 0,
    explanation: "'결재'(이)가 올바른 표준 표기입니다. 부하 직원이 올린 안건을 상사가 허가·승인하는 것은 '결재(決裁)'이며, 대금을 지급하는 것은 '결제(決濟)'입니다. (표준국어대사전)",
    rule: "행정/실무 용어 규정 (결재와 결제 구별)",
    standardWord: "결재",
    dictDefinition: "부하가 제출한 안건을 상관이 검토하여 허가하거나 승인함",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B2%B0%EC%9E%AC"
  },
  {
    level: "일반/실무",
    sentence: "온라인 쇼핑몰에서 물건을 주문하고 신용카드로 대금 [ (     ) ]를 완료했다.",
    options: ["결재", "결재를", "결제", "결제를"],
    answerIndex: 2,
    explanation: "'결제'(이)가 올바른 표준 표기입니다. 금전 관계를 결말짓거나 대금을 지불하는 것은 '결제(決濟)'입니다. (표준국어대사전)",
    rule: "행정/금융 규정",
    standardWord: "결제",
    dictDefinition: "증권 또는 대금을 주고받아 매매 당사자 간의 거래 관계를 끝맺는 일",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B2%B0%EC%A0%9C"
  },
  {
    level: "일반/실무",
    sentence: "비 오는 날 어두운 길을 빠르게 뛰어가다가는 미끄러져 넘어지기 [ (     ) ].",
    options: ["쉽상이다", "십상됫다", "쉽상됫다", "십상이다"],
    answerIndex: 3,
    explanation: "'십상이다'(이)가 올바른 표준 표기입니다. '열에 여덟아홉'을 뜻하는 '십상팔구(十常八九)'에서 유래한 말로 '쉽상'은 잘못된 표기입니다. (표준국어대사전)",
    rule: "표준어 규정",
    standardWord: "십상이다",
    dictDefinition: "열에 여덟이나 아홉 정도로 거의 틀림없다",
    pos: "형용사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%8B%AD%EC%83%81%EC%9D%B4%EB%8B%A4"
  },
  {
    level: "일반/실무",
    sentence: "정숙한 도서관 내부에서는 타인을 위해 큰 소리로 통화하는 행동을 [ (     ) ] 주십시오.",
    options: ["삼가", "삼가해", "삼가시", "삼가하게"],
    answerIndex: 0,
    explanation: "'삼가'(이)가 올바른 표준 표기입니다. 기본형이 '삼가다'이므로 어간 '삼가-' 뒤에 어미 '-아'가 붙으면 '삼가'가 됩니다. '삼가하다'는 잘못된 조어입니다. (표준어 규정)",
    rule: "표준어 규정 (기본형 어간 활용)",
    standardWord: "삼가다",
    dictDefinition: "몸가짐이나 행동을 조심하다. 꺼리는 마음으로 피하거나 자제하다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%82%BC%EA%B0%80%EB%8B%A4"
  },
  {
    level: "일반/실무",
    sentence: "전국에서 [ (     ) ] 하는 유명한 요리사들이 한자리에 모여 경연을 펼쳤다.",
    options: ["내노라", "내노라라", "내로라", "내로라라"],
    answerIndex: 2,
    explanation: "'내로라'(이)가 올바른 표준 표기입니다. '나+이(서술격 조사)+오+다'가 굳어진 고어적 표현으로 '내로라하다'가 표준어입니다. '내노라'는 비표준어입니다. (한글 맞춤법)",
    rule: "표준어 규정 (유래 표기)",
    standardWord: "내로라하다",
    dictDefinition: "어떤 분야에서 대표가 될 만하다고 뽐내다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%82%B4%EB%A1%9C%EB%9D%BC%ED%95%98%EB%8B%A4"
  },
  {
    level: "일반/실무",
    sentence: "우리네 인생에는 기쁨과 슬픔 등 온갖 [ (     ) ]이 씨줄과 날줄처럼 얽혀 있다.",
    options: ["희노애락", "희로애락", "희로애낙", "희노애낙"],
    answerIndex: 1,
    explanation: "'희로애락'(이)가 올바른 표준 표기입니다. 한자어 '喜怒哀樂'에서 둘째 음절의 '怒'는 두음법칙이 적용되지 않지만 본음 대신 활음조 현상으로 '로'로 발음하고 표기합니다. (한글 맞춤법 제52항)",
    rule: "한글 맞춤법 제52항 (한자어 모음 활음조)",
    standardWord: "희로애락",
    dictDefinition: "기쁨과 노여움, 슬픔과 즐거움이라는 인간의 온갖 감정",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%9D%AC%EB%A1%9C%EC%95%A0%EB%9D%BD"
  },
  {
    level: "일반/실무",
    sentence: "가을 햇살을 머금은 탐스러운 포도송이에 포도알이 [ (     ) ] 영글어 있었다.",
    options: ["알알히", "알알스레", "알알이", "알알이히"],
    answerIndex: 2,
    explanation: "'알알이'(이)가 올바른 표준 표기입니다. 명사 첩어 뒤에 붙는 부사 파생 접미사는 '-이'로 적습니다. (한글 맞춤법 제51항)",
    rule: "한글 맞춤법 제51항",
    standardWord: "알알이",
    dictDefinition: "알마다 모두. 알알으로",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%95%8C%EC%95%8C%EC%9D%B4"
  },
  {
    level: "일반/실무",
    sentence: "이 가벼운 바람막이 점퍼는 일교차가 큰 환절기에 입기에 정말 [ (     ) ]이다.",
    options: ["안성맞춤", "안성마춤", "안성맏춤", "안성맞춤이"],
    answerIndex: 0,
    explanation: "'안성맞춤'(이)가 올바른 표준 표기입니다. 경기도 안성에서 유기를 주문하여 맞춘 것처럼 꼭 맞는다는 데서 유래한 단어로 '맞춤'으로 적습니다. (표준국어대사전)",
    rule: "표준어 규정",
    standardWord: "안성맞춤",
    dictDefinition: "요구하거나 생각한 대로 아주 잘 들어맞음",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%95%88%EC%84%B1%EB%A7%9E%EC%B6%A4"
  },
  {
    level: "일반/실무",
    sentence: "온 가족이 함께 모여 식사를 즐길 수 있도록 식탁이 놓인 거실 공간을 [ (     ) ]하게 꾸몄다.",
    options: ["넓직", "넙직", "널직", "널찍"],
    answerIndex: 3,
    explanation: "'널찍'(이)가 올바른 표준 표기입니다. '넓-'에 된소리 접미사가 붙어 본음 형태가 변한 것은 소리대로 '널찍하다'로 적습니다. (한글 맞춤법 제21항)",
    rule: "한글 맞춤법 제21항",
    standardWord: "널찍하다",
    dictDefinition: "꽤 넓다",
    pos: "형용사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%84%90%EC%BE%8D%ED%95%98%EB%8B%A4"
  },
  {
    level: "일반/실무",
    sentence: "급한 일이 아니니 아이에게 너무 서두르라고 [ (     ) ]하지 마세요.",
    options: ["닥달", "닥딸", "닦달", "닦딸"],
    answerIndex: 2,
    explanation: "'닦달'(이)가 올바른 표준 표기입니다. 남을 몹시 볶아대거나 다잡는 것은 '닦달하다'이며 받침은 'ㄲ'입니다. (한글 맞춤법 제4항)",
    rule: "한글 맞춤법 제4항",
    standardWord: "닦달하다",
    dictDefinition: "남을 단단히 윽박질러서 혼을 내다. 물건을 닦고 매만지다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%8B%A6%EB%8B%AC%ED%95%98%EB%8B%A4"
  },
  {
    level: "일반/실무",
    sentence: "그는 겉모습이 조금 [ (     ) ]해 보여도 마음씨가 아주 정직하고 바른 사람이다.",
    options: ["어리숙", "어수룩", "어수룩이", "어리숙이"],
    answerIndex: 1,
    explanation: "'어수룩'(이)가 올바른 표준 표기입니다. 순박하고 조금 모자란 듯한 모양을 뜻하는 표준어는 '어수룩하다'이며, '어리숙하다'는 비표준어입니다. (표준어 규정 제17항)",
    rule: "표준어 규정 제17항",
    standardWord: "어수룩하다",
    dictDefinition: "순박하고 부드러워 어수룩하다. 모질지 못하다",
    pos: "형용사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%96%B4%EC%88%98%EB%A3%A9%ED%95%98%EB%8B%A4"
  },
  {
    level: "일반/실무",
    sentence: "바쁘신 와중에도 [ (     ) ]하고 이렇게 찾아뵙게 되어 대단히 송구합니다.",
    options: ["염치불구", "염치불고", "염치불괴", "염치불고하"],
    answerIndex: 1,
    explanation: "'염치불고'(이)가 올바른 표준 표기입니다. 체면이나 부끄러움을 돌아보지 않는다는 한자어 '廉恥不顧'에서 유래하여 '염치불고'가 맞습니다. '불구(不具)'는 몸이 온전하지 못함을 뜻합니다. (표준국어대사전)",
    rule: "표준어 규정 (한자 어휘 정확한 의미 사용)",
    standardWord: "염치불고",
    dictDefinition: "염치를 돌아보지 아니함",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%97%BC%EC%B9%98%EB%B6%88%EA%B3%A0"
  },
  {
    level: "일반/실무",
    sentence: "의지할 친척 하나 없이 타국에 [ (     ) ]으로 건너와 굳건하게 자수성가했다.",
    options: ["홀홀단신", "혈혈단신이", "홀홀단신이", "혈혈단신"],
    answerIndex: 3,
    explanation: "'혈혈단신'(이)가 올바른 표준 표기입니다. 외로운 홀몸을 뜻하는 성어는 '孑孑單身(혈혈단신)'이며, '홀홀단신'은 잘못된 표기입니다. (표준어 규정)",
    rule: "표준어 규정 (한자 성어)",
    standardWord: "혈혈단신",
    dictDefinition: "의지할 곳이 없는 외로운 홀몸",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%98%88%ED%98%88%EB%8B%A8%EC%8B%A0"
  },
  {
    level: "일반/실무",
    sentence: "신규 법률 리스크를 사전에 예방하기 위해 외부 전문 변호사에게 세부 조항을 [ (     ) ]했다.",
    options: ["자문", "자문구", "상담구", "자문요청"],
    answerIndex: 0,
    explanation: "'자문'(이)가 올바른 표준 표기입니다. '자문(諮問)'은 전문가에게 의견을 묻는다는 뜻 자체이므로 '자문을 구하다'는 역전앞과 같은 겹말이며, '자문하다'로 쓰는 것이 바릅니다. (표준국어대사전)",
    rule: "실무 어법 규정 (중복 표현 순화)",
    standardWord: "자문하다",
    dictDefinition: "어떤 일에 대하여 의견을 묻다",
    pos: "동사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%9E%90%EB%AC%B8%ED%95%98%EB%8B%A4"
  },
  {
    level: "일반/실무",
    sentence: "회사는 새로운 [ (     ) ]를 맞아 매출 목표를 전년 대비 15% 상향 조정했다.",
    options: ["회계년도", "회계연도의", "회계년도의", "회계연도"],
    answerIndex: 3,
    explanation: "'회계연도'(이)가 올바른 표준 표기입니다. '연도(年度)'는 사무나 회계 작업상 설정한 기간을 뜻할 때 두음법칙에 따라 '연도'로 적습니다. 특정한 연도 뒤에 붙는 접미사는 '2026년도'처럼 씁니다. (한글 맞춤법 제10항)",
    rule: "한글 맞춤법 제10항 (두음 법칙)",
    standardWord: "회계연도",
    dictDefinition: "회계 기록과 계산을 정리하기 위해 편의상 구분한 1년의 기간",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%9A%8C%EA%B3%84%EC%97%B0%EB%8F%84"
  },
  {
    level: "일반/실무",
    sentence: "가게 주인은 외상값을 한 푼도 빠짐없이 낡은 [ (     ) ]에 꼼꼼히 기록해 두었다.",
    options: ["치부책", "치부장", "치부책이", "치부장이"],
    answerIndex: 0,
    explanation: "'치부책'(이)가 올바른 표준 표기입니다. 돈이나 물건이 오고 가는 내역을 적는 장부는 '치부책(置簿冊)'이 표준어입니다. (표준국어대사전)",
    rule: "표준어 규정",
    standardWord: "치부책",
    dictDefinition: "금전이나 물품의 출납을 기록하는 장부",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%B9%98%EB%B6%80%EC%B1%85"
  },
  {
    level: "일반/실무",
    sentence: "온갖 인생의 모진 [ (     ) ]를 다 겪고 난 뒤에야 비로소 삶의 깊은 지혜를 깨달았다.",
    options: ["풍파이", "풍파", "풍파를", "풍파을"],
    answerIndex: 1,
    explanation: "'풍파'(이)가 올바른 표준 표기입니다. 세상살이의 어려움이나 환난을 비유하는 한자어는 '風波(풍파)'입니다. (표준국어대사전)",
    rule: "표준어 규정",
    standardWord: "풍파",
    dictDefinition: "바람과 물결. 세상살이의 모진 고난이나 시련",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%92%8D%ED%8C%8C"
  },
  {
    level: "일반/실무",
    sentence: "인기 가수의 콘서트 티켓 예매가 시작되자마자 전 좌석이 [ (     ) ] 매진되었다.",
    options: ["금새", "금세에", "금세", "금새에"],
    answerIndex: 2,
    explanation: "'금세'(이)가 올바른 표준 표기입니다. '지금 바로'를 뜻하는 말로 '금시(今時)에'가 줄어든 말이므로 '금세'로 표기합니다. (한글 맞춤법 제35항)",
    rule: "한글 맞춤법 제35항",
    standardWord: "금세",
    dictDefinition: "지금 바로. ‘금시에’가 줄어든 말",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B8%88%EC%84%B8"
  },
  {
    level: "일반/실무",
    sentence: "아침부터 하늘에 먹구름이 끼더니 하루 종일 비가 [ (     ) ] 내렸다.",
    options: ["오락까락", "오라가락", "오락가락이", "오락가락"],
    answerIndex: 3,
    explanation: "'오락가락'(이)가 올바른 표준 표기입니다. 비가 오다 말다 하거나 정신이 맑았다 흐렸다 하는 모양을 나타내는 부사는 '오락가락'입니다. (표준국어대사전)",
    rule: "한글 맞춤법",
    standardWord: "오락가락",
    dictDefinition: "왔다 갔다 하거나 일이나 상태가 일정치 않고 뒤바뀌는 모양",
    pos: "부사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%98%A4%EB%9D%BD%EA%B0%80%EB%9D%BD"
  },
  {
    level: "일반/실무",
    sentence: "모든 구성원이 각자의 자리에서 맡은 바 [ (     ) ]을 성실히 수행해야 조직이 발전한다.",
    options: ["역활", "역활이", "역할", "역할이"],
    answerIndex: 2,
    explanation: "'역할'(이)가 올바른 표준 표기입니다. 자기가 맡은 바 직책이나 임무를 뜻하는 한자어는 '役割(역할)'이며, '역활'은 잘못된 발음과 표기입니다. (표준어 규정)",
    rule: "표준어 규정 (한자어 표준 발음 및 표기)",
    standardWord: "역할",
    dictDefinition: "자기가 마땅히 하여야 할 직책이나 임무",
    pos: "명사",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%97%AD%ED%95%A0"
  }
];

// Validate all questions
console.log(`Starting validation of ${rawQuestions.length} brand-new questions...`);
let allValid = true;
const formattedQuestions = [];

rawQuestions.forEach((q, idx) => {
  const id = 5001 + idx;
  const questionObj = {
    id: id,
    category: "어휘·표기",
    level: q.level,
    question: `다음 문장의 빈칸에 들어갈 알맞은 낱말을 골라보세요. (문항 #${id})`,
    sentence: q.sentence,
    options: q.options,
    answerIndex: q.answerIndex,
    explanation: q.explanation,
    rule: q.rule,
    standardWord: q.standardWord,
    dictDefinition: q.dictDefinition,
    pos: q.pos,
    dictLink: q.dictLink
  };

  const check = validator.validateSentenceIntegrity(questionObj);
  if (!check.isValid) {
    console.error(`❌ Validation Failed for #${id} (${q.standardWord}):`, check.errors);
    allValid = false;
  }
  formattedQuestions.push(questionObj);
});

if (!allValid) {
  console.error("Validation failed! Aborting questions generation.");
  process.exit(1);
}

console.log(`🎉 All ${formattedQuestions.length} questions validated 100% green with korean_grammar_validator.js!`);

// Load existing questions.js
const questionsPath = path.join(__dirname, '../questions.js');
const rawCode = fs.readFileSync(questionsPath, 'utf8');

// Find insertion point before closing array: '];'
const closingIndex = rawCode.lastIndexOf('];');
if (closingIndex === -1) {
  console.error("Could not find closing '];' in questions.js");
  process.exit(1);
}

// Convert formatted questions to clean JS code string
const newQuestionsCode = formattedQuestions.map(q => '  ' + JSON.stringify(q, null, 2).replace(/\n/g, '\n  ')).join(',\n');

const updatedCode = rawCode.substring(0, closingIndex) + ',\n' + newQuestionsCode + '\n];\n\nif (typeof module !== "undefined" && module.exports) {\n  module.exports = { SPELLING_QUESTION_BANK };\n}\n';

// Write to questions.js and www/questions.js
fs.writeFileSync(questionsPath, updatedCode, 'utf8');
const wwwQuestionsPath = path.join(__dirname, '../www/questions.js');
fs.writeFileSync(wwwQuestionsPath, updatedCode, 'utf8');

console.log("✅ Successfully appended 100 new questions to questions.js and www/questions.js! Total: 5,100 questions.");
