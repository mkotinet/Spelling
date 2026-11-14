# -*- coding: utf-8 -*-
"""
Level 4 English Generator (수능/기출 - IDs 18001 ~ 19000)
25 Words x 40 Distinct Situational Scenarios = 1,000 Questions
Zero Generic Meta-Templates! 100% Contextual Deduction!
"""

import json

LEVEL_NAME = "수능/기출"
CATEGORY = "수능 핵심어휘"

# 10 CSAT / Critical Reading Frames
FRAMES_LVL4 = [
    ("Critical reading experts recommend students to {act}.", "비판적 독해 전문가들은 수험생들에게 {ko}하도록 권고합니다."),
    ("In standard entrance exam passages, authors frequently {act}.", "수능 기출 지문에서 필자들은 자주 {ko}합니다."),
    ("To comprehend abstract philosophical theories, one must {act}.", "추상적인 철학 이론을 깊이 이해하기 위해 {ko}해야 합니다."),
    ("Before determining the main theme of the paragraph, readers should {act}.", "단락의 핵심 주제를 도출하기 전에 독자들은 {ko}해야 합니다."),
    ("During textual analysis of historical debates, scholars often {act}.", "역사적 논쟁 텍스트를 분석하는 과정에서 학자들은 자주 {ko}합니다."),
    ("In order to evaluate competing scientific hypotheses, thinkers must {act}.", "경쟁하는 과학적 가설들을 객관적으로 평가하기 위해 {ko}해야 합니다."),
    ("At the national literary symposium, distinguished critics chose to {act}.", "전국 문학 심포지엄에서 저명한 비평가들은 {ko}하기로 합의했습니다."),
    ("When discerning subtle logical fallacies in persuasive texts, try to {act}.", "설득적 글에서 미묘한 논리적 오류를 식별할 때 {ko}하도록 노력하세요."),
    ("To excel in high-level reading comprehension, candidates need to {act}.", "고난도 독해 영역에서 고득점을 달성하기 위해 수험생들은 {ko}해야 합니다."),
    ("After comparing multiple primary historical documents, researchers agreed to {act}.", "여러 1차 역사 사료들을 상호 대조한 후 연구자들은 {ko}하기로 합의했습니다.")
]

