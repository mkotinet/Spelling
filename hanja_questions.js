/**
 * 하루맞춤 (Haru Matchum) - 한자(漢字) 및 고사성어 문제은행 데이터베이스
 * 국립국어원 표준국어대사전 및 네이버 한자사전 실시간 검색 딥링크 연동
 */

const HANJA_QUESTION_BANK = [
  {
    id: 1001,
    category: "사자성어",
    level: "중등/필수",
    question: "옛것을 익혀 새것을 안다는 뜻의 사자성어는?",
    sentence: "전통 기술의 지혜를 배워 첨단 AI에 접목하는 [ 온고지신 / 온고지신 ]의 자세가 필요하다.",
    options: ["溫故知新 (온고지신)", "溫古知新 (온고지신)", "螢雪之功 (형설지공)", "實事求是 (실사구시)"],
    answerIndex: 0,
    hanjaWord: "溫故知新",
    hanjaChars: [
      { char: "溫", sound: "온", meaning: "따뜻할" },
      { char: "故", sound: "고", meaning: "옛" },
      { char: "知", sound: "지", meaning: "알" },
      { char: "新", sound: "신", meaning: "새" }
    ],
    explanation: "'溫故知新'은 옛것을 연구하여 거기서 새로운 지식이나 도리를 찾아내는 것을 뜻합니다. '옛 고(故)'를 써야 하며, '옛 고(古)'가 아닙니다.",
    usage: "전통문화의 현대적 계승, 역사적 교훈을 바탕으로 한 신기술 개발 등",
    exampleSentence: "선조들의 기록문화에서 온고지신(溫故知新)의 정신을 본받아 현대적 아카이브를 구축했다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=온고지신",
    naverLink: "https://hanja.dict.naver.com/search?query=溫故知新"
  },
  {
    id: 1002,
    category: "사자성어",
    level: "중등/필수",
    question: "반딧불과 눈빛으로 글을 읽으며 고생 끝에 이룬 학문의 공을 뜻하는 말은?",
    sentence: "어려운 환경에서도 밤낮으로 열공하여 마침내 [ 형설지공 / 형설지공 ]을 이루었다.",
    options: ["螢雪之功 (형설지공)", "螢設之功 (형설지공)", "孤軍奮鬪 (고군분투)", "苦盡甘來 (고진감래)"],
    answerIndex: 0,
    hanjaWord: "螢雪之功",
    hanjaChars: [
      { char: "螢", sound: "형", meaning: "반딧불" },
      { char: "雪", sound: "설", meaning: "눈" },
      { char: "之", sound: "지", meaning: "갈/어조사" },
      { char: "功", sound: "공", meaning: "공" }
    ],
    explanation: "중국 진나라의 차윤이 반딧불을 모으고, 손강이 눈빛에 비추어 글을 읽은 고사에서 유래하여 가난을 딛고 각고의 노력으로 성공함을 뜻합니다.",
    usage: "역경을 극복한 수험생의 합격 수기, 자수성가한 학자의 삶",
    exampleSentence: "가난한 형편 속에서도 형설지공(螢雪之功)을 쌓아 마침내 훌륭한 학자가 되었다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=형설지공",
    naverLink: "https://hanja.dict.naver.com/search?query=螢雪之功"
  },
  {
    id: 1003,
    category: "동음이의어",
    level: "실무/고등",
    question: "회사에서 상사에게 서류의 허가를 받을 때 알맞은 한자어는?",
    sentence: "부장님께 이번 주 출장 계획서에 대한 [ 결재 / 결제 ]를 올렸다.",
    options: ["結裁 (결재)", "決裁 (결재)", "決濟 (결제)", "結濟 (결제)"],
    answerIndex: 1,
    hanjaWord: "決裁",
    hanjaChars: [
      { char: "決", sound: "결", meaning: "결단할" },
      { char: "裁", sound: "재", meaning: "마를/판단할" }
    ],
    explanation: "'결재(決裁)'는 상관이 부하가 제출한 안건을 허가하거나 승인하는 것입니다. 돈이나 대금을 정산하는 것은 '결제(決濟 - 결단할 결, 건널/마칠 제)'입니다.",
    usage: "기안서 결재, 서류 결재 받기, 전자 결재 시스템",
    exampleSentence: "팀장님의 최종 결재(決裁)가 떨어져야 프로젝트 예산 집행이 가능합니다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=결재",
    naverLink: "https://hanja.dict.naver.com/search?query=決裁"
  },
  {
    id: 1004,
    category: "동음이의어",
    level: "실무/고등",
    question: "신용카드나 현금으로 물건값을 치를 때 올바른 한자어는?",
    sentence: "온라인 쇼핑몰에서 상품을 고른 뒤 카드 [ 결제 / 결재 ]를 완료했다.",
    options: ["決濟 (결제)", "決裁 (결재)", "結濟 (결제)", "潔濟 (결제)"],
    answerIndex: 0,
    hanjaWord: "決濟",
    hanjaChars: [
      { char: "決", sound: "결", meaning: "결단할" },
      { char: "濟", sound: "제", meaning: "건널/마칠" }
    ],
    explanation: "'결제(決濟)'는 증권 또는 대금을 주고받아 매매 당사자 간의 거래 관계를 끝맺는 행위입니다.",
    usage: "대금 결제, 신용카드 결제, 결제 수단, 결제 완료",
    exampleSentence: "스마트페이 앱을 통해 주문과 결제(決濟)가 1초 만에 이루어졌다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=결제",
    naverLink: "https://hanja.dict.naver.com/search?query=決濟"
  },
  {
    id: 1005,
    category: "사자성어",
    level: "중등/필수",
    question: "풀을 묶어 은혜를 갚는다는 뜻으로, 죽어서도 은혜를 잊지 않음을 이르는 말은?",
    sentence: "도와주신 은혜는 평생 [ 결초보은 / 결초보은 ]의 마음으로 갚겠습니다.",
    options: ["結草報恩 (결초보은)", "結草報隱 (결초보은)", "刻骨難忘 (각골난망)", "背恩忘德 (배은망덕)"],
    answerIndex: 0,
    hanjaWord: "結草報恩",
    hanjaChars: [
      { char: "結", sound: "결", meaning: "맺을" },
      { char: "草", sound: "초", meaning: "풀" },
      { char: "報", sound: "보", meaning: "갚을" },
      { char: "恩", sound: "은", meaning: "은혜" }
    ],
    explanation: "중국 춘추 시대 진나라의 위과가 아버지가 세상을 떠난 후 서모를 개가시켜 살려주었는데, 뒷날 전쟁에서 서모 아버지의 혼령이 풀을 묶어 적장을 넘어뜨려 위과를 구했다는 고사입니다.",
    usage: "감사의 편지, 큰 도움을 받은 후 보답을 다짐할 때",
    exampleSentence: "선생님의 따뜻한 가르침에 결초보은(結草報恩)하고자 열심히 연구하고 있습니다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=결초보은",
    naverLink: "https://hanja.dict.naver.com/search?query=結草報恩"
  },
  {
    id: 1006,
    category: "사자성어",
    level: "중등/필수",
    question: "말을 타고 달리며 산천을 바라본다는 뜻으로, 자세히 살피지 않고 대충 훑어봄을 이르는 말은?",
    sentence: "일정이 너무 촉박해 유명 관광지들을 [ 주마간산 / 주마간산 ] 격으로 스쳐 지나갔다.",
    options: ["走馬看山 (주마간산)", "駐馬看山 (주마간산)", "走馬看産 (주마간산)", "鳥瞰圖 (조감도)"],
    answerIndex: 0,
    hanjaWord: "走馬看山",
    hanjaChars: [
      { char: "走", sound: "주", meaning: "달릴" },
      { char: "馬", sound: "마", meaning: "말" },
      { char: "看", sound: "간", meaning: "볼" },
      { char: "山", sound: "산", meaning: "뫼/산" }
    ],
    explanation: "달리는 말 위에서 산을 바라보면 산의 진면목을 보지 못하듯, 바쁘거나 수박 겉핥기식으로 대충 살펴보는 태도를 뜻합니다.",
    usage: "바쁜 일정의 여행, 대충 검토한 보고서 비판",
    exampleSentence: "책을 주마간산(走馬看山) 식으로 대충 읽으면 깊은 뜻을 파악하기 어렵다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=주마간산",
    naverLink: "https://hanja.dict.naver.com/search?query=走馬看山"
  },
  {
    id: 1007,
    category: "사자성어",
    level: "초등/기초",
    question: "상대방의 입장에서 생각해보라는 뜻의 사자성어는?",
    sentence: "친구와 다투었을 때는 [ 역지사지 / 역지사지 ]로 친구의 마음을 헤아려보자.",
    options: ["易地思之 (역지사지)", "譯地思之 (역지사지)", "同病相憐 (동병상련)", "以心傳心 (이심전심)"],
    answerIndex: 0,
    hanjaWord: "易地思之",
    hanjaChars: [
      { char: "易", sound: "역", meaning: "바꿀" },
      { char: "地", sound: "지", meaning: "땅/처지" },
      { char: "思", sound: "사", meaning: "생각할" },
      { char: "之", sound: "지", meaning: "갈/그것" }
    ],
    explanation: "처지나 입장을 바꾸어서 생각해 보라는 뜻입니다. '바꿀 역(易)'을 사용합니다.",
    usage: "갈등 조정, 대인관계 조언, 협상 테이블",
    exampleSentence: "역지사지(易地思之)의 태도로 대화하면 풀리지 않는 오해도 쉽게 해결됩니다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=역지사지",
    naverLink: "https://hanja.dict.naver.com/search?query=易地思之"
  },
  {
    id: 1008,
    category: "사자성어",
    level: "중등/필수",
    question: "인재를 얻기 위해 참을성 있게 정성을 다해 찾아감을 이르는 고사성어는?",
    sentence: "대표이사는 최고의 개발자를 영입하기 위해 [ 삼고초려 / 삼고초려 ]를 마다하지 않았다.",
    options: ["三顧草廬 (삼고초려)", "三顧草慮 (삼고초려)", "三考草廬 (삼고초려)", "大器晩成 (대기만성)"],
    answerIndex: 0,
    hanjaWord: "三顧草廬",
    hanjaChars: [
      { char: "三", sound: "삼", meaning: "석" },
      { char: "顧", sound: "고", meaning: "돌아볼" },
      { char: "草", sound: "초", meaning: "풀" },
      { char: "廬", sound: "려", meaning: "오두막" }
    ],
    explanation: "삼국지에서 유비가 제갈량을 군사로 초빙하기 위해 그의 초가집을 세 번이나 찾아갔다는 고사에서 비롯되었습니다.",
    usage: "귀한 인재 영입, 정성을 다한 간청",
    exampleSentence: "인재를 모시기 위해 삼고초려(三顧草廬)했던 유비의 지혜가 현대 기업 경영에도 필요하다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=삼고초려",
    naverLink: "https://hanja.dict.naver.com/search?query=三顧草廬"
  },
  {
    id: 1009,
    category: "동음이의어",
    level: "중등/필수",
    question: "개인의 소질이나 능력을 계발할 때 쓰이는 올바른 단어는?",
    sentence: "방학 동안 독서와 코딩을 통해 자신의 잠재력을 [ 계발 / 개발 ]하기로 했다.",
    options: ["啓發 (계발)", "開發 (개발)", "啓發 (개발)", "改發 (개발)"],
    answerIndex: 0,
    hanjaWord: "啓發",
    hanjaChars: [
      { char: "啓", sound: "계", meaning: "열" },
      { char: "發", sound: "발", meaning: "필/일어날" }
    ],
    explanation: "'계발(啓發)'은 슬기나 재능, 사상 따위를 일깨워 높은 경지로 끌어올리는 것입니다. 자원이나 토지, 소프트웨어를 새롭게 만들어내는 것은 '개발(開發)'입니다.",
    usage: "자기 계발, 잠재 능력 계발, 창의성 계발",
    exampleSentence: "청소년 시기에는 다양한 경험을 통해 자기 계발(啓發)에 힘쓰는 것이 좋다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=계발",
    naverLink: "https://hanja.dict.naver.com/search?query=啓發"
  },
  {
    id: 1010,
    category: "동음이의어",
    level: "중등/필수",
    question: "새로운 기술, 신제품, 소프트웨어 프로그램을 만들 때 올바른 단어는?",
    sentence: "우리 회사는 새로운 인공지능 번역 엔진을 [ 개발 / 계발 ]하고 있다.",
    options: ["開發 (개발)", "啓發 (계발)", "改發 (개발)", "開發 (개벌)"],
    answerIndex: 0,
    hanjaWord: "開發",
    hanjaChars: [
      { char: "開", sound: "개", meaning: "열" },
      { char: "發", sound: "발", meaning: "필/나타날" }
    ],
    explanation: "'개발(開發)'은 새로운 물건을 만들거나 새로운 영역을 개척하여 유용하게 만드는 것입니다.",
    usage: "기술 개발, 프로그램 개발, 신도시 개발, 신약 개발",
    exampleSentence: "친환경 신재생 에너지 기술을 개발(開發)하여 상용화에 성공했다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=개발",
    naverLink: "https://hanja.dict.naver.com/search?query=開發"
  },
  {
    id: 1011,
    category: "사자성어",
    level: "중등/필수",
    question: "다른 사람의 하찮은 말이나 행동도 자신의 인격 수양에 도움이 될 수 있음을 이르는 말은?",
    sentence: "경쟁사의 실패 사례를 [ 타산지석 / 타산지석 ]으로 삼아 우리는 같은 실수를 피했다.",
    options: ["他山之石 (타산지석)", "他山知石 (타산지석)", "反面敎師 (반면교사)", "漁父之利 (어부지리)"],
    answerIndex: 0,
    hanjaWord: "他山之石",
    hanjaChars: [
      { char: "他", sound: "타", meaning: "다를/남" },
      { char: "山", sound: "산", meaning: "뫼/산" },
      { char: "之", sound: "지", meaning: "갈/의" },
      { char: "石", sound: "석", meaning: "돌" }
    ],
    explanation: "다른 산의 나쁜 돌이라도 내 옥을 가는 데 쓸 수 있다는 시경의 구절에서 온 말로, 남의 결점이나 실수도 자신의 발전을 위한 거울로 삼을 수 있음을 뜻합니다.",
    usage: "타인의 실수 분석, 실패로부터 배우는 교훈",
    exampleSentence: "과거의 쓰라린 실패를 타산지석(他山之石)으로 삼아 완벽한 안전 관리 체계를 수립했다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=타산지석",
    naverLink: "https://hanja.dict.naver.com/search?query=他山之石"
  },
  {
    id: 1012,
    category: "사자성어",
    level: "중등/필수",
    question: "정도가 지나친 것은 미치지 못한 것과 같다는 뜻으로, 중용의 중요성을 이르는 사자성어는?",
    sentence: "공부나 운동도 무리하게 밤을 새우면 건강을 해치니 [ 과유불급 / 과유불급 ]이다.",
    options: ["過猶不及 (과유불급)", "過由不及 (과유불급)", "過遊不及 (과유불급)", "過猶不級 (과유불급)"],
    answerIndex: 0,
    hanjaWord: "過猶不及",
    hanjaChars: [
      { char: "過", sound: "과", meaning: "지날/지나칠" },
      { char: "猶", sound: "유", meaning: "오히려/같을" },
      { char: "不", sound: "불", meaning: "아닐" },
      { char: "及", sound: "급", meaning: "미칠" }
    ],
    explanation: "논어 선진편에 나오는 공자의 말씀으로, 넘치는 것은 모자라는 것과 마찬가지로 바람직하지 않다는 가르침입니다.",
    usage: "과도한 욕심 경계, 절제와 균형 강조",
    exampleSentence: "칭찬도 지나치면 아첨이 될 수 있으니 과유불급(過猶不及)을 잊지 말아야 한다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=과유불급",
    naverLink: "https://hanja.dict.naver.com/search?query=過猶不及"
  },
  {
    id: 1013,
    category: "사자성어",
    level: "초등/기초",
    question: "고생 끝에 즐거움이 온다는 뜻으로, 어려움을 이겨내면 좋은 날이 온다는 사자성어는?",
    sentence: "비록 지금은 힘들더라도 꾸준히 노력하면 [ 고진감래 / 고진감래 ]가 될 거야!",
    options: ["苦盡甘來 (고진감래)", "苦進甘來 (고진감래)", "苦盡甘萊 (고진감래)", "事必歸正 (사필귀정)"],
    answerIndex: 0,
    hanjaWord: "苦盡甘來",
    hanjaChars: [
      { char: "苦", sound: "고", meaning: "쓸/괴로울" },
      { char: "盡", sound: "진", meaning: "다할" },
      { char: "甘", sound: "감", meaning: "달" },
      { char: "來", sound: "래", meaning: "올" }
    ],
    explanation: "쓴맛이 다하면 단맛이 온다는 뜻으로, 힘든 고난을 견뎌내면 반드시 기쁨과 결실이 찾아온다는 격려의 말입니다.",
    usage: "수험생 응원, 힘든 시기를 겪는 이들에 대한 위로",
    exampleSentence: "수년간의 고생 끝에 고진감래(苦盡甘來)로 우승 트로피를 품에 안았다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=고진감래",
    naverLink: "https://hanja.dict.naver.com/search?query=苦盡甘來"
  },
  {
    id: 1014,
    category: "사자성어",
    level: "중등/필수",
    question: "눈 위에 서리가 더해진다는 뜻으로, 어려운 일에 또 어려운 일이 겹침을 뜻하는 사자성어는?",
    sentence: "갑자기 비가 쏟아지는데 버스마저 끊겨 [ 설상가상 / 설상가상 ]의 처지가 되었다.",
    options: ["雪上加霜 (설상가상)", "雪常加霜 (설상가상)", "雪相加霜 (설상가상)", "風前燈火 (풍전등화)"],
    answerIndex: 0,
    hanjaWord: "雪上加霜",
    hanjaChars: [
      { char: "雪", sound: "설", meaning: "눈" },
      { char: "上", sound: "상", meaning: "위" },
      { char: "加", sound: "가", meaning: "더할" },
      { char: "霜", sound: "상", meaning: "서리" }
    ],
    explanation: "눈 위에 또 서리가 내린다는 뜻으로, 엎친 데 덮친 격으로 불행이나 재난이 거듭하여 닥침을 비유합니다.",
    usage: "연쇄적인 악재, 복합적인 위기 상황",
    exampleSentence: "부상자가 속출한 상황에서 설상가상(雪上加霜)으로 기상 악화까지 겹쳤다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=설상가상",
    naverLink: "https://hanja.dict.naver.com/search?query=雪上加霜"
  },
  {
    id: 1015,
    category: "사자성어",
    level: "중등/필수",
    question: "재앙이나 위기가 바뀌어 오히려 복이나 좋은 기회가 됨을 뜻하는 사자성어는?",
    sentence: "실패를 분석해 더 뛰어난 제품을 출시했으니 이번 위기가 [ 전화위복 / 전화위복 ]이 되었다.",
    options: ["轉禍爲福 (전화위복)", "轉火爲福 (전화위복)", "傳禍爲福 (전화위복)", "塞翁之馬 (새옹지마)"],
    answerIndex: 0,
    hanjaWord: "轉禍爲福",
    hanjaChars: [
      { char: "轉", sound: "전", meaning: "구를/바뀔" },
      { char: "禍", sound: "화", meaning: "재앙" },
      { char: "爲", sound: "위", meaning: "할/될" },
      { char: "福", sound: "복", meaning: "복" }
    ],
    explanation: "재앙(禍)을 바꾸어 오히려 복(福)으로 만든다는 전국책의 고사로, 위기를 슬기롭게 극복하여 더 큰 도약의 발판으로 삼음을 뜻합니다.",
    usage: "위기 극복 사례, 반전의 성공 스토리",
    exampleSentence: "초기 제품 결함을 완벽히 보완하여 전화위복(轉禍爲福)으로 고객 신뢰를 얻었다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=전화위복",
    naverLink: "https://hanja.dict.naver.com/search?query=轉禍爲福"
  },
  {
    id: 1016,
    category: "동음이의어",
    level: "실무/고등",
    question: "원래의 형태나 성질을 잘 간직하여 보존할 때 알맞은 한자어는?",
    sentence: "귀중한 문화재는 훼손되지 않도록 원형 그대로 [ 보존 / 보전 ]해야 한다.",
    options: ["保存 (보존)", "保全 (보전)", "保尊 (보존)", "補存 (보존)"],
    answerIndex: 0,
    hanjaWord: "保存",
    hanjaChars: [
      { char: "保", sound: "보", meaning: "지킬" },
      { char: "存", sound: "존", meaning: "있을" }
    ],
    explanation: "'보존(保存)'은 잘 보살펴 간수하고 온전하게 유지하는 것입니다. 반면 '보전(保全)'은 온전하게 보호하여 유지하거나 부족한 것을 채우는(補塡) 데 쓰입니다.",
    usage: "문화재 보존, 생태계 보존, 문서 보존",
    exampleSentence: "역사 유적지를 원형대로 영구 보존(保存)하기 위한 복원 사업이 착수되었다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=보존",
    naverLink: "https://hanja.dict.naver.com/search?query=保存"
  },
  {
    id: 1017,
    category: "동음이의어",
    level: "실무/고등",
    question: "어떤 목표를 향하여 뜻이 쏠리거나 지향할 때 알맞은 한자어는?",
    sentence: "우리는 평화와 상호 번영의 미래를 [ 지향 / 지양 ]해야 한다.",
    options: ["志向 (지향)", "止揚 (지양)", "指向 (지향)", "持向 (지향)"],
    answerIndex: 0,
    hanjaWord: "志向",
    hanjaChars: [
      { char: "志", sound: "지", meaning: "뜻" },
      { char: "向", sound: "향", meaning: "향할" }
    ],
    explanation: "'지향(志向)'은 어떤 목표에 뜻이 쏠리어 향하는 것입니다. 반대로 피하거나 하지 말아야 할 것은 '지양(止揚 - 그칠 지, 오를 양)'입니다.",
    usage: "미래 지향적 가치, 고객 중심 지향, 친환경 지향",
    exampleSentence: "시대 변화에 발맞추어 지속 가능한 발전을 지향(志向)하는 정책이 필요하다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=지향",
    naverLink: "https://hanja.dict.naver.com/search?query=志向"
  },
  {
    id: 1018,
    category: "동음이의어",
    level: "실무/고등",
    question: "더 높은 단계로 나아가기 위해 피하거나 삼가야 할 것을 이르는 말은?",
    sentence: "근거 없는 비방과 소모적인 논쟁은 이제 [ 지양 / 지향 ]해야 합니다.",
    options: ["止揚 (지양)", "志向 (지향)", "遲揚 (지양)", "止陽 (지양)"],
    answerIndex: 0,
    hanjaWord: "止揚",
    hanjaChars: [
      { char: "止", sound: "지", meaning: "그칠" },
      { char: "揚", sound: "양", meaning: "오를/날릴" }
    ],
    explanation: "'지양(止揚)'은 철학(헤겔 변증법) 용어로, 부정하면서도 더 높은 차원으로 승화시키는 것을 뜻하며, 흔히 불필요한 행동이나 태도를 피하고 삼갈 때 씁니다.",
    usage: "갈등 지양, 낭비 지양, 일회용품 사용 지양",
    exampleSentence: "감정적인 대립을 지양(止揚)하고 합리적인 대안을 모색해야 한다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=지양",
    naverLink: "https://hanja.dict.naver.com/search?query=止揚"
  },
  {
    id: 1019,
    category: "사자성어",
    level: "초등/기초",
    question: "결심한 마음이 사흘을 넘기지 못한다는 뜻으로, 의지가 약함을 이르는 말은?",
    sentence: "새해 운동 다짐이 [ 작심삼일 / 작심삼일 ]로 끝나지 않도록 계획을 세웠다.",
    options: ["作心三日 (작심삼일)", "昨心三日 (작심삼일)", "作深三日 (작심삼일)", "作心三目 (작심삼일)"],
    answerIndex: 0,
    hanjaWord: "作心三日",
    hanjaChars: [
      { char: "作", sound: "작", meaning: "지을" },
      { char: "心", sound: "심", meaning: "마음" },
      { char: "三", sound: "삼", meaning: "석" },
      { char: "日", sound: "일", meaning: "날" }
    ],
    explanation: "단단히 먹은 마음이 사흘을 못 간다는 뜻으로, 결심이 굳지 못하여 쉽게 포기하는 것을 이릅니다.",
    usage: "새해 목표, 금연/다이어트 다짐, 공부 계획",
    exampleSentence: "작심삼일(作心三日)을 극복하려면 매일 작은 습관부터 실천하는 것이 좋다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=작심삼일",
    naverLink: "https://hanja.dict.naver.com/search?query=作心三日"
  },
  {
    id: 1020,
    category: "사자성어",
    level: "중등/필수",
    question: "여우가 호랑이의 위세를 빌려 호기를 부린다는 뜻의 사자성어는?",
    sentence: "권력자의 친척이라는 핑계로 [ 호가호위 / 호가호위 ]하며 부당한 이득을 챙겼다.",
    options: ["狐假虎威 (호가호위)", "虎假狐威 (호가호위)", "狐家虎威 (호가호위)", "狐假虎圍 (호가호위)"],
    answerIndex: 0,
    hanjaWord: "狐假虎威",
    hanjaChars: [
      { char: "狐", sound: "호", meaning: "여우" },
      { char: "假", sound: "가", meaning: "빌릴" },
      { char: "虎", sound: "호", meaning: "범/호랑이" },
      { char: "威", sound: "위", meaning: "위엄" }
    ],
    explanation: "전국책 초책에 나오는 고사로, 남의 권세를 등에 업고 제 위세를 부리는 교활한 사람을 비유합니다.",
    usage: "권력 남용 비판, 배후 인물의 전횡",
    exampleSentence: "실력도 없는 자가 상사의 위세를 호가호위(狐假虎威)하며 동료들을 괴롭혔다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=호가호위",
    naverLink: "https://hanja.dict.naver.com/search?query=狐假虎威"
  },
  {
    id: 1021,
    category: "사자성어",
    level: "중등/필수",
    question: "물어보는 말에 전혀 엉뚱한 대답을 하는 것을 이르는 사자성어는?",
    sentence: "회의에서 예산 문제를 물었더니 [ 동문서답 / 동문서답 ]으로 날씨 이야기만 했다.",
    options: ["東問西答 (동문서답)", "同問西答 (동문서답)", "東問書答 (동문서답)", "東聞西答 (동문서답)"],
    answerIndex: 0,
    hanjaWord: "東問西答",
    hanjaChars: [
      { char: "東", sound: "동", meaning: "동녘" },
      { char: "問", sound: "문", meaning: "물을" },
      { char: "西", sound: "서", meaning: "서녘" },
      { char: "答", sound: "답", meaning: "대답할" }
    ],
    explanation: "동쪽을 묻는 말에 서쪽을 답한다는 뜻으로, 요점에서 벗어난 엉뚱한 말을 대답하는 것을 이릅니다.",
    usage: "엉뚱한 답변, 청문회 회피성 발언 비판",
    exampleSentence: "핵심 질문에 대해 동문서답(東問西答)으로 일관하는 태도는 신뢰를 잃게 만든다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=동문서답",
    naverLink: "https://hanja.dict.naver.com/search?query=東問西答"
  },
  {
    id: 1022,
    category: "사자성어",
    level: "고등/심화",
    question: "자신의 뚜렷한 주관 없이 남의 주장에 맹목적으로 동조함을 이르는 말은?",
    sentence: "가짜 뉴스에 [ 부화뇌동 / 부화뇌동 ]하지 말고 객관적 팩트를 검증해야 한다.",
    options: ["附和雷同 (부화뇌동)", "付和雷同 (부화뇌동)", "附和腦同 (부화뇌동)", "浮和雷同 (부화뇌동)"],
    answerIndex: 0,
    hanjaWord: "附和雷同",
    hanjaChars: [
      { char: "附", sound: "부", meaning: "붙을" },
      { char: "和", sound: "화", meaning: "화할/응할" },
      { char: "雷", sound: "뇌", meaning: "우레" },
      { char: "同", sound: "동", meaning: "같을" }
    ],
    explanation: "우레가 울리면 만물이 함께 울리듯, 옳고 그름을 따지지 않고 다른 사람의 의견에 덩달아 따르는 어리석은 태도를 뜻합니다.",
    usage: "여론 편승 비판, 주체적인 판단 강조",
    exampleSentence: "지성인이라면 대중의 편견에 부화뇌동(附和雷同)하지 않고 진실을 추구해야 한다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=부화뇌동",
    naverLink: "https://hanja.dict.naver.com/search?query=附和雷同"
  },
  {
    id: 1023,
    category: "사자성어",
    level: "중등/필수",
    question: "평소에 미리 준비해 두면 닥쳐올 재난이나 우환을 피할 수 있음을 이르는 사자성어는?",
    sentence: "재난 대비 훈련과 비상식량 구비는 [ 유비무환 / 유비무환 ]의 기본이다.",
    options: ["有備無患 (유비무환)", "有備無歡 (유비무환)", "唯備無患 (유비무환)", "有備無丸 (유비무환)"],
    answerIndex: 0,
    hanjaWord: "有備無患",
    hanjaChars: [
      { char: "有", sound: "유", meaning: "있을" },
      { char: "備", sound: "비", meaning: "갖출/준비할" },
      { char: "無", sound: "무", meaning: "없을" },
      { char: "患", sound: "환", meaning: "근심/재앙" }
    ],
    explanation: "춘추좌씨전에 나오는 말로, 미리 준비가 철저하면 걱정거리가 없다는 격언입니다.",
    usage: "안전 점검, 비상 대응 계획, 저축과 보험",
    exampleSentence: "유비무환(有備無患)의 정신으로 서버 백업 체계를 삼중화했다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=유비무환",
    naverLink: "https://hanja.dict.naver.com/search?query=有備無患"
  },
  {
    id: 1024,
    category: "사자성어",
    level: "중등/필수",
    question: "날마다 발전하고 달마다 나아간다는 뜻으로, 실력이 매우 빠르게 발전함을 이르는 말은?",
    sentence: "코딩을 시작한 지 몇 달 만에 실력이 [ 일취월장 / 일취월장 ]하여 놀라움을 자아냈다.",
    options: ["日就月將 (일취월장)", "日進月長 (일진월장)", "日聚月將 (일취월장)", "日就月長 (일취월장)"],
    answerIndex: 0,
    hanjaWord: "日就月將",
    hanjaChars: [
      { char: "日", sound: "일", meaning: "날" },
      { char: "就", sound: "취", meaning: "나아갈/이룰" },
      { char: "月", sound: "월", meaning: "달" },
      { char: "將", sound: "장", meaning: "나아갈/장수" }
    ],
    explanation: "시경 주송에 나오는 말로, 날마다 성취하고 달마다 나아간다는 뜻입니다.",
    usage: "학업 성적 향상, 예술/운동 기량 발전",
    exampleSentence: "꾸준한 연습 끝에 학생의 피아노 실력이 일취월장(日就月將)했다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=일취월장",
    naverLink: "https://hanja.dict.naver.com/search?query=日就月將"
  },
  {
    id: 1025,
    category: "기초한자",
    level: "초등/기초",
    question: "책을 읽음을 뜻하는 '독서'의 올바른 한자 표기는?",
    sentence: "마음의 양식을 쌓기 위해 주말마다 도서관에서 [ 독서 / 독서 ]를 즐긴다.",
    options: ["讀書 (독서)", "督書 (독서)", "讀序 (독서)", "獨書 (독서)"],
    answerIndex: 0,
    hanjaWord: "讀書",
    hanjaChars: [
      { char: "讀", sound: "독", meaning: "읽을" },
      { char: "書", sound: "서", meaning: "글/책" }
    ],
    explanation: "'읽을 독(讀)'과 '글 서(書)'가 합쳐져 책을 읽는 행위를 뜻합니다.",
    usage: "독서 토론, 독서 습관, 독서 통장",
    exampleSentence: "독서(讀書)를 통해 넓은 세상과 깊은 지혜를 경험할 수 있다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=독서",
    naverLink: "https://hanja.dict.naver.com/search?query=讀書"
  },
  {
    id: 1026,
    category: "기초한자",
    level: "초등/기초",
    question: "아버지와 어머니를 아울러 이르는 '부모'의 올바른 한자 표기는?",
    sentence: "언제나 사랑으로 보살펴 주시는 [ 부모 / 부모 ]님께 감사드립니다.",
    options: ["父母 (부모)", "夫母 (부모)", "父某 (부모)", "付母 (부모)"],
    answerIndex: 0,
    hanjaWord: "父母",
    hanjaChars: [
      { char: "父", sound: "부", meaning: "아비/아버지" },
      { char: "母", sound: "모", meaning: "어미/어머니" }
    ],
    explanation: "'아비 부(父)'와 '어미 모(母)'가 결합한 가장 기본적인 혈육 관계 한자어입니다.",
    usage: "부모 은혜, 어버이날, 부모 교육",
    exampleSentence: "부모(父母)님의 은혜는 하늘보다 높고 바다보다 깊다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=부모",
    naverLink: "https://hanja.dict.naver.com/search?query=父母"
  },
  {
    id: 1027,
    category: "사자성어",
    level: "고등/심화",
    question: "많은 사람들 중에서 가장 뛰어난 사람이나 물건을 비유하는 고사성어는?",
    sentence: "이번 전시회에 출품된 작품들 중 이 수묵화가 단연 [ 백미 / 백미 ]로 꼽힌다.",
    options: ["白眉 (백미)", "百美 (백미)", "白米 (백미)", "伯眉 (백미)"],
    answerIndex: 0,
    hanjaWord: "白眉",
    hanjaChars: [
      { char: "白", sound: "백", meaning: "흰" },
      { char: "眉", sound: "미", meaning: "눈썹" }
    ],
    explanation: "삼국지 촉나라 마량의 다섯 형제 중 흰 눈썹을 가진 마량이 가장 재주가 뛰어났다는 고사에서 비롯되어 여럿 중 으뜸을 뜻합니다.",
    usage: "명작의 최고 장면, 대회 최고 우수작",
    exampleSentence: "주인공의 독백 장면은 이 영화 전체를 통틀어 최고의 백미(白眉)다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=백미",
    naverLink: "https://hanja.dict.naver.com/search?query=白眉"
  },
  {
    id: 1028,
    category: "동음이의어",
    level: "실무/고등",
    question: "조세나 공과금, 벌금 따위를 의무자에게 물릴 때 올바른 한자어는?",
    sentence: "환경 오염 방지를 위해 폐기물 배출 기업에 부담금을 [ 부과 / 부과 ]했다.",
    options: ["賦課 (부과)", "附課 (부과)", "負課 (부과)", "付課 (부과)"],
    answerIndex: 0,
    hanjaWord: "賦課",
    hanjaChars: [
      { char: "賦", sound: "부", meaning: "구실/부과할" },
      { char: "課", sound: "과", meaning: "매길/세금" }
    ],
    explanation: "'부과(賦課)'는 세금이나 부담금, 과태료 따위를 매겨 부담하게 하는 것입니다. 일정한 직무나 책임을 맡기는 것은 '부여(附與)' 또는 '부과'로 구분됩니다.",
    usage: "세금 부과, 벌금 부과, 관세 부과",
    exampleSentence: "규정을 위반한 차량에 대해 과태료가 부과(賦課)되었다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=부과",
    naverLink: "https://hanja.dict.naver.com/search?query=賦課"
  },
  {
    id: 1029,
    category: "사자성어",
    level: "중등/필수",
    question: "맑은 거울과 고요한 물이라는 뜻으로, 잡념이 없이 아주 맑고 깨끗한 마음을 뜻하는 사자성어는?",
    sentence: "모든 욕심을 내려놓고 [ 명경지수 / 명경지수 ]와 같은 평온한 심경에 이르렀다.",
    options: ["明鏡止水 (명경지수)", "明鏡流水 (명경유수)", "明境止水 (명경지수)", "淸鏡止水 (청경지수)"],
    answerIndex: 0,
    hanjaWord: "明鏡止水",
    hanjaChars: [
      { char: "明", sound: "명", meaning: "밝을" },
      { char: "鏡", sound: "경", meaning: "거울" },
      { char: "止", sound: "지", meaning: "그칠/고요할" },
      { char: "水", sound: "수", meaning: "물" }
    ],
    explanation: "장자 덕충부편에 나오는 말로, 흔들림 없이 고요하고 투명한 마음가짐을 비유합니다.",
    usage: "명상과 마음 다스림, 심리적 평정심",
    exampleSentence: "결전을 앞둔 궁사는 명경지수(明鏡止水)의 마음으로 활시위를 당겼다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=명경지수",
    naverLink: "https://hanja.dict.naver.com/search?query=明鏡止水"
  },
  {
    id: 1030,
    category: "기초한자",
    level: "초등/기초",
    question: "나무를 심는 날인 식목일의 '식목'에 쓰이는 한자는?",
    sentence: "매년 4월 5일 [ 식목 / 식목 ]일에는 온 가족이 모여 푸른 나무를 심는다.",
    options: ["植木 (식목)", "殖木 (식목)", "植目 (식목)", "息木 (식목)"],
    answerIndex: 0,
    hanjaWord: "植木",
    hanjaChars: [
      { char: "植", sound: "식", meaning: "심을" },
      { char: "木", sound: "목", meaning: "나무" }
    ],
    explanation: "'심을 식(植)'과 '나무 목(木)'이 결합하여 나무를 심는다는 뜻을 가집니다.",
    usage: "식목일 행사, 식목 주간, 조림 사업",
    exampleSentence: "산불 피해 지역에 대규모 식목(植木) 사업을 펼쳐 숲을 복원했다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=식목",
    naverLink: "https://hanja.dict.naver.com/search?query=植木"
  },
  {
    id: 1031,
    category: "사자성어",
    level: "고등/심화",
    question: "사실에 토대를 두어 진리를 탐구한다는 뜻으로, 실증적인 과학적 연구 태도를 이르는 사자성어는?",
    sentence: "조선 후기 실학자들은 공리공론을 배격하고 [ 실사구시 / 실사구시 ]의 학문을 발전시켰다.",
    options: ["實事求是 (실사구시)", "實事求時 (실사구시)", "實使求是 (실사구시)", "實事究是 (실사구시)"],
    answerIndex: 0,
    hanjaWord: "實事求是",
    hanjaChars: [
      { char: "實", sound: "실", meaning: "열매/참" },
      { char: "事", sound: "사", meaning: "일" },
      { char: "求", sound: "구", meaning: "구할" },
      { char: "是", sound: "시", meaning: "옳을" }
    ],
    explanation: "한서 하간헌왕전에 나오는 말로, 헛된 관념에 얽매이지 않고 실질적인 증거와 사실을 토대로 진실을 밝혀내는 태도를 뜻합니다.",
    usage: "실증적 학문 연구, 실용적 정책 수립, 과학적 태도",
    exampleSentence: "실사구시(實事求是)의 정신으로 빅데이터에 기반한 최적의 솔루션을 도출했다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=실사구시",
    naverLink: "https://hanja.dict.naver.com/search?query=實事求是"
  },
  {
    id: 1032,
    category: "기초한자",
    level: "초등/기초",
    question: "나라를 사랑하는 마음을 뜻하는 '애국'의 올바른 한자 표기는?",
    sentence: "선열들의 숭고한 [ 애국 / 애국 ] 정신을 기리며 태극기를 게양했다.",
    options: ["愛國 (애국)", "愛局 (애국)", "哀國 (애국)", "隘國 (애국)"],
    answerIndex: 0,
    hanjaWord: "愛國",
    hanjaChars: [
      { char: "愛", sound: "애", meaning: "사랑할" },
      { char: "國", sound: "국", meaning: "나라" }
    ],
    explanation: "'사랑할 애(愛)'와 '나라 국(國)'이 결합하여 자신의 국가를 사랑하고 헌신하는 마음을 뜻합니다.",
    usage: "애국가 제창, 애국열사, 애국심 고취",
    exampleSentence: "독립운동가들의 뜨거운 애국(愛國)심이 오늘날의 대한민국을 만들었다.",
    dictLink: "https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=애국",
    naverLink: "https://hanja.dict.naver.com/search?query=愛國"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HANJA_QUESTION_BANK;
}
