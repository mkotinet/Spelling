# -*- coding: utf-8 -*-
"""
Level 1 English Generator (초등/기초 - IDs 15001 ~ 16000)
25 Words x 40 Distinct Situational Scenarios = 1,000 Questions
Zero Generic Meta-Templates! 100% Contextual Deduction!
"""

import json

LEVEL_NAME = "초등/기초"
CATEGORY = "기초 스펠링"

# 10 Elementary Daily Life Frames
FRAMES_LVL1 = [
    ("You should always remember to {act}.", "항상 {ko}하는 것을 기억해야 합니다."),
    ("It is very helpful to {act}.", "{ko}하는 것은 매우 유익합니다."),
    ("Our teacher advised us to {act}.", "선생님께서는 우리에게 {ko}하라고 조언하셨습니다."),
    ("Before leaving the room, don't forget to {act}.", "방을 나서기 전에 {ko}하는 것을 잊지 마세요."),
    ("Many students gather after school to {act}.", "많은 학생들이 방과 후 모여 {ko}합니다."),
    ("In daily life, people frequently {act}.", "일상생활에서 사람들은 자주 {ko}합니다."),
    ("During our project, we decided to {act}.", "프로젝트를 진행하는 동안, 우리는 {ko}하기로 결정했습니다."),
    ("On a quiet weekend morning, it feels wonderful to {act}.", "한적한 주말 아침에 {ko}하는 것은 참으로 기분 좋습니다."),
    ("To prepare for tomorrow's schedule, let's {act}.", "내일 일정을 준비하기 위해 우리 함께 {ko}합시다."),
    ("Everyone in the study group agreed to {act}.", "학습 모둠의 모든 사람이 {ko}하기로 합의했습니다.")
]