# 25 Core CSAT Exam Words with 4 Distinct Predicates / Context Clues
RAW_WORDS_LVL4 = [
    {
        "word": "prerequisite",
        "phonetic": "/ˌpriːˈrek.wə.zɪt/",
        "meaning": "전제 조건, 필수 과목",
        "wrong": ["prerequisit", "prerequsite", "prereqisite"],
        "grammar": "pre + requisite 결합으로 pre-req-ui-site 철자에 주의합니다.",
        "expl": "'전제 조건'은 prerequisite입니다. 끝에 'e'가 붙으며 '-qui-' 모음에 유의하세요.",
        "idioms": "prerequisite course (선수 과목), essential prerequisite (필수 전제조건)",
        "predicates": [
            ("complete the advanced calculus course as a mandatory [ (     ) ] for quantum mechanics", "양자역학 수강을 위한 필수 전제 조건 과목으로 고급 미적분학을 이수"),
            ("recognize mutual diplomatic trust as a fundamental [ (     ) ] for lasting peace", "상호 외교적 신뢰가 항구적인 평화를 정착시키기 위한 근본적 전제 조건임을 확인"),
            ("verify whether candidates meet every academic [ (     ) ] before admitting them", "지원자를 최종 선발하기 전에 모든 학문적 필수 요건을 충족했는지 검증"),
            ("view critical reading mastery as an indispensable [ (     ) ] for college success", "비판적 독해력 숙달을 성공적인 대학 학업을 위한 필수 전제 조건으로 인식")
        ]
    },
    {
        "word": "hierarchy",
        "phonetic": "/ˈhaɪ.rɑːr.ki/",
        "meaning": "계층 구조, 위계질서",
        "wrong": ["heirarchy", "hierarcy", "hierachy"],
        "grammar": "h-i-e-r-a-r-c-h-y 철자이며, 'ie' 순서와 '-rch-'에 유의합니다.",
        "expl": "'위계질서'는 hierarchy입니다. 'ei'가 아닌 'ie'로 시작합니다.",
        "idioms": "social hierarchy (사회적 계층 구조), strict hierarchy (엄격한 위계질서)",
        "predicates": [
            ("dismantle the rigid corporate [ (     ) ] in favor of flat agile teamwork", "수평적이고 민첩한 팀워크를 위해 경직된 기업 위계질서를 혁파"),
            ("analyze the complex feudal social [ (     ) ] described in medieval chronicles", "중세 연대기에 기술된 복잡한 봉건 사회의 계층 구조를 분석"),
            ("study how primate chimpanzee troops organize their internal dominant [ (     ) ]", "영장류 침팬지 무리가 집단 내부의 지배적 위계질서를 어떻게 구성하는지 연구"),
            ("redesign the organizational management [ (     ) ] to foster open dialogue", "자유롭고 열린 소통을 촉진하기 위해 조직 내 관리 계층 구조를 재설계")
        ]
    },
    {
        "word": "reconnaissance",
        "phonetic": "/rɪˈkɑː.nə.səns/",
        "meaning": "정찰, 사전 탐색",
        "wrong": ["reconaisance", "reconnaissancee", "reconnaisance"],
        "grammar": "c가 한 개(c), n이 두 개(nn), s가 두 개(ss) 들어가는 고난도 어휘입니다.",
        "expl": "'정찰'은 reconnaissance입니다. c는 1개, n은 2개, s는 2개입니다.",
        "idioms": "aerial reconnaissance (항공 정찰), reconnaissance mission (정찰 임무)",
        "predicates": [
            ("deploy unmanned aerial drones for tactical environmental [ (     ) ] missions", "전술적 환경 정찰 임무를 수행하기 위해 무인 항공 드론을 투입"),
            ("conduct an exhaustive geological [ (     ) ] before beginning cave exploration", "동굴 탐사에 착수하기 전에 철저한 지질학적 사전 탐색을 실시"),
            ("send specialized scouting units on a covert border [ (     ) ] operation", "국경 지대 비밀 정찰 작전을 위해 특수 수색 정찰 부대를 파견"),
            ("analyze high-resolution satellite imagery gathered during arctic [ (     ) ]", "북극 사전 탐색 과정에서 수집된 고해상도 위성 영상 데이터를 분석")
        ]
    },
    {
        "word": "superstitious",
        "phonetic": "/ˌsuː.pɚˈstɪʃ.əs/",
        "meaning": "미신적인, 미신에 사로잡힌",
        "wrong": ["supersticious", "superstisious", "supersticiouss"],
        "grammar": "superstition의 형용사형으로 super-sti-tious(-tious)입니다.",
        "expl": "'미신적인'은 superstitious입니다. '-cious'가 아닌 '-tious'입니다.",
        "idioms": "superstitious belief (미신적 믿음), avoid superstitious rituals (미신적 의식을 피하다)",
        "predicates": [
            ("dismiss ancient fears regarding black cats as completely [ (     ) ] beliefs", "검은 고양이에 대한 고대의 공포를 완전히 비합리적이고 미신적인 미신으로 일축"),
            ("examine how [ (     ) ] rituals emerged historically to relieve social anxiety", "사회적 불안감을 덜기 위해 역사적으로 미신적인 의례들이 어떻게 형성되었는지 고찰"),
            ("challenge the [ (     ) ] taboo of Friday the thirteenth with scientific logic", "과학적 논리를 바탕으로 13일의 금요일이라는 미신적인 금기에 도전"),
            ("distinguish empirical medical facts from unfounded and [ (     ) ] folk remedies", "근거 없는 미신적 민간요법과 과학적으로 실증된 의학적 사실을 명확히 구분")
        ]
    },
    {
        "word": "quintessential",
        "phonetic": "/ˌkwɪn.təˈsen.ʃəl/",
        "meaning": "본질적인, 전형적인",
        "wrong": ["quintessental", "quintesential", "quintessentiall"],
        "grammar": "quintessence의 형용사형으로 quint-es-sen-tial(ss) 철자입니다.",
        "expl": "'전형적인'은 quintessential입니다. s가 2개(ss) 들어갑니다.",
        "idioms": "quintessential example (전형적인 본보기), quintessential character (전형적 인물)",
        "predicates": [
            ("praise the historic novel as the [ (     ) ] masterpiece of nineteenth-century realism", "그 역사소설을 19세기 사실주의 문학의 가장 전형적인 걸작으로 격찬"),
            ("identify afternoon black tea and scones as the [ (     ) ] British cultural tradition", "오후의 홍차와 스콘을 가장 본질적이고 전형적인 영국 문화 전통으로 규정"),
            ("showcase the entrepreneur's biography as the [ (     ) ] self-made success story", "그 기업가의 전기를 자수성가 신화의 가장 전형적인 성공 사례로 제시"),
            ("capture the [ (     ) ] rustic beauty of the Mediterranean coastal village", "지중해 연안 어촌 마을이 지닌 전형적이고 소박한 풍광을 포착")
        ]
    },
    {
        "word": "maneuver",
        "phonetic": "/məˈnuː.vɚ/",
        "meaning": "책략, 교묘히 다루다, 기동",
        "wrong": ["maneuverr", "maneuvre", "manuver"],
        "grammar": "미국식 철자는 m-a-n-e-u-v-e-r(eu)입니다.",
        "expl": "'기동, 책략'은 maneuver입니다. 'eu' 철자 배열에 유의하세요.",
        "idioms": "tactical maneuver (전술적 기동), political maneuver (정치적 책략)",
        "predicates": [
            ("execute a sophisticated defensive [ (     ) ] to safeguard sovereign airspace", "영공 안보를 수호하기 위해 정교한 방어적 공중 기동 작전을 전개"),
            ("uncover the subtle diplomatic [ (     ) ] deployed during bilateral trade talks", "양자 무역 협상 과정에서 동원된 미묘한 외교적 책략의 실체를 규명"),
            ("skillfully [ (     ) ] the autonomous submarine through tight underwater trenches", "자율 운항 잠수정을 조종하여 좁은 심해 해구 사이를 능숙하게 기동"),
            ("counter an unexpected market competitor by launching a brilliant marketing [ (     ) ]", "기습적인 시장 경쟁자에 맞서 기민하고 탁월한 마케팅 책략을 구사")
        ]
    },
    {
        "word": "supersede",
        "phonetic": "/ˌsuː.pɚˈsiːd/",
        "meaning": "대체하다, 대신하다",
        "wrong": ["supercede", "superceed", "supersid"],
        "grammar": "c가 아닌 s(super-sede)로 철자되는 매우 드문 어근 형태입니다.",
        "expl": "'대체하다'는 supersede입니다. 'cede'가 아닌 'sede' 철자임에 각별히 유의하세요.",
        "idioms": "supersede old laws (구법을 대체하다), superseded by technology (기술로 대체되다)",
        "predicates": [
            ("observe how high-speed fiber internet networks quickly [ (     ) ] copper cables", "초고속 광통신망이 기존의 구리 유선 케이블을 신속하게 대체하는 과정을 관찰"),
            ("enact new constitutional statutes that officially [ (     ) ] outdated regulations", "시대에 뒤떨어진 낡은 행정 규제를 공식적으로 대체하는 새로운 법령을 제정"),
            ("predict that renewable solar energy will gradually [ (     ) ] fossil fuel plants", "태양광 재생에너지가 화석연료 발전소를 점진적으로 대체할 것임을 전망"),
            ("upgrade internal databases so modern cloud systems [ (     ) ] legacy servers", "현대적인 클라우드 시스템이 기존 레거시 서버를 완전히 대체하도록 개편")
        ]
    },
    {
        "word": "heterogeneous",
        "phonetic": "/ˌhet̬.ɚ.oʊˈdʒiː.ni.əs/",
        "meaning": "이질적인, 여러 성분으로 이루어진",
        "wrong": ["heterogenous", "heterogenious", "heterogeneos"],
        "grammar": "hetero(다른) + gene + ous 결합으로 het-er-o-ge-ne-ous 철자입니다.",
        "expl": "'이질적인'은 heterogeneous입니다. 'gene' 뒤에 'ous'가 옵니다.",
        "idioms": "heterogeneous mixture (불균일 혼합물), heterogeneous society (다원적 이질 사회)",
        "predicates": [
            ("separate a visibly [ (     ) ] chemical mixture using centrifugal filtration", "원심 여과 기술을 활용하여 눈에 보이는 불균일 혼합물을 물리적으로 분리"),
            ("govern a culturally diverse and [ (     ) ] metropolitan population fairly", "문화적으로 지극히 다양하고 이질적인 대도시 주민들을 공정하게 통합 통치"),
            ("integrate data from highly [ (     ) ] computing architectures into one platform", "서로 매우 이질적인 컴퓨터 시스템 구조에서 생성된 데이터를 단일 플랫폼으로 통합"),
            ("analyze the [ (     ) ] geological composition of volcanic rock samples", "화산암 암석 시료를 구성하는 복합적이고 이질적인 광물 성분을 정밀 분석")
        ]
    },
    {
        "word": "idiosyncrasy",
        "phonetic": "/ˌɪd.i.əˈsɪŋ.krə.si/",
        "meaning": "특이성, 특유의 버릇",
        "wrong": ["idiosyncracy", "ideosyncrasy", "idiosyncresy"],
        "grammar": "끝 철자가 -cy가 아닌 -sy(idio-syn-cra-sy)인 고난도 철자입니다.",
        "expl": "'특이성'은 idiosyncrasy입니다. 끝이 '-cy'가 아닌 '-sy'임에 주의하세요.",
        "idioms": "personal idiosyncrasy (개인 특유의 버릇), cultural idiosyncrasy (문화적 특이성)",
        "predicates": [
            ("tolerate each author's stylistic [ (     ) ] when editing prose manuscripts", "산문 원고를 윤문할 때 각 작가 특유의 문체적 개성과 버릇을 존중"),
            ("recognize the unique linguistic [ (     ) ] inherent in regional dialects", "지역 방언 속에 고유하게 내재된 독특한 언어학적 특이성을 이해"),
            ("appreciate a genius musician whose eccentric personal [ (     ) ] shaped his art", "기이한 성격적 특이성이 독창적 예술 세계를 형성한 천재 음악가를 조명"),
            ("troubleshoot a rare hardware [ (     ) ] occurring only at subzero temperatures", "영하의 극한 기온에서만 간헐적으로 발생하는 드문 하드웨어 특이 결함을 해결")
        ]
    },
    {
        "word": "ephemeral",
        "phonetic": "/ɪˈfem.ɚ.əl/",
        "meaning": "덧없는, 수명이 짧은",
        "wrong": ["ephemral", "ephemoral", "ephimeral"],
        "grammar": "e-p-h-e-m-e-r-a-l 철자이며, ph와 eme 모음 배열에 유의합니다.",
        "expl": "'덧없는'은 ephemeral입니다. 'e-phe-me-ral' 모음 배열을 기억하세요.",
        "idioms": "ephemeral beauty (덧없는 아름다움), ephemeral trend (단명하는 유행)",
        "predicates": [
            ("capture the [ (     ) ] brilliance of cherry blossoms falling in spring gusts", "봄바람에 흩날리는 벚꽃의 덧없고 찬란한 찰나의 아름다움을 포착"),
            ("caution youth against chasing [ (     ) ] social media fame and online clicks", "소셜 미디어의 덧없고 일시적인 온라인 인기에 매몰되지 말 것을 경고"),
            ("document the [ (     ) ] lifespan of desert wildflowers blooming after rare rain", "희귀한 단비 직후 피어났다 사라지는 사막 야생화의 짧은 생애주기를 기록"),
            ("contrast lasting philosophical truths with the [ (     ) ] fads of consumerism", "소비 만능주의의 덧없는 유행과 시대를 초월하는 영원한 철학적 진리를 대조")
        ]
    },
    {
        "word": "aesthetic",
        "phonetic": "/esˈθet̬.ɪk/",
        "meaning": "미적인, 심미적인",
        "wrong": ["esthetic", "aestetic", "aesthetick"],
        "grammar": "ae로 시작하며 aes-thet-ic 철자입니다.",
        "expl": "'심미적인'은 aesthetic입니다. 'ae'로 시작하며 'th' 철자가 들어갑니다.",
        "idioms": "aesthetic value (심미적 가치), aesthetic sense (미적 감각)",
        "predicates": [
            ("evaluate the architectural design based on both functional utility and [ (     ) ] harmony", "기능적 실용성과 심미적 조화라는 두 기준에 입각하여 건축 설계를 평가"),
            ("cultivate refined [ (     ) ] appreciation through regular visits to art galleries", "미술관 정기 관람을 통해 고상하고 세련된 미적 감식안을 함양"),
            ("restore the historical theater while preserving its original Baroque [ (     ) ] appeal", "역사적인 극장의 원형 바로크 양식의 심미적 매력을 보존하며 복원"),
            ("critique the avant-garde film from a strictly formalist [ (     ) ] perspective", "전위적인 영화를 엄격한 형식주의 심미적 관점에서 비평")
        ]
    },
    {
        "word": "exacerbate",
        "phonetic": "/ɪɡˈzæs.ɚ.beɪt/",
        "meaning": "악화시키다, 가중시키다",
        "wrong": ["exasterbate", "exacerbaite", "exasorbate"],
        "grammar": "ex + acerbic(날카로운)에서 유래하여 ex-ac-er-bate 철자입니다.",
        "expl": "'악화시키다'는 exacerbate입니다. 'exac-' 뒤에 'erbate'입니다.",
        "idioms": "exacerbate the problem (문제를 악화시키다), exacerbate tension (긴장을 고조시키다)",
        "predicates": [
            ("warn that raising tariffs could severely [ (     ) ] existing trade disputes", "관세 인상이 기존의 무역 분쟁을 심각하게 악화시킬 수 있음을 강력히 경고"),
            ("avoid spreading unverified rumors that might [ (     ) ] neighborhood tensions", "주민 간의 불필요한 긴장을 가중시킬 수 있는 미확인 소문의 유포를 자제"),
            ("adopt proactive cooling strategies before urban heat waves [ (     ) ] smog levels", "도시 폭염이 유독 스모그 농도를 더욱 악화시키기 전에 선제적 냉각 조치를 취함"),
            ("treat respiratory conditions early before damp seasonal weather can [ (     ) ] them", "습한 계절 날씨가 호흡기 질환을 악화시키기 전에 조기 치료를 개시")
        ]
    },
    {
        "word": "discrepancy",
        "phonetic": "/dɪˈskrep.ən.si/",
        "meaning": "불일치, 괴리",
        "wrong": ["discrepency", "discrepansy", "discrepensy"],
        "grammar": "dis-crep-an-cy 철자이며, -ency가 아닌 -ancy입니다.",
        "expl": "'불일치'는 discrepancy입니다. 끝이 '-ency'가 아닌 '-ancy'임에 주의하세요.",
        "idioms": "unexplained discrepancy (설명되지 않는 불일치), huge discrepancy (현격한 괴리)",
        "predicates": [
            ("investigate the glaring [ (     ) ] between reported tax revenue and expenditures", "보고된 세수 수입과 실제 지출 내역 사이의 현격한 불일치를 철저히 조사"),
            ("reconcile the scientific [ (     ) ] between computer simulations and field tests", "컴퓨터 시뮬레이션 결과와 실제 현장 테스트 사이의 괴리를 정밀 보정"),
            ("resolve the accounting [ (     ) ] before closing the audited fiscal books", "회계 감사 장부를 마감하기 전에 발견된 장부상 불일치를 완벽히 해소"),
            ("explain the striking [ (     ) ] between pre-election polls and actual voting outcomes", "사전 여론조사 예측치와 실제 선거 개표 결과 사이의 극적인 괴리를 분석")
        ]
    },
    {
        "word": "condescending",
        "phonetic": "/ˌkɑːn.dəˈsen.dɪŋ/",
        "meaning": "거들먹거리는, 잘난 체하는",
        "wrong": ["condescenting", "condesending", "condiscending"],
        "grammar": "con + descend(내려가다) + ing로 con-de-scend-ing(sc)입니다.",
        "expl": "'거들먹거리는'은 condescending입니다. 'sc' 철자에 유의하세요.",
        "idioms": "condescending tone (잘난 체하는 어조), condescending attitude (오만한 태도)",
        "predicates": [
            ("refrain from speaking in a patronizing and [ (     ) ] tone to teammates", "동료 팀원들에게 가르치려 들거나 거들먹거리는 어조로 말하는 것을 엄격히 지양"),
            ("criticize the politician for his arrogant and [ (     ) ] remarks to journalists", "기자들을 향해 오만하고 잘난 체하는 발언을 쏟아낸 정치인을 비판"),
            ("advise tutors to maintain respectful empathy rather than a [ (     ) ] demeanor", "교사들이 거들먹거리는 태도를 버리고 존중과 공감의 자세를 유지하도록 당부"),
            ("reject peer feedback delivered in a deliberately dismissive and [ (     ) ] manner", "상대방을 의도적으로 무시하며 잘난 체하는 방식으로 전달된 피드백을 단호히 거부")
        ]
    },
    {
        "word": "belligerent",
        "phonetic": "/bəˈlɪdʒ.ɚ.ənt/",
        "meaning": "호전적인, 공격적인",
        "wrong": ["beligerent", "belligerant", "bellidgerent"],
        "grammar": "l이 두 개(ll) 들어가며, 접미사는 -ant가 아닌 -ent입니다.",
        "expl": "'호전적인'은 belligerent입니다. l이 2개(ll)이며 끝은 '-ent'입니다.",
        "idioms": "belligerent nation (교전국/호전적 국가), belligerent behavior (공격적 행동)",
        "predicates": [
            ("de-escalate the hostile confrontation before either nation adopts a [ (     ) ] posture", "양국이 호전적인 군사적 태세를 취하기 전에 적대적 대치를 완화"),
            ("restrain the aggressive sports fans whose [ (     ) ] conduct disrupted the game", "호전적인 난동 행위로 경기 진행을 방해한 과격 스포츠 팬들을 제지"),
            ("condemn the authoritarian regime for its relentlessly [ (     ) ] foreign rhetoric", "권위주의 정권이 쏟아내는 끊임없이 호전적인 대외 선전 선동을 규탄"),
            ("diffuse an argument peacefully before angry words turn openly [ (     ) ]", "격앙된 언쟁이 노골적으로 공격적이고 호전적인 충돌로 비화하기 전에 평화적으로 중재")
        ]
    },
    {
        "word": "juxtaposition",
        "phonetic": "/ˌdʒʌk.stə.pəˈzɪʃ.ən/",
        "meaning": "병치, 나란히 놓기",
        "wrong": ["juxtapozition", "juxtaposision", "juxtapositione"],
        "grammar": "juxta(가까이) + position(위치)의 결합으로 j-u-x-t-a-p-o-s-i-t-i-o-n입니다.",
        "expl": "'병치'는 juxtaposition입니다. 'x' 철자를 빠뜨리지 않도록 유의하세요.",
        "idioms": "striking juxtaposition (두드러진 병치), juxtaposition of opposites (대립물의 병치)",
        "predicates": [
            ("admire the striking [ (     ) ] of ancient ruins beside futuristic modern skyscrapers", "초현대식 고층 빌딩 곁에 나란히 늘어선 고대 유적의 경이로운 병치에 감탄"),
            ("analyze the poet's intentional [ (     ) ] of light and darkness imagery", "빛과 어둠의 이미지를 의도적으로 나란히 병치한 시인의 표현 기법을 분석"),
            ("observe the dramatic theatrical [ (     ) ] of wealth and poverty on stage", "무대 위에서 부와 빈곤이라는 상반된 삶의 조건을 극적으로 병치한 연출을 관찰"),
            ("critique the artist's bold [ (     ) ] of vibrant neon colors on matte canvas", "무광 캔버스 위에 강렬한 네온 색상을 과감하게 나란히 배치한 화가의 기법을 평가")
        ]
    },
    {
        "word": "meticulous",
        "phonetic": "/məˈtɪk.jə.ləs/",
        "meaning": "꼼꼼한, 세심한",
        "wrong": ["meticilous", "meticulus", "meticlous"],
        "grammar": "me-tic-u-lous 철자이며, -ulous 형태에 유의합니다.",
        "expl": "'세심한'은 meticulous입니다. 'tic-' 뒤에 'ulous'가 붙습니다.",
        "idioms": "meticulous research (꼼꼼한 연구), meticulous attention to detail (세심한 주의)",
        "predicates": [
            ("demonstrate [ (     ) ] attention to detail when compiling the bibliographic index", "도서 목록 색인을 편집할 때 한 치의 오차도 없는 꼼꼼하고 세심한 주의력을 발휘"),
            ("conduct a [ (     ) ] forensic examination of all physical laboratory evidence", "실험실에서 수집된 모든 물리적 증거물에 대해 철저하고 세심한 과학 수사를 실시"),
            ("maintain [ (     ) ] historical records of daily temperatures over fifty years", "50년에 걸쳐 매일의 기온 관측치를 꼼꼼하고 완벽하게 기록 보관"),
            ("draft the legislative proposal through [ (     ) ] legal research and drafting", "치밀하고 세심한 법률적 검토와 입안 과정을 거쳐 법안 제정안을 작성")
        ]
    },
    {
        "word": "substantiate",
        "phonetic": "/səbˈstæn.ʃi.eɪt/",
        "meaning": "입증하다, 실증하다",
        "wrong": ["substanciate", "substantate", "substantiat"],
        "grammar": "sub-stan-ti-ate 철자이며, -ciate가 아닌 -tiate입니다.",
        "expl": "'입증하다'는 substantiate입니다. 'c'가 아닌 't'(tiate)에 주의하세요.",
        "idioms": "substantiate claims (주장을 입증하다), substantiate hypothesis (가설을 실증하다)",
        "predicates": [
            ("provide empirical experimental data to [ (     ) ] the revolutionary astrophysics claim", "혁신적인 천체물리학 주장을 실증적으로 뒷받침하기 위해 실험 데이터를 제시"),
            ("gather credible eyewitness testimonies to legally [ (     ) ] the allegations", "제기된 의혹들을 법적으로 명백히 입증하기 위해 신빙성 있는 목격자 증언을 확보"),
            ("conduct repeatable laboratory trials to scientifically [ (     ) ] the theoretical model", "이론적 모델을 과학적으로 엄밀히 입증하기 위해 재현 가능한 실험을 수행"),
            ("cite reliable historical archives to rigorously [ (     ) ] the revisionist thesis", "수정주의 역사 이론을 학술적으로 입증하기 위해 신뢰성 높은 고문서 사료를 인용")
        ]
    },
    {
        "word": "fastidious",
        "phonetic": "/fæsˈtɪd.i.əs/",
        "meaning": "세심한, 까다로운",
        "wrong": ["fastidous", "fastiduous", "fastidiouss"],
        "grammar": "fas-tid-i-ous 철자이며, -uous가 아닌 -ious입니다.",
        "expl": "'까다로운, 세심한'은 fastidious입니다. '-uous'가 아닌 '-ious' 형태입니다.",
        "idioms": "fastidious about cleanliness (위생에 까다로운), fastidious scholar (세심한 학자)",
        "predicates": [
            ("maintain [ (     ) ] cleanliness standards throughout the pharmaceutical cleanroom", "의약품 제조 무균실 전역에서 타협 없는 엄격하고 세심한 청결 기준을 유지"),
            ("work with a [ (     ) ] museum curator who verifies every historical artifact", "모든 역사적 유물을 철저하고 까다롭게 검증하는 큐레이터와 협력"),
            ("exhibit [ (     ) ] craftsmanship when carving wooden violin fingerboards", "바이올린 지판을 수작업으로 깎아낼 때 극도로 섬세하고 까다로운 장인정신을 발휘"),
            ("insist on [ (     ) ] grammatical precision in every published translation", "출간되는 모든 번역본에서 타협 없는 완벽하고 세심한 문법적 정확성을 고수")
        ]
    },
    {
        "word": "acquiesce",
        "phonetic": "/ˌæk.wiˈes/",
        "meaning": "묵인하다, 마지못해 따르다",
        "wrong": ["aquiesce", "acquiesse", "acquieasce"],
        "grammar": "ac-qui-es-ce 철자이며, c와 q, 그리고 sc(묵음) 철자에 주의합니다.",
        "expl": "'묵인하다'는 acquiesce입니다. 'qui' 뒤에 'esce'가 결합합니다.",
        "idioms": "acquiesce to demands (요구에 마지못해 따르다), refuse to acquiesce (묵인하기를 거부하다)",
        "predicates": [
            ("refuse to silently [ (     ) ] in unjust corporate policies that exploit workers", "노동자를 착취하는 부당한 회사 방침에 침묵하며 마지못해 따르기를 거부"),
            ("reluctantly [ (     ) ] to the strict zoning rules established by the town council", "마을 의회가 제정한 엄격한 토지 용도 규제에 마지못해 순응하여 동의"),
            ("refuse to [ (     ) ] to diplomatic bullying that threatens regional independence", "지역의 자주권을 위협하는 외교적 강압에 결코 굴복하거나 묵인하지 않음"),
            ("compromise on minor details by deciding to [ (     ) ] to the majority consensus", "다수결의 합의에 마지못해 따르기로 결단함으로써 사소한 쟁점에서 타협")
        ]
    },
    {
        "word": "circumspect",
        "phonetic": "/ˈsɝː.kəm.spekt/",
        "meaning": "신중한, 용의주도한",
        "wrong": ["circumspekt", "circumspict", "circumspeck"],
        "grammar": "circum(주변) + spect(보다) 결합으로 cir-cum-spect입니다.",
        "expl": "'신중한'은 circumspect입니다. 'speck'이 아닌 'spect'로 철자됩니다.",
        "idioms": "circumspect behavior (신중한 행동), circumspect approach (용의주도한 접근)",
        "predicates": [
            ("remain exceptionally [ (     ) ] when releasing unverified scientific conclusions", "아직 최종 검증되지 않은 과학적 결론을 대외에 발표할 때 극도로 신중한 자세를 유지"),
            ("adopt a [ (     ) ] strategy before expanding retail operations into volatile overseas markets", "변동성이 큰 해외 시장에 유통망을 확장하기 전에 매우 용의주도한 전략을 수립"),
            ("offer [ (     ) ] legal counsel to avoid unintentional contractual liability", "예기치 않은 계약상의 법적 책임을 사전에 차단하기 위해 신중하고 세심한 법률 조언을 제공"),
            ("weigh every policy consequence with a [ (     ) ] and contemplative mindset", "모든 정책적 파급효과를 신중하고 깊이 사색하는 자세로 면밀히 형량")
        ]
    },
    {
        "word": "serendipity",
        "phonetic": "/ˌser.ənˈdɪp.ə.t̬i/",
        "meaning": "뜻밖의 행운, 우연한 발견",
        "wrong": ["serendipaty", "serendeepity", "serendippity"],
        "grammar": "ser-en-dip-i-ty 철자이며, p는 한 개(p)이고 dip 뒤는 'i'입니다.",
        "expl": "'우연한 발견, 뜻밖의 행운'은 serendipity입니다. 'dipity' 철자에 유의하세요.",
        "idioms": "pure serendipity (순전한 뜻밖의 행운), discover by serendipity (우연히 발견하다)",
        "predicates": [
            ("discover the miraculous antibacterial power of penicillin through pure [ (     ) ]", "순전한 뜻밖의 행운과 우연한 발견을 통해 페니실린의 놀라운 항균력을 발견"),
            ("stumble upon rare historical manuscripts in an antique attic through lucky [ (     ) ]", "골동품 다락방에서 뜻밖의 행운을 통해 희귀한 역사적 필사본을 우연히 발견"),
            ("credit scientific innovation to a fortunate blend of methodical labor and sudden [ (     ) ]", "과학적 혁신을 체계적인 노력과 뜻밖의 우연한 행운이 결합된 결실로 평가"),
            ("experience romantic [ (     ) ] by reuniting with a childhood acquaintance across the world", "지구 반대편에서 어린 시절 지인을 우연히 재회하는 운명 같은 뜻밖의 행운을 경험")
        ]
    },
    {
        "word": "obfuscate",
        "phonetic": "/ˈɑːb.fə.skeɪt/",
        "meaning": "애매모호하게 만들다, 흐리다",
        "wrong": ["obfiscate", "obfusceat", "obfuskate"],
        "grammar": "ob-fus-cate 철자이며, -cate 형태에 유의합니다.",
        "expl": "'애매모호하게 만들다'는 obfuscate입니다. 'fus-' 모음 u에 유의하세요.",
        "idioms": "obfuscate the truth (진실을 은폐하고 흐리다), obfuscate meaning (의미를 모호하게 하다)",
        "predicates": [
            ("criticize corrupt executives who deliberately use dense jargon to [ (     ) ] financial fraud", "금융 사기를 은폐하고 흐리기 위해 난해한 전문용어를 악용하는 경영진을 비판"),
            ("refrain from using convoluted grammatical syntax that merely serves to [ (     ) ] the thesis", "논문의 핵심 주제를 오히려 애매모호하게 만들 뿐인 복잡한 문장 구사를 지양"),
            ("clarify ambiguous political speeches designed to [ (     ) ] underlying policy failures", "근본적인 정책 실패를 덮고 가리기 위해 모호하게 꾸며진 정치 연설의 본질을 규명"),
            ("prevent disinformation campaigns from managing to [ (     ) ] scientific climate reality", "과학적 기후 현실을 왜곡하고 흐리려는 허위 정보 유포 시도를 차단")
        ]
    },
    {
        "word": "egregious",
        "phonetic": "/ɪˈɡriː.dʒəs/",
        "meaning": "지독한, 터무니없는",
        "wrong": ["egregous", "egredgious", "egregiouss"],
        "grammar": "e-gre-gi-ous 철자이며, -gious 모음 배열에 유의합니다.",
        "expl": "'터무니없는, 지독한'은 egregious입니다. 'd'가 들어가지 않습니다.",
        "idioms": "egregious error (터무니없는 오류), egregious violation (지독한 위반)",
        "predicates": [
            ("retract the published research paper due to an [ (     ) ] mathematical calculation error", "터무니없고 지독한 수학적 계산 오류로 인해 기 발표된 연구 논문을 전격 철회"),
            ("condemn the company for its [ (     ) ] violation of international environmental safety accords", "국제 환경 안전 협약을 지독하게 위반한 다국적 기업의 행태를 강력 규탄"),
            ("impose severe professional penalties on attorneys guilty of [ (     ) ] ethical malpractice", "지독한 윤리적 직무 유기를 저지른 변호사에게 엄중한 법적 징계를 부과"),
            ("correct an [ (     ) ] typographical blunder printed on the front page of the gazette", "관보 1면 헤드라인에 인쇄된 터무니없는 오탈자 실수를 신속히 정정")
        ]
    },
    {
        "word": "insurmountable",
        "phonetic": "/ˌɪn.sɚˈmaʊn.t̬ə.bəl/",
        "meaning": "극복할 수 없는, 넘을 수 없는",
        "wrong": ["insurmountible", "insurmountabel", "insurrmountable"],
        "grammar": "in + surmount(극복하다) + able 결합으로 in-sur-moun-ta-ble입니다.",
        "expl": "'극복할 수 없는'은 insurmountable입니다. '-ible'이 아닌 '-able'입니다.",
        "idioms": "insurmountable obstacle (극복할 수 없는 장애), insurmountable odds (도저히 이길 수 없는 역경)",
        "predicates": [
            ("persevere through financial hardships that initially seemed completely [ (     ) ]", "처음에는 도저히 극복할 수 없을 것처럼 보였던 재정적 고난을 인내로 극복"),
            ("inspire mountaineering teams to scale icy peaks once deemed [ (     ) ] barriers", "한때 넘을 수 없는 장벽으로 여겨졌던 빙벽 정상을 정복하도록 등반대를 독려"),
            ("refuse to view systemic educational inequality as an [ (     ) ] societal challenge", "구조적인 교육 불평등 문제를 도저히 해결할 수 없는 불가항력의 과제로 치부하기를 거부"),
            ("triumph over seemingly [ (     ) ] competitive odds through disciplined team synergy", "규율 있는 팀 시너지를 발휘하여 도저히 이길 수 없을 것 같던 압도적 역경을 딛고 승리")
        ]
    }
]

def build_level4_questions():
    questions = []
    start_id = 18001
    q_counter = 0

    for cycle in range(40):
        frame_idx = cycle // 4  # 0..9
        pred_idx = cycle % 4    # 0..3
        frame_en, frame_ko = FRAMES_LVL4[frame_idx]

        for item in RAW_WORDS_LVL4:
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
    qs = build_level4_questions()
    print(f"Level 4 generated {len(qs)} questions successfully.")
    print("Sample question 1:", json.dumps(qs[0], ensure_ascii=False, indent=2))
    print("Sample question 1000:", json.dumps(qs[-1], ensure_ascii=False, indent=2))
