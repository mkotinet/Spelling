/**
 * 하루맞춤 (Haru Matchum) - 국어 맞춤법 문제은행 데이터베이스
 * 국립국어원 표준국어대사전 Open API 실시간 데이터 연동 (API KEY: C0E0448602CD3B859FDDD29BBD84289C)
 */

const SPELLING_QUESTION_BANK = [
  {
    "id": 1,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "다음 중 올바른 맞춤법을 골라보세요.",
    "sentence": "오늘따라 [ 왠지 / 웬지 ] 기분이 좋아!",
    "options": [
      "왠지",
      "웬지"
    ],
    "answerIndex": 0,
    "explanation": "'왠지'는 '왜인지'의 준말로, '왜 그런지 모르게'라는 뜻입니다. 의문사 '왜'가 결합한 경우에만 '왠지'로 표기하고, 그 외에는 모두 '웬(웬일, 웬 떡)'을 씁니다.",
    "rule": "한글 맞춤법 제54항",
    "standardWord": "왠지",
    "dictDefinition": "왜 그런지 모르게. 또는 뚜렷한 이유도 없이.",
    "pos": "부사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=462184&searchKeywordTo=3"
  },
  {
    "id": 2,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "다음 중 빈칸에 알맞은 말은?",
    "sentence": "네가 여기에 [ 웬일 / 왠일 ]이니?",
    "options": [
      "웬일",
      "왠일"
    ],
    "answerIndex": 0,
    "explanation": "'어찌 된 일'이라는 뜻의 단어는 '웬일'이 맞습니다. '왜'의 의미가 아닌 '어찌 된'의 관형사는 '웬'으로 적습니다.",
    "rule": "표준국어대사전 표준어 규정",
    "standardWord": "웬일",
    "dictDefinition": "어찌 된 일. 의외의 뜻을 나타낸다.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=468790&searchKeywordTo=3"
  },
  {
    "id": 3,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "날짜를 물어볼 때 올바른 표현은?",
    "sentence": "오늘이 [ 며칠 / 몇일 ]인지 아니?",
    "options": [
      "며칠",
      "몇일"
    ],
    "answerIndex": 0,
    "explanation": "'몇 월 몇 일'이 아니라 '몇 월 며칠'이 바른 표기입니다. 어원이 분명하지 않은 것은 소리 나는 대로 적는다는 규정에 따라 '며칠'로 씁니다.",
    "rule": "한글 맞춤법 제27항 [붙임2]",
    "standardWord": "며칠",
    "dictDefinition": "그달의 몇째 되는 날.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=115156&searchKeywordTo=3"
  },
  {
    "id": 4,
    "category": "어간·어미",
    "level": "초등/기초",
    "question": "내일 약속을 정할 때 올바른 표현은?",
    "sentence": "선생님, 내일 방과 후에 [ 봬요 / 뵈요 ]!",
    "options": [
      "봬요",
      "뵈요"
    ],
    "answerIndex": 0,
    "explanation": "'뵈어요'의 준말이므로 '봬요'가 맞습니다. '뵈' 뒤에 어미 '-어'가 붙으면 '봬'가 됩니다. '하/해'를 대입해서 '해요'가 어울리므로 '봬요'입니다.",
    "rule": "한글 맞춤법 제35항",
    "standardWord": "봬요",
    "dictDefinition": "‘보이다’의 준말. 윗사람을 대면하여 만나다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=뵈다"
  },
  {
    "id": 5,
    "category": "어간·어미",
    "level": "중등/기본",
    "question": "부정 표현에서 올바른 단어를 골라보세요.",
    "sentence": "숙제를 아직 다 하지 [ 못했어 / 못 헸어 ]!",
    "options": [
      "못했어",
      "못 헸어"
    ],
    "answerIndex": 0,
    "explanation": "'못하다'는 한 단어로 붙여 쓰는 보조용언이며, 모음은 'ㅐ'를 써서 '못했어'가 맞습니다.",
    "rule": "표준어 규정 제18항",
    "standardWord": "못하다",
    "dictDefinition": "어떤 일을 일정한 수준에 못 미치게 하거나, 그 일을 할 능력이 없다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=423255&searchKeywordTo=3"
  },
  {
    "id": 6,
    "category": "어간·어미",
    "level": "중등/기본",
    "question": "다음 중 올바른 표기를 고르세요.",
    "sentence": "지금 집에 가야 [ 돼 / 되 ]!",
    "options": [
      "돼",
      "되"
    ],
    "answerIndex": 0,
    "explanation": "'돼'는 '되어'의 준말입니다. 문장의 끝에는 어미가 와야 하므로 '되' 단독으로 올 수 없고 '되어(돼)'가 되어야 합니다. ('해'를 넣어 자연스러우면 '돼', '하'를 넣어 자연스러우면 '되')",
    "rule": "한글 맞춤법 제35항",
    "standardWord": "되다",
    "dictDefinition": "다른 상태나 성질로 바뀌거나 변하다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=90723&searchKeywordTo=3"
  },
  {
    "id": 7,
    "category": "어휘·표기",
    "level": "중등/기본",
    "question": "시간이 얼마 지나지 않았음을 나타낼 때 맞는 말은?",
    "sentence": "소식을 듣고 [ 금세 / 금새 ] 달려왔어.",
    "options": [
      "금세",
      "금새"
    ],
    "answerIndex": 0,
    "explanation": "'금시에'가 줄어든 말이므로 '금세'가 맞습니다. '물건값'을 뜻하는 '금새'와 구별해야 합니다.",
    "rule": "한글 맞춤법 제32항",
    "standardWord": "금세",
    "dictDefinition": "지금 바로. ‘금시에’가 줄어든 말로 구어체에서 많이 사용된다.",
    "pos": "부사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=46802&searchKeywordTo=3"
  },
  {
    "id": 8,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "매우 드물거나 신기할 때 쓰는 바른 표현은?",
    "sentence": "오늘 하늘에 정말 [ 희한한 / 희안한 ] 구름이 떴어!",
    "options": [
      "희한한",
      "희안한"
    ],
    "answerIndex": 0,
    "explanation": "한자어 '드물 희(稀)'에 '드물 한(罕)'을 쓰는 '희한(稀罕)'이므로 '희한하다'가 표준어입니다.",
    "rule": "표준어 규정 제17항",
    "standardWord": "희한하다",
    "dictDefinition": "매우 드물거나 신기하다.",
    "pos": "형용사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=507493&searchKeywordTo=3"
  },
  {
    "id": 9,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "황당하거나 기가 막힐 때 쓰는 표현은?",
    "sentence": "이런 실수를 하다니 정말 [ 어이없다 / 어의없다 ].",
    "options": [
      "어이없다",
      "어의없다"
    ],
    "answerIndex": 0,
    "explanation": "'어처구니가 없다'와 같은 뜻으로 '어이없다'가 표준어입니다. '어의'는 조선시대 임금의 주치의를 뜻합니다.",
    "rule": "표준국어대사전 표제어",
    "standardWord": "어이없다",
    "dictDefinition": "일이 너무 뜻밖이어서 기가 막히는 듯하다.",
    "pos": "형용사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=460918&searchKeywordTo=3"
  },
  {
    "id": 10,
    "category": "어간·어미",
    "level": "초등/기초",
    "question": "부정의 부사와 용언 표기를 구별해 보세요.",
    "sentence": "그건 네 잘못이 [ 아니야 / 않이야 ].",
    "options": [
      "아니야",
      "않이야"
    ],
    "answerIndex": 0,
    "explanation": "형용사 '아니다'의 어간 '아니-'에 어미 '-야'가 붙은 형태이므로 '아니야'가 맞습니다. '않-'은 '아니하-'의 줄임말입니다.",
    "rule": "한글 맞춤법 제39항",
    "standardWord": "아니다",
    "dictDefinition": "어떤 사실을 부정하는 뜻을 나타내는 말.",
    "pos": "형용사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=453924&searchKeywordTo=3"
  },
  {
    "id": 11,
    "category": "어휘·표기",
    "level": "고등/실전",
    "question": "카드 대금을 치르거나 결산할 때 맞는 단어는?",
    "sentence": "카운터에서 체크카드로 [ 결제 / 결재 ]를 마쳤어.",
    "options": [
      "결제",
      "결재"
    ],
    "answerIndex": 0,
    "explanation": "돈이나 대금을 치르는 경제적 거래는 '결제(決濟)'이고, 상사에게 서류 승인을 받는 것은 '결재(決裁)'입니다.",
    "rule": "표준국어대사전 어휘 구별",
    "standardWord": "결제",
    "dictDefinition": "일을 처리하여 끝을 냄.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=393560&searchKeywordTo=3"
  },
  {
    "id": 12,
    "category": "어휘·표기",
    "level": "중등/기본",
    "question": "상태가 호전되거나 다른 것보다 좋을 때 쓰는 말은?",
    "sentence": "감기 기운이 어제보다 훨씬 [ 나았어 / 낳았어 ].",
    "options": [
      "나았어",
      "낳았어"
    ],
    "answerIndex": 0,
    "explanation": "'낫다(치유되다/더 우수하다)'는 ㅅ 불규칙 용언으로 '나아/나았다'로 활용합니다. '낳다'는 아이를 출산하거나 결과를 가져올 때 씁니다.",
    "rule": "한글 맞춤법 제18항 (ㅅ 불규칙)",
    "standardWord": "낫다",
    "dictDefinition": "병이나 상처 따위가 고쳐져 본래대로 되다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=403928&searchKeywordTo=3"
  },
  {
    "id": 13,
    "category": "어간·어미",
    "level": "초등/기초",
    "question": "문장의 끝맺음에서 맞는 형태는?",
    "sentence": "벌써 10시인데 시험공부는 [ 어떻게 / 어떡해 ]?",
    "options": [
      "어떡해",
      "어떻게"
    ],
    "answerIndex": 0,
    "explanation": "'어떻게 해'가 줄어든 형태가 '어떡해'입니다. 문장 끝에서 서술어로 쓰일 때는 '어떡해'를 쓰고, 뒤에 동사가 올 때는 부사 '어떻게(어떻게 가니?)'를 씁니다.",
    "rule": "한글 맞춤법 제35항",
    "standardWord": "어떡해",
    "dictDefinition": "‘어떻게 하다’가 줄어든 말.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=어떡하다"
  },
  {
    "id": 14,
    "category": "어휘·표기",
    "level": "고등/실전",
    "question": "희망이나 소망을 나타낼 때 올바른 표현은?",
    "sentence": "네 꿈이 꼭 이루어지길 [ 바라 / 바래 ].",
    "options": [
      "바라",
      "바래"
    ],
    "answerIndex": 0,
    "explanation": "기본형은 '바라다'이므로 어미 '-아'가 붙으면 '바라'가 맞습니다. '바래다'는 빛깔이 바래거나 배웅할 때 쓰는 말입니다.",
    "rule": "표준어 규정 제18항",
    "standardWord": "바라다",
    "dictDefinition": "생각이나 바람대로 어떤 일이나 상태가 이루어지거나 그렇게 되었으면 하고 생각하다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=428737&searchKeywordTo=3"
  },
  {
    "id": 15,
    "category": "어간·어미",
    "level": "초등/기초",
    "question": "단어의 끝소리와 서술격 조사 결합 표기입니다.",
    "sentence": "여기가 바로 우리들의 아지트[ 예요 / 에요 ].",
    "options": [
      "예요",
      "에요"
    ],
    "answerIndex": 0,
    "explanation": "받침이 없는 체언 뒤에는 '이에요'의 준말인 '예요'가 붙습니다. (아지트+이에요 -> 아지트예요). 받침이 있는 체언 뒤에는 '이에요'가 옵니다.",
    "rule": "한글 맞춤법 제26항",
    "standardWord": "예요",
    "dictDefinition": "서술격 조사 ‘이다’나 형용사 ‘아니다’의 어간 뒤에 붙어, 어떤 상태나 사실을 서술하는 뜻을 나타내는 종결 어미.",
    "pos": "어미",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=이에요"
  },
  {
    "id": 16,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "마음이 들떠서 두근거릴 때 쓰는 표준어는?",
    "sentence": "소풍 가기 전날 밤의 [ 설렘 / 설레임 ].",
    "options": [
      "설렘",
      "설레임"
    ],
    "answerIndex": 0,
    "explanation": "기본형은 '설레다'이므로 명사형은 '설렘'이 맞습니다. '설레이다'는 비표준어이므로 '설레임'은 잘못된 표기입니다.",
    "rule": "표준어 규정 제16항",
    "standardWord": "설레다",
    "dictDefinition": "마음이 가라앉지 아니하고 들떠서 두근거리다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=443099&searchKeywordTo=3"
  },
  {
    "id": 17,
    "category": "사이시옷",
    "level": "중등/심화",
    "question": "하늘에 떠 있는 해를 다정하게 부르는 올바른 말은?",
    "sentence": "아침에 방긋 솟아오른 [ 해님 / 햇님 ].",
    "options": [
      "해님",
      "햇님"
    ],
    "answerIndex": 0,
    "explanation": "'님'은 접미사이므로 사이시옷이 들어갈 수 없습니다. 합성어가 아니기 때문에 '해님'이 바른 표기입니다.",
    "rule": "한글 맞춤법 제30항 (사이시옷 규정)",
    "standardWord": "해님",
    "dictDefinition": "‘해’를 인격화하여 높이거나 다정하게 이르는 말.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=365527&searchKeywordTo=3"
  },
  {
    "id": 18,
    "category": "사이시옷",
    "level": "고등/실전",
    "question": "학교에 가는 길을 뜻하는 올바른 합성어는?",
    "sentence": "친구와 손잡고 걷는 즐거운 [ 등굣길 / 등교길 ].",
    "options": [
      "등굣길",
      "등교길"
    ],
    "answerIndex": 0,
    "explanation": "순우리말과 한자어(등교+길)의 합성어로서 뒷말의 첫소리가 된소리[등교낄]로 나므로 사이시옷을 받쳐 적어 '등굣길'이 맞습니다.",
    "rule": "한글 맞춤법 제30항",
    "standardWord": "등굣길",
    "dictDefinition": "학생이 학교로 가는 길.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=95950&searchKeywordTo=3"
  },
  {
    "id": 19,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "몸이 야위고 핏기가 없을 때 맞는 형용사는?",
    "sentence": "감기 때문에 얼굴이 많이 [ 핼쑥해졌어 / 핼쓱해졌어 ].",
    "options": [
      "핼쑥해졌어",
      "핼쓱해졌어"
    ],
    "answerIndex": 0,
    "explanation": "'얼굴에 핏기가 없고 수척하다'의 뜻을 지닌 표준어는 '핼쑥하다'입니다. '핼쓱하다'는 비표준어입니다.",
    "rule": "표준어 규정 제25항",
    "standardWord": "핼쑥하다",
    "dictDefinition": "얼굴에 핏기가 없고 파리하다.",
    "pos": "형용사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=499053&searchKeywordTo=3"
  },
  {
    "id": 20,
    "category": "어휘·표기",
    "level": "중등/기본",
    "question": "지식이나 기술을 전달할 때 쓰는 올바른 동사는?",
    "sentence": "동생에게 수학 문제를 [ 가르쳐 / 가리켜 ] 주었다.",
    "options": [
      "가르쳐",
      "가리켜"
    ],
    "answerIndex": 0,
    "explanation": "지식이나 방법을 알려주는 것은 '가르치다'이고, 손가락이나 방향을 향하게 하는 것은 '가리키다'입니다.",
    "rule": "표준국어대사전 동사 변별",
    "standardWord": "가르치다",
    "dictDefinition": "지식이나 기능, 이치 따위를 깨닫게 하거나 익히게 하다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=385150&searchKeywordTo=3"
  },
  {
    "id": 21,
    "category": "어간·어미",
    "level": "중등/심화",
    "question": "과거에 직접 겪은 일을 회상할 때 쓰는 어미는?",
    "sentence": "어제 본 영화 진짜 [ 재미있더라 / 재미있드라 ]!",
    "options": [
      "재미있더라",
      "재미있드라"
    ],
    "answerIndex": 0,
    "explanation": "과거 회상을 나타내는 어미는 '-더라'가 표준어입니다. '-드라'는 방언 혹은 잘못된 표기입니다.",
    "rule": "표준어 규정 제17항",
    "standardWord": "-더라",
    "dictDefinition": "해라할 자리에 쓰여, 화자가 과거에 직접 경험하여 새로이 알게 된 사실을 그대로 옮겨 와 전달한다는 뜻을 나타내는 종결 어미. 어미 ‘-더-’와 어미 ‘-라’가 결합한 말이다.",
    "pos": "어미",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=412877&searchKeywordTo=3"
  },
  {
    "id": 22,
    "category": "어간·어미",
    "level": "초등/기초",
    "question": "스스로 다짐하거나 결심할 때 쓰는 종결 어미는?",
    "sentence": "이번 시험은 꼭 만점 받을 [ 거야 / 거에요 ].",
    "options": [
      "거야",
      "거에요"
    ],
    "answerIndex": 0,
    "explanation": "'것이야'의 구어적 표현으로 '거야'가 맞습니다. 존댓말로는 '거예요(것이에요)'를 씁니다.",
    "rule": "한글 맞춤법 제35항",
    "standardWord": "거야",
    "dictDefinition": "바로 어젯밤.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=394561&searchKeywordTo=3"
  },
  {
    "id": 23,
    "category": "어휘·표기",
    "level": "중등/기본",
    "question": "생각이나 감정을 드러내어 밖으로 표현할 때 맞는 말은?",
    "sentence": "마음껏 웃음을 [ 터뜨렸다 / 터트렸다 ].",
    "options": [
      "터뜨렸다",
      "터트렸다 (복수표준어)"
    ],
    "answerIndex": 1,
    "explanation": "'-뜨리다'와 '-트리다'는 둘 다 널리 쓰이므로 둘 다 표준어로 인정하는 복수 표준어입니다! '터뜨리다'와 '터트리다' 모두 바른 표현입니다.",
    "rule": "표준어 규정 제26항 (복수 표준어)",
    "standardWord": "터뜨리다/터트리다",
    "dictDefinition": "터지게 하다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=496472&searchKeywordTo=3"
  },
  {
    "id": 24,
    "category": "어휘·표기",
    "level": "고등/실전",
    "question": "능력이나 재능을 발전시킬 때 쓰는 단어는?",
    "sentence": "방학 동안 코딩 실력과 독서 역량을 [ 계발 / 개발 ]했다.",
    "options": [
      "계발",
      "개발"
    ],
    "answerIndex": 0,
    "explanation": "슬기나 재능, 사상 따위를 일깨워 높은 상태로 발전시키는 것은 '계발(啓發)'이며, 지식이나 기술, 자원 등을 새롭게 만들어 발전시키는 것은 '개발(開發)'입니다. 둘 다 문맥에 따라 쓰이나 자기계발에는 '계발'이 더 정확합니다.",
    "rule": "표준국어대사전 유의어 분별",
    "standardWord": "계발",
    "dictDefinition": "슬기나 재능, 사상 따위를 일깨워 줌.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=392447&searchKeywordTo=3"
  },
  {
    "id": 25,
    "category": "어간·어미",
    "level": "초등/기초",
    "question": "부정문에서 보조용언 줄임 표현입니다.",
    "sentence": "그렇게 하면 [ 안 돼 / 않 돼 ].",
    "options": [
      "안 돼",
      "않 돼"
    ],
    "answerIndex": 0,
    "explanation": "'아니 돼'의 줄임말이므로 '안 돼'가 맞습니다. '않'은 용언 뒤에서 '-지 않다'처럼 보조용언으로 쓰입니다.",
    "rule": "한글 맞춤법 제39항",
    "standardWord": "안 돼",
    "dictDefinition": "부정 부사 ‘안(아니)’과 동사 ‘되다’가 결합하여 어떤 행위가 이루어지지 못하거나 허용되지 않음을 나타냄.",
    "pos": "구",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=되다"
  },
  {
    "id": 26,
    "category": "띄어쓰기",
    "level": "중등/심화",
    "question": "의존 명사와 조사의 띄어쓰기 구별입니다.",
    "sentence": "노력한 [ 만큼 /  만큼 ] 결실을 거둘 거야.",
    "options": [
      "만큼 (띄어쓰기)",
      "만큼 (붙여쓰기)"
    ],
    "answerIndex": 0,
    "explanation": "'노력한'처럼 관형어 뒤에 올 때는 의존 명사이므로 띄어 써야 합니다. 반면 체언 뒤(예: 너만큼)에 올 때는 조사이므로 붙여 씁니다.",
    "rule": "한글 맞춤법 제42항",
    "standardWord": "만큼",
    "dictDefinition": "앞의 내용에 상당한 수량이나 정도임을 나타내는 말.",
    "pos": "의존 명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=423733&searchKeywordTo=3"
  },
  {
    "id": 27,
    "category": "어휘·표기",
    "level": "고등/실전",
    "question": "편지나 우편물을 보낼 때 쓰는 알맞은 동사는?",
    "sentence": "친구에게 생일 축하 편지를 [ 부쳤어 / 붙였어 ].",
    "options": [
      "부쳤어",
      "붙였어"
    ],
    "answerIndex": 0,
    "explanation": "편지나 짐을 보낼 때는 '부치다'를 쓰고, 물건을 떨어지지 않게 닿게 할 때는 '붙이다'를 씁니다.",
    "rule": "한글 맞춤법 제22항",
    "standardWord": "부치다",
    "dictDefinition": "모자라거나 미치지 못하다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=438761&searchKeywordTo=3"
  },
  {
    "id": 28,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "알맹이를 싸고 있는 겉껍질을 나타낼 때 올바른 표현은?",
    "sentence": "달걀 [ 껍데기 / 껍질 ]을 조심스럽게 깠어.",
    "options": [
      "껍데기",
      "껍질"
    ],
    "answerIndex": 0,
    "explanation": "달걀, 조개, 소라처럼 단단한 겉 물질은 '껍데기'가 맞고, 사과나 귤처럼 부드러운 것은 '껍질'이 맞습니다.",
    "rule": "표준국어대사전 단어 뜻",
    "standardWord": "껍데기",
    "dictDefinition": "달걀이나 조개 따위의 겉을 싸고 있는 단단한 물질.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=400982&searchKeywordTo=3"
  },
  {
    "id": 29,
    "category": "어간·어미",
    "level": "고등/실전",
    "question": "약속이나 일정을 잊어버리지 않게 할 때 맞는 표현은?",
    "sentence": "잊지 않도록 다이어리에 꼭 [ 적을게 / 적을께 ].",
    "options": [
      "적을게",
      "적을께"
    ],
    "answerIndex": 0,
    "explanation": "소리는 [적을께]로 된소리가 나더라도 종결 어미는 된소리로 적지 않고 예사소리 '-ㄹ게'로 적습니다.",
    "rule": "한글 맞춤법 제53항",
    "standardWord": "-ㄹ게",
    "dictDefinition": "(구어체로) 해할 자리에 쓰여, 어떤 행동에 대한 약속이나 의지를 나타내는 종결 어미.",
    "pos": "어미",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=100314&searchKeywordTo=3"
  },
  {
    "id": 30,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "여기저기 흩어져 어지럽게 널려 있을 때 맞는 표준어는?",
    "sentence": "방바닥에 책들이 [ 널브러져 / 널부러져 ] 있네.",
    "options": [
      "널브러져",
      "널부러져"
    ],
    "answerIndex": 0,
    "explanation": "표준어는 '널브러지다'입니다. '널부러지다'는 잘못된 표기입니다.",
    "rule": "표준어 규정 제17항",
    "standardWord": "널브러지다",
    "dictDefinition": "너저분하게 흐트러지거나 흩어지다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=405349&searchKeywordTo=3"
  },
  {
    "id": 31,
    "category": "어휘·표기",
    "level": "중등/기본",
    "question": "밤하늘에 반짝이는 별자리를 가리킬 때 알맞은 말은?",
    "sentence": "북쪽 하늘의 [ 북두칠성 / 북두칠썽 ]을 찾아봐.",
    "options": [
      "북두칠성",
      "북두칠썽"
    ],
    "answerIndex": 0,
    "explanation": "한자어 '북두칠성(北斗七星)'은 원래 음대로 '북두칠성'으로 표기합니다.",
    "rule": "한글 맞춤법 제10항",
    "standardWord": "북두칠성",
    "dictDefinition": "탐랑(貪狼), 거문(巨門), 녹존(祿存), 문곡(文曲), 염정(廉貞), 무곡(武曲), 파군(破軍) 따위 일곱 개의 별. 밀교에서, 이것을 섬기면 천재지변 따위를 미리 막을 수 있다 하여 북두 만다라를 본존으로 하는 북두법이 최대 비법이었다.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=436647&searchKeywordTo=3"
  },
  {
    "id": 32,
    "category": "사이시옷",
    "level": "고등/실전",
    "question": "아침저녁으로 시원한 바람이 불 때 맞는 표현은?",
    "sentence": "가을밤 [ 댓바람 / 대바람 ]이 상쾌하다.",
    "options": [
      "댓바람",
      "대바람"
    ],
    "answerIndex": 0,
    "explanation": "'일이나 때가 되자마자 맨 처음'을 뜻하는 말은 사이시옷이 들어간 '댓바람'이 표준어입니다.",
    "rule": "표준어 규정 제30항",
    "standardWord": "댓바람",
    "dictDefinition": "일이나 때를 당하여 서슴지 않고 당장.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=82280&searchKeywordTo=3"
  },
  {
    "id": 33,
    "category": "어휘·표기",
    "level": "중등/기본",
    "question": "물건을 차곡차곡 쌓아놓을 때 올바른 표현은?",
    "sentence": "도서관에 책을 가득 [ 쌓았다 / 싸았다 ].",
    "options": [
      "쌓았다",
      "싸았다"
    ],
    "answerIndex": 0,
    "explanation": "기본형은 '쌓다'이므로 과거형은 '쌓았다'가 맞습니다.",
    "rule": "한글 맞춤법 제15항",
    "standardWord": "쌓다",
    "dictDefinition": "여러 개의 물건을 겹겹이 포개어 얹어 놓다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=454511&searchKeywordTo=3"
  },
  {
    "id": 34,
    "category": "어간·어미",
    "level": "초등/기초",
    "question": "상대방의 질문에 대답할 때 바른 어미는?",
    "sentence": "내가 먼저 갈 테니 천천히 [ 오너라 / 와라 ].",
    "options": [
      "오너라",
      "와라"
    ],
    "answerIndex": 0,
    "explanation": "'오다'에 명령형 어미가 결합할 때 '오너라'는 전통적인 명령형 어미로 표준어입니다. (둘 다 일상에서 쓰이나 '오너라'가 정형적 명령 표현)",
    "rule": "한글 맞춤법 불규칙 활용",
    "standardWord": "오너라",
    "dictDefinition": "사람이나 사물이 말하는 이나 기준이 되는 곳을 향하여 움직여 이르다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=오다"
  },
  {
    "id": 35,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "아주 오랜 동안이나 오랜만에 만났을 때 맞는 말은?",
    "sentence": "정말 [ 오랫동안 / 오래동안 ] 기다렸어!",
    "options": [
      "오랫동안",
      "오래동안"
    ],
    "answerIndex": 0,
    "explanation": "부사 '오래'와 명사 '동안'이 결합한 합성어로 뒷말 첫소리가 된소리[오래똥안]로 나므로 사이시옷을 받쳐 적어 '오랫동안'이 맞습니다.",
    "rule": "한글 맞춤법 제30항",
    "standardWord": "오랫동안",
    "dictDefinition": "시간상으로 썩 긴 동안.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=459304&searchKeywordTo=3"
  },
  {
    "id": 36,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "오랜만에 친구를 만났을 때 맞는 인사말은?",
    "sentence": "친구야, [ 오랜만이야 / 오랫만이야 ]!",
    "options": [
      "오랜만이야",
      "오랫만이야"
    ],
    "answerIndex": 0,
    "explanation": "'오래간만이야'의 줄임말이므로 '오랜만이야'가 맞습니다. '오랫동안'과 헷갈리기 쉬우니 주의해야 합니다.",
    "rule": "표준국어대사전 표제어",
    "standardWord": "오랜만",
    "dictDefinition": "‘오래간만’의 준말.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=241150&searchKeywordTo=3"
  },
  {
    "id": 37,
    "category": "띄어쓰기",
    "level": "고등/실전",
    "question": "경과한 시간을 나타낼 때의 띄어쓰기입니다.",
    "sentence": "그 친구를 만난 [ 지 / 지(붙여쓰기) ] 벌써 3년이 지났다.",
    "options": [
      "지 (띄어쓰기)",
      "지 (붙여쓰기)"
    ],
    "answerIndex": 0,
    "explanation": "어떤 일이 일어난 뒤 시간을 나타낼 때의 '지'는 의존 명사이므로 앞말과 띄어 씁니다.",
    "rule": "한글 맞춤법 제42항",
    "standardWord": "지 (의존명사)",
    "dictDefinition": "궁중에서, ‘요강’을 이르던 말.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=314426&searchKeywordTo=3"
  },
  {
    "id": 38,
    "category": "어휘·표기",
    "level": "중등/기본",
    "question": "기분이 아주 상쾌하고 가벼울 때 맞는 표현은?",
    "sentence": "목욕을 하고 나니 몸이 [ 개운하다 / 개은하다 ].",
    "options": [
      "개운하다",
      "개은하다"
    ],
    "answerIndex": 0,
    "explanation": "표준어는 '개운하다'입니다. '개은하다'는 방언입니다.",
    "rule": "표준어 규정 제17항",
    "standardWord": "개운하다",
    "dictDefinition": "기분이나 몸이 상쾌하고 가뜬하다.",
    "pos": "형용사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=389527&searchKeywordTo=3"
  },
  {
    "id": 39,
    "category": "어휘·표기",
    "level": "고등/실전",
    "question": "음식의 맛이 약간 쌉싸름할 때 표준어는?",
    "sentence": "봄나물의 [ 쌉싸래한 / 쌉싸름한 ] 맛이 일품이다.",
    "options": [
      "쌉싸래한",
      "쌉싸래한 / 쌉싸름한 (복수표준어)"
    ],
    "answerIndex": 1,
    "explanation": "원래 '쌉싸래하다'만 표준어였으나 국립국어원에서 널리 쓰이는 '쌉싸름하다'도 복수 표준어로 추가 인정하였습니다!",
    "rule": "국립국어원 표준어 추가 규정",
    "standardWord": "쌉싸래하다/쌉싸름하다",
    "dictDefinition": "조금 쓴 맛이 있는 듯하다.",
    "pos": "형용사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=213995&searchKeywordTo=3"
  },
  {
    "id": 40,
    "category": "어간·어미",
    "level": "중등/기본",
    "question": "마음속으로 굳게 먹은 생각을 나타낼 때 올바른 표기는?",
    "sentence": "이번에는 기필코 해내고야 [ 말겠어 / 말갰어 ].",
    "options": [
      "말겠어",
      "말갰어"
    ],
    "answerIndex": 0,
    "explanation": "의지를 나타내는 선어말 어미는 '-겠-'이므로 '말겠어'가 맞습니다.",
    "rule": "한글 맞춤법 제15항",
    "standardWord": "-겠-",
    "dictDefinition": "미래의 일이나 추측을 나타내는 어미.",
    "pos": "어미",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=394738&searchKeywordTo=3"
  },
  {
    "id": 41,
    "category": "사이시옷",
    "level": "고등/실전",
    "question": "한자어끼리의 결합 중 사이시옷이 인정되는 6개 단어에 해당하는 것은?",
    "sentence": "이번 달 [ 셋방 / 세방 ]을 새로 계약했어.",
    "options": [
      "셋방",
      "세방"
    ],
    "answerIndex": 0,
    "explanation": "순수한 한자어는 사이시옷을 받치지 않는 것이 원칙이나, 6개 단어(곳간, 셋방, 숫자, 찻간, 툇간, 횟수)는 예외적으로 사이시옷을 인정합니다.",
    "rule": "한글 맞춤법 제30항 3",
    "standardWord": "셋방",
    "dictDefinition": "세를 내고 빌려 쓰는 방.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=444310&searchKeywordTo=3"
  },
  {
    "id": 42,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "무거운 짐을 운반할 때 쓰는 올바른 표현은?",
    "sentence": "자전거 뒷자리에 짐을 [ 싣고 / 실고 ] 출발했어.",
    "options": [
      "싣고",
      "실고"
    ],
    "answerIndex": 0,
    "explanation": "'싣다'는 ㄷ 불규칙 용언으로, 자음 어미 앞에서는 '싣고', 모음 어미 앞에서는 '실어'로 바뀝니다.",
    "rule": "한글 맞춤법 제18항 (ㄷ 불규칙)",
    "standardWord": "싣다",
    "dictDefinition": "물체나 사람을 옮기기 위하여 탈것, 수레, 비행기, 짐승의 등 따위에 올리다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=451732&searchKeywordTo=3"
  },
  {
    "id": 43,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "옷이나 물건을 단정하게 정돈할 때 쓰는 말은?",
    "sentence": "옷매무새를 단정히 [ 매만졌다 / 메만졌다 ].",
    "options": [
      "매만졌다",
      "메만졌다"
    ],
    "answerIndex": 0,
    "explanation": "'손으로 부드럽게 쓰다듬거나 매만지다'는 '매-'를 씁니다.",
    "rule": "표준국어대사전 표제어",
    "standardWord": "매만지다",
    "dictDefinition": "잘 가다듬어 손질하다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=420866&searchKeywordTo=3"
  },
  {
    "id": 44,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "물건을 잃어버렸을 때 쓰는 올바른 말은?",
    "sentence": "소중한 지갑을 길에서 [ 잃어버렸어 / 일어버렸어 ].",
    "options": [
      "잃어버렸어",
      "일어버렸어"
    ],
    "answerIndex": 0,
    "explanation": "기본형은 '잃다'이므로 '잃어버리다'가 맞습니다. '일어버리다'는 잘못된 표기입니다.",
    "rule": "한글 맞춤법 제15항",
    "standardWord": "잃어버리다",
    "dictDefinition": "가졌던 물건이 자신도 모르게 없어져 그것을 아주 갖지 아니하게 되다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=266686&searchKeywordTo=3"
  },
  {
    "id": 45,
    "category": "어간·어미",
    "level": "중등/기본",
    "question": "원인을 나타내는 연결 어미 표기입니다.",
    "sentence": "비가 너무 많이 [ 오므로 / 옴으로 ] 행사가 취소되었다.",
    "options": [
      "오므로",
      "옴으로"
    ],
    "answerIndex": 0,
    "explanation": "이유나 원인을 나타내는 어미는 '-므로'입니다. 반면 명사형 '옴'에 조사 '으로'가 붙은 것은 수단이나 도구를 나타냅니다.",
    "rule": "한글 맞춤법 제57항",
    "standardWord": "-므로",
    "dictDefinition": "까닭이나 근거를 나타내는 연결 어미.",
    "pos": "어미",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=427932&searchKeywordTo=3"
  },
  {
    "id": 46,
    "category": "어휘·표기",
    "level": "고등/실전",
    "question": "어떤 물건이나 현상이 뒤섞여 어지러울 때 맞는 말은?",
    "sentence": "머릿속이 온통 [ 뒤죽박죽 / 뒤죽박죽이 ] 되었다.",
    "options": [
      "뒤죽박죽",
      "뒤죽박죽 (둘 다 가능)"
    ],
    "answerIndex": 0,
    "explanation": "여럿이 마구 뒤섞여 갈피를 잡을 수 없는 상태는 '뒤죽박죽'이 표준어입니다.",
    "rule": "표준국어대사전",
    "standardWord": "뒤죽박죽",
    "dictDefinition": "여럿이 마구 뒤섞여 엉망이 된 모양. 또는 그 상태.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=93366&searchKeywordTo=3"
  },
  {
    "id": 47,
    "category": "사이시옷",
    "level": "중등/심화",
    "question": "바닷가 근처에 부는 시원한 바람을 뜻하는 말은?",
    "sentence": "시원한 [ 바닷바람 / 바다바람 ]을 맞으며 달렸다.",
    "options": [
      "바닷바람",
      "바다바람"
    ],
    "answerIndex": 0,
    "explanation": "순우리말 합성어로 뒤 단어의 첫소리가 된소리[바다빠람]로 나므로 사이시옷을 적어 '바닷바람'이 맞습니다.",
    "rule": "한글 맞춤법 제30항",
    "standardWord": "바닷바람",
    "dictDefinition": "바다에서 육지로 불어오는 바람.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=428733&searchKeywordTo=3"
  },
  {
    "id": 48,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "남의 시선이나 비판을 아랑곳하지 않을 때 맞는 단어는?",
    "sentence": "주변의 시선에 [ 아랑곳하지 / 아랑곳 하지 ] 않고 꿈을 펼쳤다.",
    "options": [
      "아랑곳하지 (붙여쓰기)",
      "아랑곳 하지 (띄어쓰기)"
    ],
    "answerIndex": 0,
    "explanation": "'아랑곳하다'는 한 단어로 등록되어 있으므로 붙여 쓰는 것이 맞습니다.",
    "rule": "표준국어대사전 한 단어 표기",
    "standardWord": "아랑곳하다",
    "dictDefinition": "일에 나서서 참견하거나 관심을 두다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=450461&searchKeywordTo=3"
  },
  {
    "id": 49,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "목소리가 곱고 맑을 때 쓰는 알맞은 표현은?",
    "sentence": "새들이 아침부터 [ 지저귀고 / 지져귀고 ] 있어.",
    "options": [
      "지저귀고",
      "지져귀고"
    ],
    "answerIndex": 0,
    "explanation": "'새가 울다'의 뜻을 가진 동사는 '지저귀다'입니다.",
    "rule": "한글 맞춤법 제15항",
    "standardWord": "지저귀다",
    "dictDefinition": "새 따위가 계속하여 소리 내어 울다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=488251&searchKeywordTo=3"
  },
  {
    "id": 50,
    "category": "어간·어미",
    "level": "중등/기본",
    "question": "두 가지 상황 중 하나를 선택할 때 쓰는 어미는?",
    "sentence": "가[ 든지 / 던지 ] 말[ 든지 / 던지 ] 네가 결정해.",
    "options": [
      "든지",
      "던지"
    ],
    "answerIndex": 0,
    "explanation": "선택이나 무관함을 나타낼 때는 '-든지'를 쓰고, 과거의 일이나 회상을 나타낼 때는 '-던지'를 씁니다.",
    "rule": "한글 맞춤법 제56항",
    "standardWord": "-든지",
    "dictDefinition": "어느 것이 선택되어도 차이가 없는 둘 이상의 일을 나열함을 나타내는 보조사.",
    "pos": "조사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=94197&searchKeywordTo=3"
  },
  {
    "id": 51,
    "category": "어휘·표기",
    "level": "고등/실전",
    "question": "음식이 알맞게 삭아 맛이 들었을 때 쓰는 말은?",
    "sentence": "김치가 아주 맛있게 잘 [ 익었다 / 닉었다 ].",
    "options": [
      "익었다",
      "닉었다"
    ],
    "answerIndex": 0,
    "explanation": "두음 법칙에 따라 단어 첫머리의 'ㄴ'은 'ㅇ'으로 표기하여 '익다'가 표준어입니다.",
    "rule": "한글 맞춤법 제10항",
    "standardWord": "익다",
    "dictDefinition": "열매나 씨가 여물다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=468023&searchKeywordTo=3"
  },
  {
    "id": 52,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "꽃이 활짝 필 때 쓰는 예쁜 표현은?",
    "sentence": "봄이 오니 개나리가 [ 활짝 / 괄짝 ] 피었어.",
    "options": [
      "활짝",
      "괄짝"
    ],
    "answerIndex": 0,
    "explanation": "'활짝'이 올바른 부사 표기입니다.",
    "rule": "표준국어대사전 부사",
    "standardWord": "활짝",
    "dictDefinition": "문 따위가 한껏 시원스럽게 열린 모양.",
    "pos": "부사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=506765&searchKeywordTo=3"
  },
  {
    "id": 53,
    "category": "어휘·표기",
    "level": "중등/심화",
    "question": "남의 부탁을 거절할 때 쓰는 알맞은 표현은?",
    "sentence": "친구의 부탁을 정중히 [ 거절했다 / 거절 헸다 ].",
    "options": [
      "거절했다",
      "거절 헸다"
    ],
    "answerIndex": 0,
    "explanation": "'하다'의 활용형은 '하여(해)'이므로 '거절했다'가 올바릅니다.",
    "rule": "한글 맞춤법 제15항",
    "standardWord": "거절하다",
    "dictDefinition": "상대편의 요구, 제안, 선물, 부탁 따위를 받아들이지 않고 물리치다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=13623&searchKeywordTo=3"
  },
  {
    "id": 54,
    "category": "어간·어미",
    "level": "고등/실전",
    "question": "어떤 사실을 인정하면서도 다른 의견을 제시할 때 쓰는 연결 어미는?",
    "sentence": "어려운 문제[ 일망정 / 일망정(일망정) ] 포기하지 않아.",
    "options": [
      "일망정",
      "일망정은"
    ],
    "answerIndex": 0,
    "explanation": "'-ㄹ망정'은 앞의 사실을 인정하면서 뒤에 반대되는 내용을 이어주는 어미입니다.",
    "rule": "표준국어대사전 어미",
    "standardWord": "-ㄹ망정",
    "dictDefinition": "앞 절의 사실을 인정하고 뒤 절에 그와 대립되는 다른 사실을 이어 말할 때에 쓰는 연결 어미. 앞 절의 사실은 가상의 것일 수도 있다. ‘비록 그러하지만 그러나’ 혹은 ‘비록 그러하다 하여도 그러나’에 가까운 뜻을 나타낸다.",
    "pos": "어미",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=421148&searchKeywordTo=3"
  },
  {
    "id": 55,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "아침 식사를 뜻하는 정겨운 순우리말은?",
    "sentence": "아침에 따뜻한 [ 밥 / 뱝 ] 한 그릇 뚝딱!",
    "options": [
      "밥",
      "뱝"
    ],
    "answerIndex": 0,
    "explanation": "바른 단어 표기는 '밥'입니다.",
    "rule": "표준국어대사전",
    "standardWord": "밥",
    "dictDefinition": "쌀, 보리 따위의 곡식을 씻어서 솥 따위의 용기에 넣고 물을 알맞게 부어, 낟알이 풀어지지 않고 물기가 잦아들게 끓여 익힌 음식.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=432499&searchKeywordTo=3"
  },
  {
    "id": 56,
    "category": "어휘·표기",
    "level": "중등/기본",
    "question": "온몸에 힘이 빠지고 나른할 때 쓰는 표현은?",
    "sentence": "운동회를 마치고 나니 온몸이 [ 나른하다 / 나런하다 ].",
    "options": [
      "나른하다",
      "나런하다"
    ],
    "answerIndex": 0,
    "explanation": "모음 조화 및 표준어 규정에 따라 '나른하다'가 맞습니다.",
    "rule": "표준어 규정 제8항",
    "standardWord": "나른하다",
    "dictDefinition": "맥이 풀리거나 몸이 고단하여 기운이 없다.",
    "pos": "형용사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=408098&searchKeywordTo=3"
  },
  {
    "id": 57,
    "category": "어휘·표기",
    "level": "고등/실전",
    "question": "마음속 깊이 간직하여 잊지 않을 때 쓰는 사자성어 어휘는?",
    "sentence": "선생님의 가르침을 마음에 [ 간직하겠습니다 / 간직하겠읍니다 ].",
    "options": [
      "간직하겠습니다",
      "간직하겠읍니다"
    ],
    "answerIndex": 0,
    "explanation": "종결 어미는 '-습니다'가 표준어이며, 과거에 쓰이던 '-읍니다'는 비표준어입니다.",
    "rule": "표준어 규정 제17항",
    "standardWord": "-습니다",
    "dictDefinition": "하십시오할 자리에 쓰여, 현재 계속되는 동작이나 상태를 있는 그대로 나타내는 종결 어미.",
    "pos": "어미",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=451593&searchKeywordTo=3"
  },
  {
    "id": 58,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "반짝반짝 빛나는 별을 묘사할 때 맞는 부사는?",
    "sentence": "밤하늘에 별들이 [ 초롱초롱 / 초롱초롱이 ] 빛난다.",
    "options": [
      "초롱초롱",
      "초롱초롱이"
    ],
    "answerIndex": 0,
    "explanation": "빛이 맑고 영롱하게 빛나는 모양은 부사 '초롱초롱'이 표준어입니다.",
    "rule": "표준국어대사전",
    "standardWord": "초롱초롱",
    "dictDefinition": "눈이 정기가 있고 맑은 모양.",
    "pos": "부사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=492242&searchKeywordTo=3"
  },
  {
    "id": 59,
    "category": "어간·어미",
    "level": "중등/심화",
    "question": "의심이나 호기심을 품고 물어볼 때 쓰는 종결 어미는?",
    "sentence": "도대체 어떻게 된 일[ 일까 / 일까나 ]?",
    "options": [
      "일까",
      "일까나"
    ],
    "answerIndex": 0,
    "explanation": "의문을 나타내는 표준 종결 어미는 '-ㄹ까'입니다.",
    "rule": "한글 맞춤법 제53항",
    "standardWord": "-ㄹ까",
    "dictDefinition": "해할 자리에 쓰여, 어떤 일에 대한 물음이나 추측을 나타내는 종결 어미.",
    "pos": "어미",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=100327&searchKeywordTo=3"
  },
  {
    "id": 60,
    "category": "어휘·표기",
    "level": "초등/기초",
    "question": "행복한 미래를 꿈꿀 때 쓰는 아름다운 순우리말은?",
    "sentence": "우리의 밝은 [ 내일 / 래일 ]을 향해 함께 가자!",
    "options": [
      "내일",
      "래일"
    ],
    "answerIndex": 0,
    "explanation": "두음 법칙에 따라 한자어 첫머리의 'ㄹ'은 'ㄴ'으로 적으므로 '내일(來日)'이 맞습니다.",
    "rule": "한글 맞춤법 제11항",
    "standardWord": "내일",
    "dictDefinition": "오늘의 바로 다음 날.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchView.do?word_no=406113&searchKeywordTo=3"
  },
  {
    "id": 61,
    "category": "수능 문법",
    "level": "수능/고난도",
    "question": "다음 중 수능 국어 맞춤법에서 올바른 사이시옷 표기는?",
    "sentence": "시골 개울가에 핀 [ 시냇가 / 시넷가 ]의 꽃들이 곱다.",
    "options": ["시냇가", "시넷가", "시내까", "시냿가"],
    "answerIndex": 0,
    "explanation": "순우리말로 된 합성어로서 앞말이 모음으로 끝나고 뒷말의 첫소리가 된소리로 나는 것은 사이시옷을 받치어 적으므로 '시냇가'가 맞습니다.",
    "rule": "한글 맞춤법 제30항",
    "standardWord": "시냇가",
    "dictDefinition": "시내의 가장자리.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=시냇가"
  },
  {
    "id": 62,
    "category": "수능 문법",
    "level": "수능/고난도",
    "question": "다음 중 퀴즈의 정답을 맞힐 때 올바른 동사는?",
    "sentence": "스무고개 퀴즈의 정답을 용케 [ 알아맞혔다 / 알아맞췄다 ].",
    "options": ["알아맞혔다", "알아맞췄다", "알아마췄다", "알아마쳤다"],
    "answerIndex": 0,
    "explanation": "문제에 대한 올바른 답을 골라내거나 짐작하여 맞게 하는 것은 '알아맞히다'가 표준어입니다. '맞추다'는 둘 이상의 대상을 비교하거나 짝을 맞출 때 씁니다.",
    "rule": "표준어 규정 제17항",
    "standardWord": "알아맞히다",
    "dictDefinition": "알아내어 맞히다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=알아맞히다"
  },
  {
    "id": 63,
    "category": "수능 문법",
    "level": "수능/고난도",
    "question": "다음 중 올바른 파생어 표기를 고르세요.",
    "sentence": "아무리 넘어져도 다시 일어나는 [ 오뚝이 / 오뚜기 ]처럼 힘을 내자!",
    "options": ["오뚝이", "오뚜기", "오뚝이이", "오똑이"],
    "answerIndex": 0,
    "explanation": "'오뚝하다'라는 어간에 명사 파생 접미사 '-이'가 붙은 말이므로 원형을 밝혀 '오뚝이'로 적습니다.",
    "rule": "한글 맞춤법 제19항",
    "standardWord": "오뚝이",
    "dictDefinition": "밑을 무겁게 하여 쓰러뜨려도 곧 오뚝 일어서는 어린아이의 장난감.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=오뚝이"
  },
  {
    "id": 64,
    "category": "수능 문법",
    "level": "수능/고난도",
    "question": "다음 중 잘못을 꾸짖을 때 쓰는 올바른 표준어는?",
    "sentence": "동생의 잘못을 너무 심하게 [ 나무라지 / 나무래지 ] 마라.",
    "options": ["나무라지", "나무래지", "나무라이지", "남우라지"],
    "answerIndex": 0,
    "explanation": "'나무라다'가 표준어이며, '나무래다'는 잘못된 방언/비표준어입니다.",
    "rule": "표준어 규정 제25항",
    "standardWord": "나무라다",
    "dictDefinition": "잘못을 지적하여 꾸짖다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=나무라다"
  },
  {
    "id": 65,
    "category": "수능 문법",
    "level": "수능/고난도",
    "question": "다음 중 마음이 조마조마할 때 쓰는 올바른 관용 표현은?",
    "sentence": "합격 발표를 기다리며 [ 안절부절못하고 / 안절부절하고 ] 있다.",
    "options": ["안절부절못하고", "안절부절하고", "안절부절않고", "안절부절않이고"],
    "answerIndex": 0,
    "explanation": "'안절부절못하다'는 한 단어로 굳어진 표준어입니다. '안절부절하다'는 비표준어입니다.",
    "rule": "한글 맞춤법 제27항",
    "standardWord": "안절부절못하다",
    "dictDefinition": "마음이 초조하고 불안하여 어찌할 바를 모르다.",
    "pos": "동사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=안절부절못하다"
  },
  {
    "id": 66,
    "category": "일반 실무",
    "level": "일반/실무",
    "question": "회사에서 문서 승인을 올릴 때 올바른 표현은?",
    "sentence": "팀장님께 휴가 신청서 [ 결재 / 결제 ]를 올렸습니다.",
    "options": ["결재", "결제", "결세", "결제이"],
    "answerIndex": 0,
    "explanation": "상사에게 안건을 허가/승인받는 것은 '결재(決裁)'이고, 돈을 치르거나 카드를 긁는 것은 '결제(決濟)'입니다.",
    "rule": "표준국어대사전 한자어 구별",
    "standardWord": "결재",
    "dictDefinition": "결정할 권한이 있는 상관이 부하가 제출한 안건을 검토하여 허가하거나 승인함.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=결재"
  },
  {
    "id": 67,
    "category": "일반 실무",
    "level": "일반/실무",
    "question": "자신의 재능과 잠재력을 발전시킬 때 올바른 단어는?",
    "sentence": "방학 동안 코딩 실력과 자기 [ 계발 / 개발 ]에 힘쓰겠다.",
    "options": ["계발", "개발", "개벌", "계벌"],
    "answerIndex": 0,
    "explanation": "지능, 재능, 능력 등을 일깨워 북돋우는 것은 '계발(啓發)'이며, 토지나 기술, 제품을 새롭게 만들어내는 것은 '개발(開發)'입니다.",
    "rule": "표준국어대사전",
    "standardWord": "계발",
    "dictDefinition": "슬기나 재능, 사상 따위를 일깨워 줌.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=계발"
  },
  {
    "id": 68,
    "category": "일반 실무",
    "level": "일반/실무",
    "question": "시간이 아주 짧은 순간을 나타낼 때 올바른 맞춤법은?",
    "sentence": "소문이 [ 금세 / 금새 ] 퍼져나갔다.",
    "options": ["금세", "금새", "금쇄", "금쌔"],
    "answerIndex": 0,
    "explanation": "'금세'는 '금시에(今時에)'가 줄어든 말이므로 '금세'가 맞습니다. '금새'는 물건의 값이나 시세를 뜻합니다.",
    "rule": "한글 맞춤법 제35항",
    "standardWord": "금세",
    "dictDefinition": "‘금시에’가 줄어든 말. 지금 바로.",
    "pos": "부사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=금세"
  },
  {
    "id": 69,
    "category": "일반 실무",
    "level": "일반/실무",
    "question": "부정적인 행동을 하지 말아야 할 때 올바른 표현은?",
    "sentence": "남을 비방하는 악성 댓글은 [ 지양 / 지향 ]해야 합니다.",
    "options": ["지양", "지향", "지양화", "지향화"],
    "answerIndex": 0,
    "explanation": "'지양(止揚)'은 더 높은 단계로 나아가기 위해 피하거나 하지 않는 것을 뜻하고, '지향(指向)'은 어떤 목표를 향해 나아가는 것을 뜻합니다.",
    "rule": "표준국어대사전",
    "standardWord": "지양",
    "dictDefinition": "더 높은 단계로 오르기 위하여 어떠한 것을 하지 아니함.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=지양"
  },
  {
    "id": 70,
    "category": "일반 실무",
    "level": "일반/실무",
    "question": "전문가에게 의견을 묻는 올바른 표현은?",
    "sentence": "법률 문제에 대해 변호사에게 [ 자문했다 / 자문을 구했다 ].",
    "options": ["자문했다", "자문을 구했다", "자문받았다", "자문을 청했다"],
    "answerIndex": 0,
    "explanation": "'자문(諮問)' 자체가 '전문가에게 의견을 묻는다'는 뜻이므로, '자문하다'가 올바르며, '자문을 구하다'는 의미가 겹치는 역전 앞 식 오류입니다.",
    "rule": "국립국어원 다듬은 말 규정",
    "standardWord": "자문",
    "dictDefinition": "어떤 일을 좀 더 효율적이고 바르게 처리하려고 그 방면의 전문가나 전문 기관에 의견을 물음.",
    "pos": "명사",
    "dictLink": "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=자문"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SPELLING_QUESTION_BANK };
}