# 25 Core Elementary Words with 4 Distinct Predicates / Context Clues
RAW_WORDS_LVL1 = [
    {
        "word": "calendar",
        "phonetic": "/ˈkæl.ən.dɚ/",
        "meaning": "달력, 일정표",
        "wrong": ["calender", "calandar", "celendar"],
        "grammar": "명사이며, 끝 음절 철자는 '-er'이 아닌 '-ar'입니다.",
        "expl": "'달력'은 calendar가 올바릅니다. 마지막 철자가 '-ar'임에 주의하세요.",
        "idioms": "wall calendar (벽걸이 달력), mark the date (날짜를 표시하다)",
        "predicates": [
            ("check the dates on the wall [ (     ) ]", "벽에 걸린 달력에서 날짜를 확인"),
            ("mark the exam day on the desk [ (     ) ]", "탁상 달력에 시험 날짜를 표시"),
            ("flip to the new month on our paper [ (     ) ]", "종이 달력에서 새 달의 페이지를 넘김"),
            ("look at the holiday schedule on the kitchen [ (     ) ]", "주방 달력에서 공휴일 일정을 확인")
        ]
    },
    {
        "word": "monkeys",
        "phonetic": "/ˈmʌŋ.kiz/",
        "meaning": "원숭이들",
        "wrong": ["monkies", "monkeyes", "monkise"],
        "grammar": "모음(e)+y로 끝나는 명사의 복수형은 -ies가 아닌 단순히 -s만 붙입니다.",
        "expl": "monkey의 복수형은 monkeys입니다. -ies로 바꾸지 않습니다.",
        "idioms": "cute monkeys (귀여운 원숭이들), swing in the trees (나무 사이를 오가다)",
        "predicates": [
            ("watch the clever [ (     ) ] eating bananas in the tree", "나무에서 바나나를 먹고 있는 영리한 원숭이들을 관찰"),
            ("observe playful [ (     ) ] swinging between high jungle branches", "높은 정글 나뭇가지 사이를 오가는 장난기 많은 원숭이들을 관찰"),
            ("feed a group of friendly [ (     ) ] at the safari zoo", "사파리 동물원에 있는 다정한 원숭이 무리에게 먹이를 제공"),
            ("photograph wild [ (     ) ] chattering loudly in the forest canopy", "숲속 나무 꼭대기에서 시끄럽게 재잘거리는 야생 원숭이들을 촬영")
        ]
    },
    {
        "word": "weather",
        "phonetic": "/ˈweð.ɚ/",
        "meaning": "날씨, 기후",
        "wrong": ["whether", "wether", "waether"],
        "grammar": "날씨를 뜻하는 명사는 'whether(~인지 아닌지)'가 아닌 'weather'입니다.",
        "expl": "'날씨'는 weather가 맞습니다. 접속사 whether와 혼동하지 마세요.",
        "idioms": "sunny weather (화창한 날씨), weather forecast (일기예보)",
        "predicates": [
            ("check the sunny morning [ (     ) ] report on television", "텔레비전에서 화창한 아침 일기예보 날씨를 확인"),
            ("enjoy the warm spring [ (     ) ] in the open park", "야외 공원에서 따뜻한 봄 날씨를 만끽"),
            ("prepare for sudden stormy [ (     ) ] near the mountain trail", "산길 근처에서 갑작스러운 폭풍우 날씨에 대비"),
            ("listen to the weekend [ (     ) ] forecast before going out", "외출하기 전에 주말 일기예보 날씨를 청취")
        ]
    },
    {
        "word": "library",
        "phonetic": "/ˈlaɪ.brer.i/",
        "meaning": "도서관",
        "wrong": ["libary", "librery", "liblary"],
        "grammar": "명사이며, 가운데 'r'이 두 번(li-bra-ry) 들어가는 철자에 주의합니다.",
        "expl": "'도서관'은 library입니다. 발음 때문에 가운데 'r'을 빠뜨리지 않도록 유의하세요.",
        "idioms": "public library (공공 도서관), borrow books (책을 대출하다)",
        "predicates": [
            ("borrow fairy tale books from the school [ (     ) ]", "학교 도서관에서 동화책을 대출"),
            ("read science magazines quietly in the community [ (     ) ]", "지역 도서관에서 조용히 과학 잡지를 열람"),
            ("return borrowed novels to the public [ (     ) ] desk", "공공 도서관 안내 데스크에 대출한 소설책을 반납"),
            ("search for historical documents at the town [ (     ) ]", "마을 도서관에서 역사 자료를 검색")
        ]
    },
    {
        "word": "beautiful",
        "phonetic": "/ˈbjuː.t̬ə.fəl/",
        "meaning": "아름다운",
        "wrong": ["beutiful", "beautyful", "beatifull"],
        "grammar": "형용사이며, 접두 모음 'eau'와 접미사 '-ful'의 철자에 유의합니다.",
        "expl": "'아름다운'은 beautiful이 맞습니다. 'eau'의 철자 순서를 기억하세요.",
        "idioms": "beautiful flowers (아름다운 꽃들), beautiful scenery (아름다운 풍경)",
        "predicates": [
            ("admire the colorful and [ (     ) ] flowers in the garden", "정원에 핀 다채롭고 아름다운 꽃들을 감상"),
            ("photograph the remarkably [ (     ) ] sunset over the ocean", "바다 너머로 지는 매우 아름다운 일몰을 촬영"),
            ("listen to the exceptionally [ (     ) ] piano melody played on stage", "무대에서 연주되는 대단히 아름다운 피아노 선율을 감상"),
            ("gaze at the breathtaking and [ (     ) ] mountain valley scenery", "숨 막히게 아름다운 산골짜기 풍경을 조망")
        ]
    },
    {
        "word": "Wednesday",
        "phonetic": "/ˈwenz.deɪ/",
        "meaning": "수요일",
        "wrong": ["Wenesday", "Wedensday", "Wensday"],
        "grammar": "요일 고유명사이므로 대문자로 시작하며, 'd'가 묵음입니다.",
        "expl": "'수요일'은 Wednesday가 올바릅니다. 발음되지 않는 묵음 'd'에 주의하세요.",
        "idioms": "on every Wednesday (매주 수요일마다), Wednesday afternoon (수요일 오후)",
        "predicates": [
            ("attend the school orchestra practice on every [ (     ) ]", "매주 수요일마다 학교 오케스트라 연습에 참여"),
            ("play soccer with friends after school this [ (     ) ]", "이번 주 수요일 방과 후에 친구들과 축구 경기를 진행"),
            ("have the weekly science experiment club on [ (     ) ] afternoon", "수요일 오후에 주간 과학 실험 동아리 모임을 진행"),
            ("visit the local art museum together next [ (     ) ]", "다음 주 수요일에 다 함께 지역 미술관을 방문")
        ]
    },
    {
        "word": "February",
        "phonetic": "/ˈfeb.ruː.er.i/",
        "meaning": "2월",
        "wrong": ["Febuary", "Febrary", "Feburary"],
        "grammar": "월 이름은 대문자로 시작하며, 가운데 'r' 철자(Feb-ru-ary)에 유의합니다.",
        "expl": "'2월'은 February가 맞습니다. 가운데 첫 번째 'r'을 빠뜨리기 쉬우니 주의하세요.",
        "idioms": "in early February (2월 초순에), the shortest month (가장 짧은 달)",
        "predicates": [
            ("celebrate my grandfather's special birthday in [ (     ) ]", "2월에 할아버지의 특별한 생신을 축하"),
            ("participate in the winter ski camp during early [ (     ) ]", "2월 초순 동안 겨울 스키 캠프에 참가"),
            ("prepare for the upcoming graduation ceremony in late [ (     ) ]", "2월 하순에 다가오는 졸업식을 준비"),
            ("mark Valentine's Day on the calendar on [ (     ) ] 14th", "달력의 2월 14일에 발렌타인데이를 표시")
        ]
    },
    {
        "word": "vegetables",
        "phonetic": "/ˈvedʒ.tə.bəlz/",
        "meaning": "채소들, 야채",
        "wrong": ["vegtables", "vegitables", "vegitable"],
        "grammar": "명사 복수형이며, v-e-g-e-t-a-b-l-e-s 모음 철자에 주의합니다.",
        "expl": "'채소'는 vegetables가 맞습니다. 'ege' 모음 배열을 기억하세요.",
        "idioms": "fresh green vegetables (신선한 녹색 채소), eat your vegetables (채소를 골고루 먹다)",
        "predicates": [
            ("eat plenty of fresh green [ (     ) ] with dinner", "저녁 식사로 신선한 녹색 채소를 듬뿍 섭취"),
            ("harvest organic carrots and healthy [ (     ) ] from the garden", "텃밭에서 유기농 당근과 건강한 채소를 수확"),
            ("wash the crisp salad [ (     ) ] in cold running water", "흐르는 찬물에 아삭한 샐러드용 채소를 세척"),
            ("buy fresh seasonal [ (     ) ] at the morning farmers' market", "아침 농산물 직거래 장터에서 신선한 제철 채소를 구매")
        ]
    },
    {
        "word": "friend",
        "phonetic": "/frend/",
        "meaning": "친구",
        "wrong": ["freind", "frend", "friende"],
        "grammar": "모음 철자 'ie'(f-r-i-e-n-d) 순서에 주의합니다.",
        "expl": "'친구'는 friend가 맞습니다. 'ei'가 아닌 'ie' 순서입니다.",
        "idioms": "a true friend (진정한 친구), best friend (가장 친한 친구)",
        "predicates": [
            ("share delicious homemade cookies with my best [ (     ) ]", "가장 친한 친구와 맛있는 수제 쿠키를 공유"),
            ("write a warm and thoughtful letter to an old [ (     ) ]", "오랜 친구에게 따뜻하고 사려 깊은 편지를 작성"),
            ("offer a helping hand whenever a loyal [ (     ) ] is in need", "충직한 친구가 곤경에 처할 때마다 도움의 손길을 지원"),
            ("walk to school side by side with a close [ (     ) ]", "친한 친구와 나란히 어깨를 맞대고 등교를 함께")
        ]
    },
    {
        "word": "orange",
        "phonetic": "/ˈɔːr.ɪndʒ/",
        "meaning": "오렌지, 주황색",
        "wrong": ["orenge", "oringe", "orang"],
        "grammar": "명사 및 형용사이며, 두 번째 모음 철자는 'e'가 아닌 'a'입니다.",
        "expl": "'오렌지'는 orange입니다. o-r-a-n-g-e 철자에 주의하세요.",
        "idioms": "fresh orange juice (신선한 오렌지 주스), bright orange color (밝은 주황색)",
        "predicates": [
            ("peel the sweet and juicy [ (     ) ] for a healthy snack", "건강한 간식으로 달콤하고 과즙이 풍부한 오렌지 껍질을 제거"),
            ("drink a tall glass of freshly squeezed [ (     ) ] juice at breakfast", "아침 식사 때 갓 짠 신선한 오렌지 주스 한 잔을 음용"),
            ("paint the warm evening sunset with bright [ (     ) ] watercolors", "밝은 주황색 수채화 물감으로 따뜻한 저녁 노을을 채색"),
            ("pick ripe sweet [ (     ) ] fruit directly from the orchard trees", "과수원 나무에서 잘 익은 달콤한 오렌지 열매를 직접 수확")
        ]
    },
    {
        "word": "school",
        "phonetic": "/skuːl/",
        "meaning": "학교",
        "wrong": ["scool", "skool", "schol"],
        "grammar": "명사이며, 'sk-'가 아닌 'sch-' 철자에 유의합니다.",
        "expl": "'학교'는 school입니다. c를 빠뜨리지 않도록 유의하세요.",
        "idioms": "elementary school (초등학교), school bus (통학 버스)",
        "predicates": [
            ("walk happily to the neighborhood elementary [ (     ) ] every morning", "매일 아침 동네 초등학교를 향해 즐겁게 등교"),
            ("take the yellow public [ (     ) ] bus together with classmates", "반 친구들과 함께 노란색 통학 버스를 이용"),
            ("participate in the vibrant annual sports festival at [ (     ) ]", "학교에서 열리는 활기찬 연례 체육대회에 참가"),
            ("tidy up the shared desks in our clean [ (     ) ] classroom", "깨끗한 학교 교실에서 함께 쓰는 책상을 정리정돈")
        ]
    },
    {
        "word": "computer",
        "phonetic": "/kəmˈpjuː.t̬ɚ/",
        "meaning": "컴퓨터",
        "wrong": ["computor", "computar", "compter"],
        "grammar": "명사이며, 접미사는 '-or'이나 '-ar'이 아닌 '-er'입니다.",
        "expl": "'컴퓨터'는 computer가 맞습니다. 끝 철자가 '-er'입니다.",
        "idioms": "desktop computer (데스크톱 컴퓨터), computer screen (컴퓨터 화면)",
        "predicates": [
            ("type a short English homework essay on the desktop [ (     ) ]", "데스크톱 컴퓨터로 짧은 영어 숙제 에세이를 작성"),
            ("learn how to code beginner programs in the [ (     ) ] lab", "컴퓨터 실습실에서 초급 프로그램을 코딩하는 법을 학습"),
            ("search for interesting historical facts using the internet [ (     ) ]", "인터넷 컴퓨터를 활용하여 흥미로운 역사적 사실을 검색"),
            ("turn off the glowing screen of the personal [ (     ) ] before sleep", "잠들기 전에 개인용 컴퓨터의 모니터 전원을 차단")
        ]
    },
    {
        "word": "breakfast",
        "phonetic": "/ˈbrek.fəst/",
        "meaning": "아침 식사",
        "wrong": ["brakefast", "breakfest", "brekfast"],
        "grammar": "break(깨다) + fast(단식)의 합성어로 b-r-e-a-k-f-a-s-t 철자입니다.",
        "expl": "'아침 식사'는 breakfast입니다. 'break'와 'fast'의 결합 철자에 유의하세요.",
        "idioms": "eat breakfast (아침을 먹다), breakfast menu (조식 메뉴)",
        "predicates": [
            ("eat warm toasted bread and boiled eggs for [ (     ) ]", "아침 식사로 따뜻하게 구운 빵과 삶은 달걀을 섭취"),
            ("enjoy a nutritious bowl of cereal and milk for morning [ (     ) ]", "아침 식사로 영양가 높은 시리얼 한 그릇과 우유를 섭취"),
            ("prepare a balanced family [ (     ) ] before heading out", "외출하기 전에 균형 잡힌 가족 아침 식사를 준비"),
            ("never skip your healthy daily [ (     ) ] to stay energized", "활력을 유지하기 위해 건강한 매일의 아침 식사를 거르지 않도록 실천")
        ]
    },
    {
        "word": "elephant",
        "phonetic": "/ˈel.ə.fənt/",
        "meaning": "코끼리",
        "wrong": ["elefant", "eliphant", "elephent"],
        "grammar": "명사이며, f 소리가 'ph'로 표기되고 끝은 '-ant'입니다.",
        "expl": "'코끼리'는 elephant입니다. 'f'가 아닌 'ph', '-ent'가 아닌 '-ant'입니다.",
        "idioms": "long trunk of an elephant (코끼리의 긴 코), giant elephant (거대한 코끼리)",
        "predicates": [
            ("watch the giant African [ (     ) ] spray cool water with its trunk", "거대한 아프리카 코끼리가 긴 코로 시원한 물을 뿜는 모습을 관찰"),
            ("feed sweet crunchy peanuts to the friendly zoo [ (     ) ]", "동물원의 다정한 코끼리에게 달콤하고 바삭한 땅콩을 급여"),
            ("read a wildlife book about how a baby [ (     ) ] follows its mother", "아기 코끼리가 엄마를 따라다니는 내용의 야생동물 도서를 열람"),
            ("admire the immense size of the gentle grey [ (     ) ] family", "온순한 회색 코끼리 가족의 거대한 몸집을 감상")
        ]
    },
    {
        "word": "summer",
        "phonetic": "/ˈsʌm.ɚ/",
        "meaning": "여름",
        "wrong": ["sumer", "summor", "summerr"],
        "grammar": "명사이며, 가운데 'm'이 두 개(s-u-m-m-e-r) 들어갑니다.",
        "expl": "'여름'은 summer가 맞습니다. 'm'을 하나만 쓰지 않도록 주의하세요.",
        "idioms": "summer vacation (여름 방학), hot summer days (무더운 여름날)",
        "predicates": [
            ("swim in the outdoor wave pool during the hot [ (     ) ] vacation", "무더운 여름 방학 동안 야외 파도풀에서 물놀이를 진행"),
            ("eat refreshing cold red watermelon on a sunny [ (     ) ] afternoon", "화창한 여름날 오후에 시원한 빨간 수박을 섭취"),
            ("enjoy an exciting beach camping trip with family in early [ (     ) ]", "초여름에 가족과 함께 신나는 해변 캠핑을 만끽"),
            ("wear cool short-sleeved shirts during the humid [ (     ) ] months", "후텁지근한 여름철 동안 시원한 반소매 셔츠를 착용")
        ]
    },
    {
        "word": "autumn",
        "phonetic": "/ˈɑː.t̬əm/",
        "meaning": "가을",
        "wrong": ["autum", "automn", "auntumn"],
        "grammar": "명사이며, 끝의 'n' 철자가 묵음(au-tumn)입니다.",
        "expl": "'가을'은 autumn이 올바릅니다. 끝의 묵음 'n'을 빠뜨리지 않도록 유의하세요.",
        "idioms": "autumn leaves (단풍잎), crisp autumn air (상쾌한 가을 공기)",
        "predicates": [
            ("collect fallen yellow and crimson maple leaves in crisp [ (     ) ]", "선선한 가을에 떨어진 노랗고 붉은 단풍잎을 수집"),
            ("hike up the rocky mountain trail to view golden [ (     ) ] foliage", "황금빛 가을 단풍을 감상하기 위해 바위산 등산을 진행"),
            ("harvest ripe red sweet apples from the orchard in early [ (     ) ]", "초가을에 과수원에서 잘 익은 빨갛고 달콤한 사과를 수확"),
            ("feel the refreshing and cool evening breeze of late [ (     ) ]", "늦가을의 상쾌하고 시원한 저녁 바람을 체감")
        ]
    },
    {
        "word": "hospital",
        "phonetic": "/ˈhɑː.spɪ.t̬əl/",
        "meaning": "병원",
        "wrong": ["hospitel", "hospitle", "hosptial"],
        "grammar": "명사이며, 끝 음절은 '-el'이 아닌 '-al'(hos-pi-tal)입니다.",
        "expl": "'병원'은 hospital입니다. 마지막 모음이 'a'임에 유의하세요.",
        "idioms": "visit the hospital (병원에 가다), hospital ward (병원 병동)",
        "predicates": [
            ("visit a kind medical doctor at the local children's [ (     ) ]", "동네 어린이 병원에서 친절한 의사 선생님의 진료를 수검"),
            ("receive a seasonal vaccination shot safely at the community [ (     ) ]", "지역 병원에서 안전하게 계절 예방 접종을 접종"),
            ("bring warm get-well flowers to a sick relative in the [ (     ) ]", "병원에 입원한 친척에게 따뜻한 쾌유 기원 꽃을 전달"),
            ("wait calmly for a routine health checkup at the central [ (     ) ]", "중앙 병원에서 정기 건강검진을 차분히 대기")
        ]
    },
    {
        "word": "birthday",
        "phonetic": "/ˈbɝːθ.deɪ/",
        "meaning": "생일",
        "wrong": ["brithday", "bithday", "birthdae"],
        "grammar": "birth(출생) + day(날)의 합성어로 b-i-r-t-h-d-a-y 철자입니다.",
        "expl": "'생일'은 birthday입니다. 'ir'의 철자 순서에 주의하세요.",
        "idioms": "happy birthday (생일 축하해), birthday cake (생일 케이크)",
        "predicates": [
            ("blow out glowing candles on the sweet chocolate [ (     ) ] cake", "달콤한 초콜릿 생일 케이크 위의 촛불을 소등"),
            ("receive wrapped colorful surprise presents on my special [ (     ) ]", "나의 특별한 생일에 포장된 다채로운 깜짝 선물을 수령"),
            ("sing the cheerful celebratory song together at the surprise [ (     ) ] party", "깜짝 생일 파티에서 다 함께 신나는 축하 노래를 제창"),
            ("write a sincere and loving card to celebrate my mother's [ (     ) ]", "어머니의 생신을 축하해 드리기 위해 진심 어린 사랑의 카드를 작성")
        ]
    },
    {
        "word": "pencil",
        "phonetic": "/ˈpen.səl/",
        "meaning": "연필",
        "wrong": ["pencel", "pensil", "pencle"],
        "grammar": "명사이며, c가 's' 소리를 내고 끝은 '-il'(pen-cil)입니다.",
        "expl": "'연필'은 pencil이 맞습니다. 's'가 아닌 'c', '-el'이 아닌 '-il'입니다.",
        "idioms": "sharpen a pencil (연필을 깎다), pencil case (필통)",
        "predicates": [
            ("sharpen the wooden lead [ (     ) ] before taking the spelling quiz", "맞춤법 퀴즈를 보기 전에 나무 연필을 뾰족하게 절삭"),
            ("draw a detailed cartoon sketch using a soft graphite [ (     ) ]", "부드러운 흑연 연필을 사용하여 정밀한 만화 스케치를 묘사"),
            ("keep neat eraser tops and extra colored [ (     ) ] sticks in my desk case", "필통 안에 깔끔한 지우개와 여분의 색연필을 보관"),
            ("write down daily study notes carefully with a sharp [ (     ) ]", "뾰족한 연필로 매일의 학습 메모를 꼼꼼하게 기록")
        ]
    },
    {
        "word": "umbrella",
        "phonetic": "/ʌmˈbrel.ə/",
        "meaning": "우산",
        "wrong": ["umbrela", "umberella", "umbrellar"],
        "grammar": "명사이며, 'l'이 두 개(um-brel-la) 들어갑니다.",
        "expl": "'우산'은 umbrella가 맞습니다. 'l'이 두 개(ll) 들어가는 점에 주의하세요.",
        "idioms": "open an umbrella (우산을 펴다), folding umbrella (접이식 우산)",
        "predicates": [
            ("open a bright yellow folding [ (     ) ] in the pouring afternoon rain", "오후에 쏟아지는 빗속에서 밝은 노란색 접이식 우산을 개방"),
            ("bring a sturdy windproof [ (     ) ] on stormy monsoon mornings", "폭풍우 치는 장마철 아침에 튼튼한 방풍 우산을 지참"),
            ("share a large blue rain [ (     ) ] with a classmate walking home", "집으로 걸어가는 반 친구와 커다란 파란색 비 우산을 공유"),
            ("leave the wet dripping [ (     ) ] in the hallway entrance stand", "복도 현관 거치대에 물이 떨어지는 젖은 우산을 거치")
        ]
    },
    {
        "word": "guitar",
        "phonetic": "/ɡɪˈtɑːr/",
        "meaning": "기타",
        "wrong": ["gitar", "guiter", "guittar"],
        "grammar": "명사이며, 'gui-'로 시작하고 끝은 '-ar'입니다.",
        "expl": "'기타'는 guitar입니다. 'gitar'가 아니며 끝이 '-ar'입니다.",
        "idioms": "play the guitar (기타를 연주하다), acoustic guitar (통기타)",
        "predicates": [
            ("strum cheerful folk chords on the wooden acoustic [ (     ) ]", "나무 통기타로 경쾌한 포크송 코드를 연주"),
            ("tune the six nylon strings of the classical Spanish [ (     ) ]", "클래식 스페인 기타의 여섯 개 나일론 줄을 조율"),
            ("practice basic fingerstyle melodies on the electric [ (     ) ]", "일렉트릭 기타로 기초 핑거스타일 멜로디를 연습"),
            ("sing campfire tunes while playing the rhythm [ (     ) ]", "리듬 기타를 치면서 캠프파이어 노래를 합창")
        ]
    },
    {
        "word": "kitchen",
        "phonetic": "/ˈkɪtʃ.ən/",
        "meaning": "부엌, 주방",
        "wrong": ["kichen", "kitcken", "kitchin"],
        "grammar": "명사이며, 't'가 들어가 'tch' 철자(k-i-t-c-h-e-n)를 이룹니다.",
        "expl": "'부엌'은 kitchen입니다. 't'를 빠뜨려 'kichen'으로 쓰지 않도록 주의하세요.",
        "idioms": "kitchen counter (주방 조리대), cook in the kitchen (부엌에서 요리하다)",
        "predicates": [
            ("bake fresh chocolate chip cookies in the warm family [ (     ) ]", "따뜻한 집 부엌에서 갓 구운 초콜릿 칩 쿠키를 조리"),
            ("wash dishes and wipe the marble table in the clean [ (     ) ]", "깨끗한 주방에서 설거지를 하고 대리석 식탁을 청결하게 유지"),
            ("help prepare delicious vegetable soup in the home [ (     ) ]", "가정집 부엌에서 맛있는 야채수프 조리를 보조"),
            ("store fresh groceries and clean cooking utensils inside the [ (     ) ]", "주방 안에 신선한 식료품과 깨끗한 조리 도구를 정리")
        ]
    },
    {
        "word": "dinosaur",
        "phonetic": "/ˈdaɪ.nə.sɔːr/",
        "meaning": "공룡",
        "wrong": ["dinosoar", "dinosour", "dinosaure"],
        "grammar": "명사이며, 끝 음절 철자는 '-saur'(di-no-saur)입니다.",
        "expl": "'공룡'은 dinosaur가 맞습니다. 끝 철자가 '-saur'임에 주의하세요.",
        "idioms": "dinosaur fossil (공룡 화석), prehistoric dinosaur (선사시대 공룡)",
        "predicates": [
            ("look up at the gigantic fossil skeleton of a prehistoric [ (     ) ]", "선사시대 공룡의 거대한 화석 골격을 관람"),
            ("read an illustrated encyclopedia chapter about extinct flying [ (     ) ] species", "멸종된 날아다니는 공룡 종에 관한 그림 백과사전 단원을 열람"),
            ("visit the natural science museum to learn about giant [ (     ) ] beasts", "거대한 공룡에 대해 배우기 위해 자연과학 박물관을 관람"),
            ("assemble a miniature wooden puzzle model of a horned [ (     ) ]", "뿔 달린 공룡의 미니어처 나무 입체 퍼즐 모형을 조립")
        ]
    },
    {
        "word": "bicycle",
        "phonetic": "/ˈbaɪ.sə.kəl/",
        "meaning": "자전거",
        "wrong": ["bycycle", "bicyle", "bicycal"],
        "grammar": "bi(둘) + cycle(바퀴)의 결합으로 b-i-c-y-c-l-e 철자입니다.",
        "expl": "'자전거'는 bicycle입니다. 앞은 'i', 뒤는 'y' 철자 순서에 유의하세요.",
        "idioms": "ride a bicycle (자전거를 타다), bicycle helmet (자전거 헬멧)",
        "predicates": [
            ("ride my red two-wheeled [ (     ) ] along the scenic riverside park path", "경치 좋은 강변 공원 길을 따라 빨간 두 바퀴 자전거를 주행"),
            ("pump fresh air into the deflated rubber tires of my [ (     ) ]", "자전거의 바람 빠진 고무 타이어에 공기를 주입"),
            ("wear a protective safety helmet before riding the street [ (     ) ]", "도로에서 자전거를 타기 전에 보호용 안전 헬멧을 착용"),
            ("ring the shiny bell attached to the handlebars of the [ (     ) ]", "자전거 핸들에 부착된 반짝이는 벨을 작동")
        ]
    },
    {
        "word": "butterfly",
        "phonetic": "/ˈbʌt̬.ɚ.flaɪ/",
        "meaning": "나비",
        "wrong": ["butterfli", "buterfly", "butterfley"],
        "grammar": "butter + fly의 합성어로 't'가 두 개(b-u-t-t-e-r-f-l-y) 들어갑니다.",
        "expl": "'나비'는 butterfly입니다. 't'가 두 개(tt) 들어갑니다.",
        "idioms": "colorful butterfly (다채로운 나비), butterfly wings (나비 날개)",
        "predicates": [
            ("watch a yellow swallowtail [ (     ) ] flutter gently over garden blossoms", "노란 호랑나비가 정원 꽃들 위를 사뿐사뿐 팔랑거리는 모습을 관찰"),
            ("admire the shimmering blue pattern on the delicate [ (     ) ] wings", "섬세한 나비 날개에 수놓인 영롱한 푸른빛 무늬를 감상"),
            ("observe how a green caterpillar transforms into a graceful [ (     ) ]", "초록색 애벌레가 어떻게 우아한 나비로 탈바꿈하는지 관찰"),
            ("photograph a resting monarch [ (     ) ] on a fresh green leaf", "신선한 나뭇잎 위에서 쉬고 있는 제왕나비를 촬영")
        ]
    }
]

