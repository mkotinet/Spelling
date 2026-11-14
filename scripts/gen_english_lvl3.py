# -*- coding: utf-8 -*-
"""
Level 3 English Generator (고등/심화 - IDs 17001 ~ 18000)
25 Words x 40 Distinct Situational Scenarios = 1,000 Questions
Zero Generic Meta-Templates! 100% Contextual Deduction!
"""

import json

LEVEL_NAME = "고등/심화"
CATEGORY = "고급 어휘"

# 10 High School Academic / Analytical Frames
FRAMES_LVL3 = [
    ("Scholars and researchers often strive to {act}.", "학자들과 연구자들은 자주 {ko}하고자 노력합니다."),
    ("In rigorous academic analysis, it is essential to {act}.", "엄밀한 학술 분석에서 {ko}하는 것은 필수적입니다."),
    ("The science committee recommended students to {act}.", "과학 위원회는 학생들에게 {ko}하도록 권고했습니다."),
    ("Before publishing the final thesis, one must {act}.", "최종 논문을 발표하기 전에 {ko}해야 합니다."),
    ("During advanced seminar discussions, participants learn to {act}.", "고급 세미나 토론 동안 참가자들은 {ko}하는 것을 배웁니다."),
    ("In order to address modern societal challenges, thinkers should {act}.", "현대 사회적 과제를 해결하기 위해 사상가들은 {ko}해야 합니다."),
    ("At the interschool debate forum, the panel voted to {act}.", "학교 간 토론 포럼에서 패널들은 {ko}하기로 합의했습니다."),
    ("When conducting cross-disciplinary studies, it is critical to {act}.", "학제 간 연구를 수행할 때 {ko}하는 것은 결정적입니다."),
    ("To deepen intellectual comprehension, educators urge us to {act}.", "지적 이해를 심화하기 위해 교육자들은 우리에게 {ko}하도록 촉구합니다."),
    ("After reviewing extensive empirical data, the committee agreed to {act}.", "광범위한 실증 데이터를 검토한 후, 위원회는 {ko}하기로 합의했습니다.")
]