def build_level1_questions():
    questions = []
    start_id = 15001
    q_counter = 0

    for cycle in range(40):
        frame_idx = cycle // 4  # 0..9
        pred_idx = cycle % 4    # 0..3
        frame_en, frame_ko = FRAMES_LVL1[frame_idx]

        for item in RAW_WORDS_LVL1:
            q_id = start_id + q_counter
            q_num = q_counter + 1

            act_en, act_ko = item["predicates"][pred_idx]
            sentence = frame_en.format(act=act_en)
            translation = frame_ko.format(ko=act_ko)

            answer_idx = cycle % 4
            word = item["word"]
            wrong = item["wrong"]
            
            options = [""] * 4
            options[answer_idx] = word
            wrong_idx = 0
            for i in range(4):
                if i != answer_idx:
                    options[i] = wrong[wrong_idx]
                    wrong_idx += 1

            q_obj = {
                "id": q_id,
                "category": CATEGORY,
                "level": LEVEL_NAME,
                "question": f"다음 영어 문장의 빈칸에 들어갈 올바른 철자의 단어를 고르세요. (문항 #{q_num})",
                "sentence": sentence,
                "sentenceTranslation": translation,
                "options": options,
                "answerIndex": answer_idx,
                "englishWord": word,
                "phonetic": item["phonetic"],
                "meaning": item["meaning"],
                "keyIdioms": item["idioms"],
                "grammar": item["grammar"],
                "explanation": item["expl"],
                "exampleSentence": sentence,
                "dictLink": f"https://en.dict.naver.com/#/search?query={word}"
            }
            questions.append(q_obj)
            q_counter += 1

    assert len(questions) == 1000
    return questions

if __name__ == "__main__":
    qs = build_level1_questions()
    print(f"Level 1 generated {len(qs)} questions successfully.")
    print("Sample question 1:", json.dumps(qs[0], ensure_ascii=False, indent=2))
    print("Sample question 1000:", json.dumps(qs[-1], ensure_ascii=False, indent=2))