# 25 Core High School Advanced Words with 4 Distinct Predicates / Context Clues
RAW_WORDS_LVL3 = [
    {
        "word": "conspicuous",
        "phonetic": "/kənˈspɪk.ju.əs/",
        "meaning": "눈에 띄는, 뚜렷한",
        "wrong": ["conspicious", "conspicous", "conspiquous"],
        "grammar": "con-spic-u-ous 철자이며, 끝 음절이 -uous입니다.",
        "expl": "'눈에 띄는'은 conspicuous입니다. '-ious'가 아닌 '-uous' 형태에 유의하세요.",
        "idioms": "conspicuous consumption (과시적 소비), conspicuous difference (눈에 띄는 차이)",
        "predicates": [
            ("identify the remarkably [ (     ) ] flaws in the published statistical report", "발표된 통계 보고서에서 매우 눈에 띄는 오류들을 식별"),
            ("wear bright reflective neon vests to remain safely [ (     ) ] on dark roads", "어두운 도로에서 안전하게 눈에 띄도록 밝은 반사 네온 조끼를 착용"),
            ("analyze the [ (     ) ] shift in consumer preferences toward electric vehicles", "전기차를 향한 소비자 선호도의 뚜렷한 변화를 분석"),
            ("point out the most [ (     ) ] landmark visible from the harbor entrance", "항구 입구에서 가장 눈에 띄는 랜드마크 지형지물을 지목")
        ]
    },
    {
        "word": "subtle",
        "phonetic": "/ˈsʌt̬.əl/",
        "meaning": "미묘한, 감지하기 힘든",
        "wrong": ["subtile", "suttle", "subtlely"],
        "grammar": "s-u-b-t-l-e 철자이며, b가 묵음으로 발음되지 않습니다.",
        "expl": "'미묘한'은 subtle입니다. 묵음 'b'를 빠뜨리지 않도록 유의하세요.",
        "idioms": "subtle difference (미묘한 차이), subtle nuance (미묘한 뉘앙스)",
        "predicates": [
            ("distinguish the [ (     ) ] nuances of meaning between closely related synonyms", "밀접한 유의어들 사이에 존재하는 미묘한 뉘앙스 차이를 식별"),
            ("detect the [ (     ) ] chemical variations in the water filtration experiment", "정수 여과 실험에서 발생하는 미묘한 화학적 변화를 감지"),
            ("appreciate the [ (     ) ] harmonic shifts in the modern symphony movement", "현대 교향곡 악장에 나타나는 미묘한 화성적 전조를 감상"),
            ("observe the [ (     ) ] facial expressions that reveal true inner emotions", "내면의 진정한 감정을 드러내는 미묘한 얼굴 표정을 관찰")
        ]
    },
    {
        "word": "phenomenon",
        "phonetic": "/fəˈnɑː.mə.nɑːn/",
        "meaning": "현상, 경이로운 일",
        "wrong": ["phenominon", "phenomenan", "phenominan"],
        "grammar": "그리스어 기원 명사로 phe-nom-e-non(모음 e) 철자이며, 복수형은 phenomena입니다.",
        "expl": "'현상'의 단수형은 phenomenon입니다. 'i'가 아닌 'e' 철자에 유의하세요.",
        "idioms": "natural phenomenon (자연현상), social phenomenon (사회현상)",
        "predicates": [
            ("investigate the atmospheric [ (     ) ] known as the Northern Lights", "오로라로 알려진 신비로운 대기 현상을 정밀 조사"),
            ("explain the psychological [ (     ) ] of cognitive dissonance in social behavior", "사회적 행동에서 나타나는 인지 부조화 심리 현상을 규명"),
            ("document the rare astronomical [ (     ) ] of a total solar eclipse", "개기일식이라는 드문 천문학적 현상을 기록"),
            ("analyze the global cultural [ (     ) ] driven by online streaming platforms", "온라인 스트리밍 플랫폼이 촉발한 세계적인 문화 현상을 분석")
        ]
    },
    {
        "word": "indispensable",
        "phonetic": "/ˌɪn.dɪˈspen.sə.bəl/",
        "meaning": "없어서는 안 될, 필수적인",
        "wrong": ["indispensible", "indispenceable", "indespensable"],
        "grammar": "접미사는 -ible이 아닌 -able(in-dis-pen-sa-ble)입니다.",
        "expl": "'없어서는 안 될'은 indispensable입니다. '-ible'이 아닌 '-able'에 주의하세요.",
        "idioms": "indispensable tool (필수 불가결한 도구), indispensable role (필수적인 역할)",
        "predicates": [
            ("recognize clean water as an [ (     ) ] resource for human civilization", "깨끗한 식수가 인류 문명에 없어서는 안 될 필수 자원임을 인식"),
            ("master digital literacy as an [ (     ) ] skill for future careers", "미래 직업을 위해 디지털 문해력을 필수적인 핵심 역량으로 체득"),
            ("acknowledge the team captain as an [ (     ) ] leader on the soccer field", "팀 주장이 축구 경기장에서 없어서는 안 될 중추적 리더임을 인정"),
            ("utilize microscopes as an [ (     ) ] instrument in cellular biology", "세포 생물학에서 현미경을 절대적으로 필수 불가결한 기구로 활용")
        ]
    },
    {
        "word": "catastrophe",
        "phonetic": "/kəˈtæs.trə.fi/",
        "meaning": "재앙, 파국",
        "wrong": ["catastrofy", "catastrophy", "catestrophe"],
        "grammar": "그리스어 기원으로 c-a-t-a-s-t-r-o-p-h-e 철자이며, 끝은 -fy가 아닌 -phe입니다.",
        "expl": "'재앙'은 catastrophe입니다. 끝 철자가 '-phe'임을 기억하세요.",
        "idioms": "avert a catastrophe (재앙을 피하다), ecological catastrophe (생태학적 재앙)",
        "predicates": [
            ("implement early warning systems to prevent a major humanitarian [ (     ) ]", "중대한 인도주의적 재앙을 미연에 방지하기 위해 조기 경보 체계를 구축"),
            ("study the geological aftermath of the prehistoric volcanic [ (     ) ]", "선사시대 화산 폭발 대재앙의 지질학적 여파를 연구"),
            ("coordinate international emergency relief to avert a famine [ (     ) ]", "기근 대재앙을 피하기 위해 국제 긴급 구호 활동을 조율"),
            ("analyze historical blunders that triggered the financial [ (     ) ] of 1929", "1929년 대공황 금융 파국을 촉발한 역사적 실책들을 분석")
        ]
    },
    {
        "word": "anonymous",
        "phonetic": "/əˈnɑː.nə.məs/",
        "meaning": "익명의",
        "wrong": ["annonymous", "anonomous", "anonymus"],
        "grammar": "a-n-o-n-y-m-o-u-s 철자이며, n이 하나(n)이고 y가 들어갑니다.",
        "expl": "'익명의'는 anonymous입니다. n이 1개이며, 가운데가 'y'입니다.",
        "idioms": "remain anonymous (익명을 유지하다), anonymous donor (익명의 기부자)",
        "predicates": [
            ("express deep gratitude to the generous and [ (     ) ] scholarship donor", "관대하고 익명의 장학금 기부자에게 깊은 감사를 표명"),
            ("conduct an [ (     ) ] student survey regarding campus cafeteria improvements", "학교 식당 개선과 관련하여 학생 대상 익명 설문조사를 실시"),
            ("protect the identity of the investigative journalist under an [ (     ) ] byline", "익명의 필명 하에 탐사보도 전문 기자의 신원을 철저히 보호"),
            ("allow citizens to submit whistleblowing tips through an [ (     ) ] hotline", "시민들이 익명의 핫라인을 통해 공익 제보를 접수할 수 있도록 보장")
        ]
    },
    {
        "word": "simultaneously",
        "phonetic": "/ˌsaɪ.məlˈteɪ.ni.əs.li/",
        "meaning": "동시에, 일제히",
        "wrong": ["simultaniously", "simultaneousley", "simultaniosly"],
        "grammar": "simultaneous + ly 형태로 si-mul-ta-ne-ous-ly 철자에 주의합니다.",
        "expl": "'동시에'는 simultaneously입니다. '-aneous-' 철자 배열을 확인하세요.",
        "idioms": "occur simultaneously (동시에 발생하다), broadcast simultaneously (동시 방송되다)",
        "predicates": [
            ("broadcast the international space launch [ (     ) ] to millions of viewers", "국제 우주선 발사 장면을 수백만 시청자에게 동시에 생중계"),
            ("coordinate multiple scientific experiments to run [ (     ) ] in the facility", "연구 시설 내에서 여러 과학 실험이 동시에 병행 진행되도록 조율"),
            ("process voice recognition and live language translation [ (     ) ] with AI", "인공지능을 활용하여 음성 인식과 실시간 통역을 동시에 처리"),
            ("fire all thruster engines [ (     ) ] to stabilize the orbiting satellite", "궤도 위성을 안정시키기 위해 모든 추진체 엔진을 일제히 점화")
        ]
    },
    {
        "word": "ubiquitous",
        "phonetic": "/juːˈbɪk.wə.t̬əs/",
        "meaning": "어디에나 있는, 도처에 존재하는",
        "wrong": ["ubiquitious", "ubiqutous", "ubiquitus"],
        "grammar": "u-b-i-q-u-i-t-o-u-s 철자이며, -itous가 아닌 -itous 형태입니다.",
        "expl": "'어디에나 있는'은 ubiquitous입니다. 'qui' 뒤에 'tous'가 붙습니다.",
        "idioms": "ubiquitous computing (유비쿼터스 컴퓨팅), ubiquitous presence (도처에 편재함)",
        "predicates": [
            ("observe how smartphones have become truly [ (     ) ] in modern society", "스마트폰이 현대 사회에서 진정 어디에나 존재하는 기기가 되었음을 관찰"),
            ("analyze the societal impact of [ (     ) ] wireless internet connectivity", "도처에 존재하는 무선 인터넷 연결망의 사회적 파급력을 분석"),
            ("study the adaptation strategies of [ (     ) ] bacterial microorganisms", "자연계 어디에나 널리 분포하는 세균 미생물의 적응 전략을 연구"),
            ("document the [ (     ) ] influence of pop culture across global youth", "전 세계 청소년 문화 속에 어디에나 존재하는 대중문화의 영향력을 기록")
        ]
    },
    {
        "word": "vulnerable",
        "phonetic": "/ˈvʌl.nɚ.ə.bəl/",
        "meaning": "취약한, 상처받기 쉬운",
        "wrong": ["vulnerble", "volnerable", "vulnerible"],
        "grammar": "vul-ner-a-ble 철자이며, '-able' 접미사 형태에 유의합니다.",
        "expl": "'취약한'은 vulnerable입니다. 'vol-'이 아닌 'vul-'로 시작합니다.",
        "idioms": "vulnerable population (취약 계층), vulnerable to attack (공격에 취약한)",
        "predicates": [
            ("provide social safety nets to protect [ (     ) ] elderly populations", "사회적 취약 계층 어르신들을 보호하기 위해 사회 안전망을 확충"),
            ("fortify digital firewalls because legacy computer networks remain [ (     ) ]", "구형 컴퓨터 네트워크가 해킹에 취약하므로 방화벽을 대폭 보강"),
            ("shelter endangered wildlife species that are highly [ (     ) ] to habitat loss", "서식지 파괴에 극도로 취약한 멸종 위기 야생동물을 보호"),
            ("acknowledge personal doubts openly without feeling excessively [ (     ) ]", "스스로 지나치게 취약하다고 느끼지 않으면서 개인적 고민을 솔직히 공유")
        ]
    },
    {
        "word": "legitimate",
        "phonetic": "/ləˈdʒɪt̬.ə.mət/",
        "meaning": "정당한, 합법적인",
        "wrong": ["legitamate", "legitemate", "legitimat"],
        "grammar": "le-git-i-mate 철자이며, 두 번째 모음은 'a'가 아닌 'i'입니다.",
        "expl": "'합법적인, 정당한'은 legitimate입니다. 'legit-' 뒤에 'imate'입니다.",
        "idioms": "legitimate concern (정당한 우려), legitimate authority (합법적 권한)",
        "predicates": [
            ("address the [ (     ) ] grievances raised by peaceful student protesters", "평화적 시위에 나선 학생들이 제기한 정당한 고충 사항들을 진지하게 검토"),
            ("verify that all business transactions adhere to [ (     ) ] legal procedures", "모든 상거래가 합법적이고 투명한 법률 절차를 준수하고 있음을 검증"),
            ("recognize climate change anxiety as a completely [ (     ) ] emotional response", "기후 변화에 대한 불안감을 지극히 정당한 감정적 반응으로 인정"),
            ("elect university student representatives through free and [ (     ) ] voting", "자유롭고 합법적인 투표 절차를 통해 대학 학생회 대표를 선출")
        ]
    },
    {
        "word": "deteriorate",
        "phonetic": "/dɪˈtɪr.i.ə.reɪt/",
        "meaning": "악화되다, 저하시키다",
        "wrong": ["detereorate", "deterorate", "deteriate"],
        "grammar": "de-te-ri-o-rate 철자이며, -rio- 모음 배열에 유의합니다.",
        "expl": "'악화되다'는 deteriorate입니다. 'deterio-' 모음 순서에 주의하세요.",
        "idioms": "deteriorate rapidly (급속히 악화되다), health deteriorates (건강이 악화되다)",
        "predicates": [
            ("intervene before diplomatic relations begin to [ (     ) ] into military conflict", "외교 관계가 군사적 갈등으로 악화되기 전에 외교적 중재를 개입"),
            ("repair aging concrete bridges before structural integrity starts to [ (     ) ]", "구조적 안전성이 심각하게 저하되기 전에 노후 콘크리트 교량을 보수"),
            ("prevent patient lung health from starting to [ (     ) ] due to air pollution", "대기오염으로 인해 환자의 폐 건강이 악화되는 것을 미연에 방지"),
            ("store ancient parchment scrolls in sealed vaults so they do not [ (     ) ]", "고대 양피지 두루마리가 손상되어 악화되지 않도록 밀폐 수장고에 보관")
        ]
    },
    {
        "word": "ambiguous",
        "phonetic": "/æmˈbɪɡ.ju.əs/",
        "meaning": "모호한, 다의적인",
        "wrong": ["ambigous", "ambigueous", "ambigiuos"],
        "grammar": "am-big-u-ous 철자이며, -uous 형태에 주의합니다.",
        "expl": "'모호한'은 ambiguous입니다. 'u'를 빠뜨리지 않도록 유의하세요.",
        "idioms": "ambiguous statement (모호한 진술), ambiguous meaning (모호한 의미)",
        "predicates": [
            ("clarify contract clauses to eliminate [ (     ) ] language in the draft", "초안의 모호한 법률 문구를 제거하기 위해 계약서 조항을 명확히 수정"),
            ("avoid using [ (     ) ] terms that could lead to widespread public confusion", "광범위한 대중적 혼란을 야기할 수 있는 모호한 표현의 사용을 지양"),
            ("interpret the [ (     ) ] moral dilemma presented in the classic tragedy", "고전 비극 문학에 제시된 다의적이고 모호한 도덕적 딜레마를 해석"),
            ("rephrase research survey questions that might appear confusingly [ (     ) ]", "응답자에게 혼란스럽고 모호하게 느껴질 수 있는 설문 문항을 재구성")
        ]
    },
    {
        "word": "preliminary",
        "phonetic": "/prɪˈlɪm.ə.ner.i/",
        "meaning": "예비의, 준비의",
        "wrong": ["prelimanary", "prelimenery", "prelimnary"],
        "grammar": "pre-lim-i-nar-y 철자이며, 가운데 'i'와 끝의 '-ary'에 주의합니다.",
        "expl": "'예비의'는 preliminary입니다. 'limi-'와 '-ary' 철자에 유의하세요.",
        "idioms": "preliminary round (예선전), preliminary findings (예비 조사 결과)",
        "predicates": [
            ("publish the [ (     ) ] findings of the clinical vaccine trial promptly", "백신 임상시험의 예비 조사 결과를 대중에게 신속하게 공표"),
            ("advance through the intense [ (     ) ] rounds of the national debate contest", "전국 학생 토론 대회의 치열한 예선 라운드를 우수한 성적으로 통과"),
            ("conduct a [ (     ) ] environmental impact assessment before construction", "착공에 앞서 기초적인 예비 환경영향평가를 철저히 실시"),
            ("submit a [ (     ) ] draft proposal before the final academic deadline", "최종 학업 마감일에 앞서 연구 계획의 예비 초안을 제출")
        ]
    },
    {
        "word": "inevitable",
        "phonetic": "/ˌɪnˈev.ə.t̬ə.bəl/",
        "meaning": "불가피한, 필연적인",
        "wrong": ["inevetable", "inevitablee", "inevidable"],
        "grammar": "in-ev-i-ta-ble 철자이며, ev-i(모음 i)에 유의합니다.",
        "expl": "'불가피한'은 inevitable입니다. 가운데가 'e'가 아닌 'i'입니다.",
        "idioms": "inevitable consequence (필연적 결과), accept the inevitable (불가피한 일을 수용하다)",
        "predicates": [
            ("accept technological automation as an [ (     ) ] trend in modern industry", "기술 자동화 현상을 현대 산업의 불가피하고 필연적인 추세로 수용"),
            ("prepare contingency measures for the [ (     ) ] economic fluctuations ahead", "앞으로 닥쳐올 불가피한 경제 변동에 대비하여 비상 대응책을 마련"),
            ("learn from failures as an [ (     ) ] part of the lifelong learning process", "실패를 평생의 학습 과정에서 나타나는 필연적인 과정으로 인식하고 성찰"),
            ("recognize climate migration as an [ (     ) ] challenge of the twenty-first century", "기후 난민 문제를 21세기가 마주한 불가피한 과제로 규정")
        ]
    },
    {
        "word": "versatile",
        "phonetic": "/ˈvɝː.sə.t̬əl/",
        "meaning": "다재다능한, 다용도의",
        "wrong": ["versatle", "versitile", "versatyle"],
        "grammar": "ver-sa-tile 철자이며, ver 뒤에 sa(모음 a)가 들어갑니다.",
        "expl": "'다재다능한'은 versatile입니다. 'si'가 아닌 'sa' 철자에 유의하세요.",
        "idioms": "versatile actor (다재다능한 배우), versatile tool (다용도 도구)",
        "predicates": [
            ("praise the young actor as a remarkably [ (     ) ] performer in theatre", "그 젊은 배우를 연극계에서 대단히 다재다능한 연기자로 높이 평가"),
            ("engineer a lightweight carbon material that serves [ (     ) ] industrial functions", "다양한 다용도 산업 기능을 수행하는 초경량 탄소 소재를 개발"),
            ("cultivate [ (     ) ] academic problem-solving skills across STEM disciplines", "융합 과학 분야 전반에 걸쳐 다방면에 응용 가능한 문제 해결력을 함양"),
            ("utilize coconut oil as a remarkably [ (     ) ] culinary and cosmetic ingredient", "코코넛 오일을 요리와 화장품 전반에 걸쳐 유용한 다용도 원료로 활용")
        ]
    },
    {
        "word": "coherent",
        "phonetic": "/koʊˈhɪr.ənt/",
        "meaning": "일관성 있는, 논리 정연한",
        "wrong": ["coherant", "coherint", "cohearnt"],
        "grammar": "co-her-ent 철자이며, 접미사는 -ant가 아닌 -ent입니다.",
        "expl": "'일관성 있는'은 coherent입니다. '-ant'가 아닌 '-ent'임에 주의하세요.",
        "idioms": "coherent argument (논리 정연한 주장), coherent plan (일관된 계획)",
        "predicates": [
            ("construct a logically [ (     ) ] thesis argument supported by evidence", "신뢰할 수 있는 증거에 기반하여 논리 정연하고 일관된 논지를 전개"),
            ("develop a [ (     ) ] national policy framework for renewable energy", "재생에너지 육성을 위한 일관성 있는 국가 정책 프레임워크를 수립"),
            ("deliver a clear and [ (     ) ] scientific presentation to international peers", "국제 동료 학자들에게 명료하고 논리 정연한 과학 발표를 진행"),
            ("organize scattered ideas into a structurally [ (     ) ] literary narrative", "흩어진 아이디어들을 구조적으로 일관성 있는 문학적 서사로 재구성")
        ]
    },
    {
        "word": "spontaneous",
        "phonetic": "/spɑːnˈteɪ.ni.əs/",
        "meaning": "자발적인, 즉흥적인",
        "wrong": ["spontanious", "spontaneus", "spontenous"],
        "grammar": "s-p-o-n-t-a-n-e-o-u-s 철자이며, -aneous 모음 배열에 유의합니다.",
        "expl": "'자발적인, 즉흥적인'은 spontaneous입니다. '-aneous' 형태를 기억하세요.",
        "idioms": "spontaneous applause (자발적인 박수갈채), spontaneous reaction (자연스러운 반응)",
        "predicates": [
            ("erupt into thunderous and [ (     ) ] applause at the end of the concert", "음악회가 끝나는 순간 우레와 같은 자발적 박수갈채를 환호"),
            ("initiate a [ (     ) ] community fundraising drive for hurricane victims", "허리케인 이재민들을 돕기 위해 자발적인 동네 모금 운동을 시작"),
            ("enjoy the unexpected thrill of a [ (     ) ] weekend road adventure", "즉흥적으로 떠난 주말 도로 여행의 뜻밖의 전율과 즐거움을 만끽"),
            ("observe the [ (     ) ] chemical reaction occurring without external heat", "외부 열 공급 없이 자연스럽게 일어나는 자발적 화학 반응을 관찰")
        ]
    },
    {
        "word": "prominent",
        "phonetic": "/ˈprɑː.mə.nənt/",
        "meaning": "저명한, 두드러진",
        "wrong": ["prominant", "promenet", "promminent"],
        "grammar": "m이 한 개(m)이며, 접미사는 -ant가 아닌 -ent(pro-mi-nent)입니다.",
        "expl": "'저명한'은 prominent입니다. m은 1개이며, 끝은 '-ent'입니다.",
        "idioms": "prominent scholar (저명한 학자), prominent feature (두드러진 특징)",
        "predicates": [
            ("invite a globally [ (     ) ] astrophysicist to deliver the keynote address", "기조연설을 맡기기 위해 세계적으로 저명한 천체물리학자를 초빙"),
            ("occupy a [ (     ) ] position in the national medical research institute", "국립 의학 연구소에서 핵심적이고 두드러진 직책을 수행"),
            ("highlight the most [ (     ) ] architectural features of the Gothic cathedral", "고딕 양식 대성당의 가장 두드러진 건축학적 특징들을 조명"),
            ("elect a [ (     ) ] civic activist to lead the clean city campaign", "깨끗한 도시 만들기 캠페인을 이끌 저명한 시민운동가를 선출")
        ]
    },
    {
        "word": "persistent",
        "phonetic": "/pɚˈsɪs.tənt/",
        "meaning": "끈질긴, 지속적인",
        "wrong": ["persistant", "persistint", "presistent"],
        "grammar": "per-sis-tent 철자이며, 접미사는 -ant가 아닌 -ent입니다.",
        "expl": "'끈질긴'은 persistent입니다. 'pre-'가 아닌 'per-'이며 끝은 '-ent'입니다.",
        "idioms": "persistent effort (끈기 있는 노력), persistent cough (지속되는 기침)",
        "predicates": [
            ("overcome difficult research hurdles through [ (     ) ] hard work and grit", "끈질긴 노력과 불굴의 투지를 통해 험난한 연구 난관들을 극복"),
            ("consult a specialist if you suffer from a [ (     ) ] dry cough for weeks", "몇 주 동안 끈질기게 지속되는 마른기침으로 고통받는다면 전문의와 상담"),
            ("refuse to give up dreams due to [ (     ) ] dedication to musical mastery", "음악적 완성을 향한 끈기 있는 헌신을 바탕으로 꿈을 포기하지 않음"),
            ("tackle the [ (     ) ] problem of urban traffic congestion with smart transit", "스마트 대중교통 체계를 통해 지속적으로 반복되는 도시 교통 체증을 해결")
        ]
    },
    {
        "word": "reluctant",
        "phonetic": "/rɪˈlʌk.tənt/",
        "meaning": "꺼리는, 주저하는",
        "wrong": ["reluctent", "reluktant", "relactant"],
        "grammar": "re-luc-tant 철자이며, 접미사는 -ent가 아닌 -ant입니다.",
        "expl": "'꺼리는'은 reluctant입니다. 끝 음절이 '-ent'가 아닌 '-ant'입니다.",
        "idioms": "reluctant to agree (동의하기를 주저하는), reluctant decision (마지못한 결정)",
        "predicates": [
            ("encourage students who are [ (     ) ] to speak up in large seminars", "대형 세미나에서 발언하기를 주저하는 학생들을 따뜻하게 격려"),
            ("understand why local residents were [ (     ) ] to support the highway plan", "지역 주민들이 고속도로 건설 계획을 지지하기를 꺼려했던 이유를 분석"),
            ("convince the [ (     ) ] witness to step forward and testify truthfully", "진실을 증언하기를 주저하던 목격자를 설득하여 법정에 출석시킴"),
            ("accept the leadership role even though you initially felt quite [ (     ) ]", "처음에는 몹시 주저되고 망설여졌음에도 불구하고 대표 직책을 수락")
        ]
    },
    {
        "word": "profound",
        "phonetic": "/prəˈfaʊnd/",
        "meaning": "심오한, 깊은",
        "wrong": ["profount", "profounde", "profund"],
        "grammar": "pro-found 철자이며, ou 모음에 유의합니다.",
        "expl": "'심오한'은 profound입니다. p-r-o-f-o-u-n-d 철자를 기억하세요.",
        "idioms": "profound impact (심오한 영향), profound insight (깊은 통찰)",
        "predicates": [
            ("examine the [ (     ) ] impact of the printing press on human philosophy", "인쇄술의 발명이 인류 철학사에 미친 심오한 영향을 고찰"),
            ("gain a [ (     ) ] understanding of environmental ethics through classic literature", "고전 문학 탐독을 통해 환경 윤리에 관한 깊은 통찰과 이해를 획득"),
            ("express [ (     ) ] gratitude to frontline healthcare workers in the crisis", "위기 상황 속에서 헌신한 일선 의료진들에게 깊은 감사의 뜻을 표명"),
            ("reflect quietly upon the [ (     ) ] mysteries of quantum physics theory", "양자역학 이론이 담고 있는 심오하고 신비로운 원리들을 차분히 사색")
        ]
    },
    {
        "word": "resilient",
        "phonetic": "/rɪˈzɪl.jənt/",
        "meaning": "회복력 있는, 탄력적인",
        "wrong": ["resiliant", "resilant", "resileint"],
        "grammar": "re-sil-i-ent 철자이며, 끝은 -ant가 아닌 -ent입니다.",
        "expl": "'회복력 있는'은 resilient입니다. 끝 철자가 '-ant'가 아닌 '-ent'입니다.",
        "idioms": "resilient economy (회복력 있는 경제), resilient spirit (불굴의 회복 의지)",
        "predicates": [
            ("build an ecologically [ (     ) ] coastal defense system against typhoons", "태풍에 맞서 생태학적으로 회복력 있는 해안 방어 시스템을 구축"),
            ("help traumatized communities become more emotionally [ (     ) ] after disaster", "재난 이후 피해 지역사회가 정서적으로 더욱 강한 회복력을 갖추도록 지원"),
            ("engineer shock-absorbing tires made of highly [ (     ) ] synthetic rubber", "탄성 회복력이 매우 뛰어난 합성 고무 소재의 충격 흡수 타이어를 제작"),
            ("foster a mentally [ (     ) ] mindset capable of thriving under academic pressure", "학업 스트레스 속에서도 역경을 딛고 일어설 수 있는 강한 회복 탄력성을 배양")
        ]
    },
    {
        "word": "subsequent",
        "phonetic": "/ˈsʌb.sə.kwənt/",
        "meaning": "그 다음의, 차후의",
        "wrong": ["subsequant", "subcequent", "subsequentt"],
        "grammar": "sub-se-quent 철자이며, 끝은 -ant가 아닌 -ent입니다.",
        "expl": "'차후의'는 subsequent입니다. 끝 음절이 '-ant'가 아닌 '-ent'입니다.",
        "idioms": "subsequent events (그 다음의 사건들), subsequent generation (다음 세대)",
        "predicates": [
            ("observe how [ (     ) ] generations inherited and expanded the art style", "다음 세대 예술가들이 어떻게 그 예술 양식을 계승하고 확장했는지 관찰"),
            ("verify that [ (     ) ] scientific trials reproduced the original laboratory results", "차후의 후속 과학 실험들이 원래의 실험실 결과를 그대로 재현하는지 검증"),
            ("revise project roadmaps based on [ (     ) ] developments in clean energy technology", "청정에너지 기술의 차후 발전 양상에 발맞추어 프로젝트 로드맵을 수정"),
            ("document the initial revolution and its [ (     ) ] impact on world politics", "초기 혁명과 그 이후 차후 세계 정치 지형에 미친 파급효과를 기록")
        ]
    },
    {
        "word": "unprecedented",
        "phonetic": "/ʌnˈpres.ə.den.t̬ɪd/",
        "meaning": "전례 없는, 유례없는",
        "wrong": ["unprecedanted", "unprecidented", "unpresidented"],
        "grammar": "precedent(선례)에 un-과 -ed가 붙은 형태로 un-prec-e-den-ted입니다.",
        "expl": "'전례 없는'은 unprecedented입니다. 'preced-' 철자에 주의하세요.",
        "idioms": "unprecedented growth (전례 없는 성장), unprecedented crisis (유례없는 위기)",
        "predicates": [
            ("respond decisively to the [ (     ) ] global economic crisis of our era", "우리 시대가 직면한 전례 없는 글로벌 경제 위기에 단호하게 대응"),
            ("witness the [ (     ) ] speed of modern artificial intelligence breakthroughs", "현대 인공지능 기술의 비약적 발전이 보여주는 전례 없는 속도를 목격"),
            ("celebrate the team's [ (     ) ] victory of winning five consecutive championships", "5회 연속 우승이라는 팀의 전례 없는 위대한 승리를 축하"),
            ("analyze the causes of the [ (     ) ] heatwave recorded across Europe", "유럽 전역에서 관측된 유례없는 극한 폭염의 원인을 과학적으로 분석")
        ]
    },
    {
        "word": "pragmatic",
        "phonetic": "/præɡˈmæt̬.ɪk/",
        "meaning": "실용적인, 실제적인",
        "wrong": ["pragmatick", "pragmaticc", "pragmetic"],
        "grammar": "prag-mat-ic 철자이며, 끝은 -ck가 아닌 -ic입니다.",
        "expl": "'실용적인'은 pragmatic입니다. 끝 철자가 'c'로 끝납니다.",
        "idioms": "pragmatic approach (실용적 접근), pragmatic solution (실제적 해법)",
        "predicates": [
            ("adopt a realistic and [ (     ) ] approach to resolving cross-border disputes", "국경 분쟁을 평화적으로 해결하기 위해 현실적이고 실용적인 접근 방식을 채택"),
            ("devise a [ (     ) ] action plan that fits within strict municipal budgets", "엄격한 지자체 예산 범위 내에 부합하는 실질적이고 실용적인 행동 계획을 수립"),
            ("favor [ (     ) ] policy compromises over rigid ideological standoffs", "경직된 이념 대립보다 상호 타협을 통한 실용적인 정책 절충안을 선호"),
            ("propose a [ (     ) ] strategy for deploying electric buses in suburban towns", "교외 지역 마을에 전기 버스를 도입하기 위한 매우 실용적인 전략을 제안")
        ]
    }
]

def build_level3_questions():
    questions = []
    start_id = 17001
    q_counter = 0

    for cycle in range(40):
        frame_idx = cycle // 4  # 0..9
        pred_idx = cycle % 4    # 0..3
        frame_en, frame_ko = FRAMES_LVL3[frame_idx]

        for item in RAW_WORDS_LVL3:
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
    qs = build_level3_questions()
    print(f"Level 3 generated {len(qs)} questions successfully.")
    print("Sample question 1:", json.dumps(qs[0], ensure_ascii=False, indent=2))
    print("Sample question 1000:", json.dumps(qs[-1], ensure_ascii=False, indent=2))
