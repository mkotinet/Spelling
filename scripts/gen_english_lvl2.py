# -*- coding: utf-8 -*-
"""
Level 2 English Generator (중등/필수 - IDs 16001 ~ 17000)
25 Words x 40 Distinct Situational Scenarios = 1,000 Questions
Zero Generic Meta-Templates! 100% Contextual Deduction!
"""

import json

LEVEL_NAME = "중등/필수"
CATEGORY = "중급 어휘"

# 10 Middle School Practical Frames
FRAMES_LVL2 = [
    ("Students are strongly encouraged to {act}.", "학생들은 {ko}하도록 적극 권장됩니다."),
    ("In daily communication, it is important to {act}.", "일상 소통에서 {ko}하는 것은 중요합니다."),
    ("Our teacher demonstrated how to {act}.", "선생님께서는 {ko}하는 방법을 시연해 주셨습니다."),
    ("Before moving on to the next step, you must {act}.", "다음 단계로 넘어가기 전에 {ko}해야 합니다."),
    ("During the youth community program, participants learn to {act}.", "청소년 지역사회 프로그램 동안 참가자들은 {ko}하는 것을 배웁니다."),
    ("In order to achieve personal growth, teenagers should {act}.", "개인적 성장을 이루기 위해 청소년들은 {ko}해야 합니다."),
    ("At the student council session, representatives voted to {act}.", "학생회 회의에서 대의원들은 {ko}하기로 의결했습니다."),
    ("When traveling with family, it is convenient to {act}.", "가족과 함께 여행할 때 {ko}하는 것은 편리합니다."),
    ("To improve practical language skills, try to {act}.", "실용 어학 실력을 향상시키기 위해 {ko}하도록 노력해 보세요."),
    ("After discussing the project outline, the team decided to {act}.", "프로젝트 개요를 논의한 후, 팀원들은 {ko}하기로 결정했습니다.")
]

# 25 Core Middle School Words with 4 Distinct Predicates / Context Clues
RAW_WORDS_LVL2 = [
    {
        "word": "receive",
        "phonetic": "/rɪˈsiːv/",
        "meaning": "받다, 수령하다",
        "wrong": ["recieve", "receve", "receave"],
        "grammar": "'i before e except after c' 규칙에 따라 c 뒤에는 'ei'(re-ceive)로 적습니다.",
        "expl": "'받다'는 receive가 맞습니다. c 뒤에서는 ie가 아닌 ei입니다.",
        "idioms": "receive an email (이메일을 받다), receive an award (상을 받다)",
        "predicates": [
            ("confirm that you [ (     ) ] the official letter of acceptance", "공식 합격 서한을 정상적으로 수령"),
            ("check your inbox to [ (     ) ] the attached registration file", "첨부된 등록 파일을 받기 위해 수신함을 확인"),
            ("step onto the stage to [ (     ) ] the top honor student award", "수석 우등상을 수상하기 위해 무대 위로 입장"),
            ("wait patiently to [ (     ) ] feedback from the admissions committee", "입학 사정관 위원회의 심사 피드백을 차분히 수령")
        ]
    },
    {
        "word": "accommodate",
        "phonetic": "/əˈkɑː.mə.deɪt/",
        "meaning": "수용하다, 편의를 도모하다",
        "wrong": ["accomodate", "acommodate", "acomodate"],
        "grammar": "c가 두 개(cc), m이 두 개(mm) 들어가는 대표적 철자 주의 단어입니다.",
        "expl": "'수용하다'는 accommodate입니다. c와 m이 모두 2개씩 들어갑니다.",
        "idioms": "accommodate guests (손님을 수용하다), accommodate needs (요구를 수용하다)",
        "predicates": [
            ("expand the youth hostel facilities to [ (     ) ] extra guests", "추가 투숙객을 수용하기 위해 유스호스텔 시설을 확충"),
            ("adjust the training schedule to [ (     ) ] special student needs", "학생들의 특별한 요구사항을 수용하여 훈련 일정을 조정"),
            ("book a spacious banquet hall capable to [ (     ) ] five hundred visitors", "방문객 500명을 충분히 수용할 수 있는 넓은 연회장을 예약"),
            ("redesign the school ramp to [ (     ) ] wheelchair users safely", "휠체어 이용자의 편의를 도모하기 위해 학교 경사로를 재정비")
        ]
    },
    {
        "word": "environment",
        "phonetic": "/ɪnˈvaɪ.rən.mənt/",
        "meaning": "환경",
        "wrong": ["enviroment", "environmant", "envirolement"],
        "grammar": "명사이며, 가운데 'n' 철자(en-vi-ron-ment)를 빠뜨리지 않아야 합니다.",
        "expl": "'환경'은 environment가 맞습니다. 발음상 탈락하기 쉬운 n(ron)에 주의하세요.",
        "idioms": "protect the environment (환경을 보호하다), natural environment (자연환경)",
        "predicates": [
            ("reduce single-use plastic waste to protect the natural [ (     ) ]", "자연환경을 보호하기 위해 일회용 플라스틱 쓰레기를 감축"),
            ("create a safe and supportive study [ (     ) ] for all students", "모든 학생을 위해 안전하고 협력적인 학습 환경을 조성"),
            ("plant native trees to restore the fragile forest [ (     ) ]", "취약한 산림 환경을 복원하기 위해 자생 수종을 식재"),
            ("monitor clean air indicators in our surrounding urban [ (     ) ]", "우리를 둘러싼 도시 환경에서 청정 공기 지표를 모니터링")
        ]
    },
    {
        "word": "embarrass",
        "phonetic": "/ɪmˈber.əs/",
        "meaning": "당황하게 하다, 곤란하게 만들다",
        "wrong": ["embarass", "emberrass", "embaras"],
        "grammar": "r이 두 개(rr), s가 두 개(ss) 들어가는 동사입니다.",
        "expl": "'당황하게 하다'는 embarrass입니다. r과 s가 모두 2개씩 들어갑니다.",
        "idioms": "feel embarrassed (당황스럽게 느끼다), embarrass someone (남을 무안하게 하다)",
        "predicates": [
            ("avoid making careless jokes that might [ (     ) ] a close classmate", "친한 반 친구를 당황하게 만들 수 있는 부주의한 농담을 지양"),
            ("stay calm on stage so you do not [ (     ) ] yourself during the speech", "연설 중에 스스로 당황하지 않도록 무대 위에서 침착함을 유지"),
            ("refrain from asking overly private questions that could [ (     ) ] others", "상대방을 곤란하게 만들 수 있는 지나치게 사적인 질문을 자제"),
            ("apologize sincerely whenever your awkward words accidentally [ (     ) ] a friend", "어색한 말실수로 친구를 무안하게 했을 때 진심으로 사과")
        ]
    },
    {
        "word": "necessary",
        "phonetic": "/ˈnes.ə.ser.i/",
        "meaning": "필요한, 필수적인",
        "wrong": ["neccessary", "necesary", "necessery"],
        "grammar": "c는 한 개(c), s는 두 개(ss) 들어가는 형태에 주의합니다.",
        "expl": "'필요한'은 necessary입니다. c는 1개, s는 2개입니다.",
        "idioms": "necessary steps (필요한 조치), necessary condition (필요조건)",
        "predicates": [
            ("gather all the [ (     ) ] documents before applying for the student visa", "학생 비자를 신청하기 전에 필요한 모든 서류를 구비"),
            ("take the [ (     ) ] safety precautions during the chemistry lab test", "화학 실험 평가를 진행하는 동안 필요한 안전 예방 조치를 준수"),
            ("acquire the [ (     ) ] fundamental knowledge for high school math", "고등학교 수학 과정을 위한 필수적인 기초 지식을 습득"),
            ("bring only the [ (     ) ] supplies for the weekend backpacking hike", "주말 백패킹 등산을 위해 꼭 필요한 필수 물품만을 지참")
        ]
    },
    {
        "word": "separate",
        "phonetic": "/ˈsep.ɚ.eɪt/",
        "meaning": "분리하다, 별개의",
        "wrong": ["seperate", "separete", "seperete"],
        "grammar": "가운데 모음 철자가 'e'가 아닌 'a'(sep-a-rate)입니다.",
        "expl": "'분리하다'는 separate입니다. 가운데 철자가 'e'가 아닌 'a'임에 주의하세요.",
        "idioms": "separate recyclable waste (재활용 쓰레기를 분리하다), separate rooms (개별 방)",
        "predicates": [
            ("sort and [ (     ) ] recyclable paper from household kitchen waste", "가정용 주방 쓰레기에서 재활용 종이를 선별하여 분리"),
            ("divide the debate club members into two [ (     ) ] teams", "토론 동아리 회원들을 두 개의 개별 팀으로 분리"),
            ("store delicate glassware items in a [ (     ) ] protective container", "파손되기 쉬운 유리 제품을 별도의 보호 용기에 보관"),
            ("keep personal diary entries completely [ (     ) ] from school notes", "개인 일기 기록을 학교 공부 노트와 완전히 분리하여 관리")
        ]
    },
    {
        "word": "experience",
        "phonetic": "/ɪkˈspɪr.i.əns/",
        "meaning": "경험, 경험하다",
        "wrong": ["experiance", "experence", "expereince"],
        "grammar": "접미사가 -ance가 아닌 -ence(ex-pe-ri-ence)입니다.",
        "expl": "'경험'은 experience입니다. 끝 음절이 '-ance'가 아닌 '-ence'입니다.",
        "idioms": "gain valuable experience (귀중한 경험을 쌓다), firsthand experience (직접적인 경험)",
        "predicates": [
            ("gain valuable hands-on [ (     ) ] during the summer science internship", "여름 과학 인턴십 과정에서 귀중한 실무 경험을 축적"),
            ("visit traditional cultural villages to [ (     ) ] ancient customs directly", "옛 풍습을 직접 체험하기 위해 전통 민속마을을 탐방"),
            ("broaden your personal horizons through diverse travel [ (     ) ]", "다양한 여행 경험을 통해 개인적 시야를 확장"),
            ("share your inspiring personal [ (     ) ] with younger student mentees", "후배 멘티 학생들과 감동적인 개인적 경험을 공유")
        ]
    },
    {
        "word": "government",
        "phonetic": "/ˈɡʌv.ɚn.mənt/",
        "meaning": "정부",
        "wrong": ["goverment", "govermant", "governmet"],
        "grammar": "govern에 -ment가 결합한 형태로, 가운데 'n'을 빠뜨리지 않아야 합니다.",
        "expl": "'정부'는 government입니다. 가운데 묵음처럼 들리는 'n'에 유의하세요.",
        "idioms": "local government (지방 정부), government policy (정부 정책)",
        "predicates": [
            ("study how the democratic [ (     ) ] creates and passes public laws", "민주주의 정부가 어떻게 공공 법률을 제정하고 통과시키는지 학습"),
            ("apply for a competitive [ (     ) ] scholarship grant for student innovators", "학생 혁신가를 위한 국가 정부 장학금을 지원"),
            ("abide by official health guidelines announced by the federal [ (     ) ]", "중앙 정부가 발표한 공식 보건 가이드라인을 준수"),
            ("participate in youth mock elections organized by the local [ (     ) ]", "지방 정부가 주관하는 청소년 모의 선거에 참여")
        ]
    },
    {
        "word": "definitely",
        "phonetic": "/ˈdef.ən.ət.li/",
        "meaning": "분명히, 틀림없이",
        "wrong": ["definately", "definitly", "definetly"],
        "grammar": "finite의 어근에서 파생되어 de-fi-nite-ly(모음 i) 철자를 취합니다.",
        "expl": "'분명히'는 definitely가 맞습니다. 'a'가 아닌 'i' 철자(finite)에 유의하세요.",
        "idioms": "definitely agree (분명히 동의하다), definitely worth it (틀림없이 가치가 있다)",
        "predicates": [
            ("confirm that you will [ (     ) ] participate in the weekend charity walk", "주말 자선 걷기 대회에 분명히 참가할 것임을 확인"),
            ("recommend a book that is [ (     ) ] worth reading for youth readers", "청소년 독자들에게 틀림없이 읽을 가치가 있는 도서를 추천"),
            ("state your clear conclusion [ (     ) ] and confidently in the essay", "에세이에서 명확한 결론을 분명하고 자신 있게 서술"),
            ("promise that our dedicated team will [ (     ) ] finish the mission today", "우리 팀이 오늘 안으로 과업을 틀림없이 완수할 것을 약속")
        ]
    },
    {
        "word": "opportunity",
        "phonetic": "/ˌɑː.pɚˈtuː.nə.t̬i/",
        "meaning": "기회",
        "wrong": ["oportunity", "opportunaty", "oppertunity"],
        "grammar": "p가 두 개(pp) 들어가며, op-por-tu-ni-ty 모음 철자에 주의합니다.",
        "expl": "'기회'는 opportunity입니다. p가 2개(pp) 들어갑니다.",
        "idioms": "seize the opportunity (기회를 잡다), golden opportunity (절호의 기회)",
        "predicates": [
            ("seize every valuable [ (     ) ] to practice speaking foreign languages", "외국어 말하기를 연습할 수 있는 모든 소중한 기회를 포착"),
            ("take advantage of this rare educational [ (     ) ] to study abroad", "해외 유학을 떠날 수 있는 이 드문 교육적 기회를 적극 활용"),
            ("give every club member an equal [ (     ) ] to express their ideas", "동아리 모든 회원에게 자신의 의견을 표현할 동등한 기회를 제공"),
            ("look forward to the promising job [ (     ) ] after graduating from high school", "고등학교 졸업 후 펼쳐질 유망한 취업 기회를 기대")
        ]
    },
    {
        "word": "guarantee",
        "phonetic": "/ˌɡer.ənˈtiː/",
        "meaning": "보장하다, 보증",
        "wrong": ["garantee", "garrantee", "guarente"],
        "grammar": "g-u-a-r-a-n-t-e-e 철자이며 끝에 'ee'가 들어갑니다.",
        "expl": "'보장하다'는 guarantee입니다. 'gua-'로 시작하고 끝이 '-ee'입니다.",
        "idioms": "money-back guarantee (환불 보증), guarantee success (성공을 보장하다)",
        "predicates": [
            ("check the official warranty card that will [ (     ) ] free repair services", "무상 수리 서비스를 보장하는 공식 품질 보증서를 확인"),
            ("work diligently because hard effort alone cannot always [ (     ) ] easy success", "노력만으로는 쉬운 성공을 언제나 보장할 수 없음을 인지하며 성실히 임함"),
            ("provide safe laboratory equipment to [ (     ) ] student safety", "학생들의 안전을 완벽히 보장하기 위해 안전한 실험 장비를 제공"),
            ("offer a full customer satisfaction [ (     ) ] for every handmade product", "모든 수제품에 대해 완벽한 고객 만족 보증을 제공")
        ]
    },
    {
        "word": "conscience",
        "phonetic": "/ˈkɑːn.ʃəns/",
        "meaning": "양심",
        "wrong": ["concience", "conscence", "consience"],
        "grammar": "con + science(과학)의 형태와 철자가 동일(con-science)합니다.",
        "expl": "'양심'은 conscience입니다. sci- 형태에 유의하세요.",
        "idioms": "clear conscience (거리낌 없는 양심), listen to your conscience (양심의 소리를 듣다)",
        "predicates": [
            ("listen to your inner [ (     ) ] before making a tough ethical choice", "어려운 윤리적 결정을 내리기 전에 내면의 양심의 소리에 귀를 기울임"),
            ("act with a clear and honest [ (     ) ] in all academic tests", "모든 학업 평가에서 거리낌 없고 정직한 양심에 따라 행동"),
            ("refuse dishonest behavior that goes against your moral [ (     ) ]", "자신의 도덕적 양심에 어긋나는 부정직한 행동을 단호히 거부"),
            ("feel a guilty pang of [ (     ) ] after breaking a classmate's trust", "친구와의 신뢰를 저버린 후 밀려오는 양심의 가책을 반성")
        ]
    },
    {
        "word": "privilege",
        "phonetic": "/ˈprɪv.əl.ɪdʒ/",
        "meaning": "특권, 특혜",
        "wrong": ["privelege", "priviledge", "privilage"],
        "grammar": "가운데 모음은 'e'가 아닌 'i'이며, d가 들어가지 않는 '-lege' 형태입니다.",
        "expl": "'특권'은 privilege입니다. 가운데가 'i'이며 'd'가 들어가지 않습니다.",
        "idioms": "a great privilege (대단한 영광/특권), abuse of privilege (특권 남용)",
        "predicates": [
            ("consider it a great honor and [ (     ) ] to represent our school", "우리 학교를 대표하게 된 것을 커다란 영광이자 특권으로 간주"),
            ("remember that with special academic [ (     ) ] comes greater social responsibility", "특별한 학업적 특권에는 더 큰 사회적 책임이 뒤따른다는 점을 명심"),
            ("grant senior student council leaders the [ (     ) ] of leading assemblies", "학생회 간부들에게 전체 조회를 진행할 수 있는 특권을 부여"),
            ("ensure that basic human rights are a standard right rather than an exclusive [ (     ) ]", "기본적 인권이 소수의 독점적 특권이 아닌 보편적 권리임을 확인")
        ]
    },
    {
        "word": "recommend",
        "phonetic": "/ˌrek.əˈmend/",
        "meaning": "추천하다",
        "wrong": ["recommand", "recommed", "reccommend"],
        "grammar": "c는 한 개(c), m은 두 개(mm) 들어가는 동사입니다.",
        "expl": "'추천하다'는 recommend입니다. c는 1개, m은 2개입니다.",
        "idioms": "highly recommend (적극 추천하다), recommend a movie (영화를 추천하다)",
        "predicates": [
            ("ask the school librarian to [ (     ) ] a gripping historical adventure novel", "학교 사서 선생님께 흥미진진한 역사 모험 소설을 추천해 달라고 요청"),
            ("write a polite note to [ (     ) ] your friend for the youth leadership award", "청소년 리더십 상 후보로 친구를 추천하는 정중한 추천서를 작성"),
            ("taste and [ (     ) ] healthy dining spots near our school campus", "학교 캠퍼스 인근의 건강한 맛집을 직접 맛보고 추천"),
            ("create an online playlist to [ (     ) ] uplifting classical study music", "학습 능률을 올려주는 클래식 음악을 추천하기 위해 온라인 재생목록을 제작")
        ]
    },
    {
        "word": "successful",
        "phonetic": "/səkˈses.fəl/",
        "meaning": "성공적인",
        "wrong": ["sucessful", "successfull", "succesful"],
        "grammar": "c가 두 개(cc), s가 두 개(ss)이며, 접미사는 -full이 아닌 -ful입니다.",
        "expl": "'성공적인'은 successful입니다. cc, ss이며 끝은 '-ful'입니다.",
        "idioms": "successful career (성공적인 경력), highly successful (대단히 성공적인)",
        "predicates": [
            ("congratulate all classmates on the [ (     ) ] completion of the drama festival", "연극 축제의 성공적인 마무리에 대해 모든 급우에게 축하를 전달"),
            ("work hard as a team to make the school science fair [ (     ) ]", "학교 과학 박람회를 성공적으로 치르기 위해 한 팀으로 긴밀히 협력"),
            ("learn valuable life habits from inspiring and [ (     ) ] community mentors", "귀감이 되는 성공적인 지역사회 멘토들로부터 유익한 생활 습관을 학습"),
            ("implement smart study strategies for a truly [ (     ) ] academic semester", "진정으로 성공적인 학기를 보내기 위해 현명한 학습 전략을 실행")
        ]
    },
    {
        "word": "rhythm",
        "phonetic": "/ˈrɪð.əm/",
        "meaning": "리듬, 운율",
        "wrong": ["rythm", "rhythem", "rhithm"],
        "grammar": "r-h-y-t-h-m 철자이며, 모음 a, e, i, o, u가 없이 y만 포함됩니다.",
        "expl": "'리듬'은 rhythm입니다. r 뒤의 h와 y, t 뒤의 h 철자에 유의하세요.",
        "idioms": "sense of rhythm (리듬감), musical rhythm (음악적 리듬)",
        "predicates": [
            ("clap your hands along with the upbeat musical [ (     ) ] of the band", "밴드의 경쾌한 음악적 리듬에 맞춰 손뼉을 침"),
            ("maintain a steady breathing [ (     ) ] while running long distances", "장거리를 달리는 동안 일정한 호흡 리듬을 안정적으로 유지"),
            ("practice drumming rudiments to improve your natural sense of [ (     ) ]", "타고난 리듬감을 향상시키기 위해 드럼 기초 비트를 연습"),
            ("recite modern poetry while feeling the melodic [ (     ) ] of each stanza", "각 연의 감미로운 운율과 리듬을 음미하며 현대시를 낭송")
        ]
    },
    {
        "word": "restaurant",
        "phonetic": "/ˈres.tə.rɑːnt/",
        "meaning": "식당, 레스토랑",
        "wrong": ["resturant", "restraunt", "restarant"],
        "grammar": "res-tau-rant 형태이며, '-tau-' 모음 철자에 주의합니다.",
        "expl": "'식당'은 restaurant입니다. 'tau' 모음 배열을 기억하세요.",
        "idioms": "family restaurant (패밀리 레스토랑), reserve a table at a restaurant (식당을 예약하다)",
        "predicates": [
            ("reserve a table at an Italian [ (     ) ] to celebrate mother's promotion", "어머니의 승진을 축하하기 위해 이탈리아 식당의 테이블을 예약"),
            ("order traditional dishes from a popular local family [ (     ) ]", "인기 있는 동네 패밀리 레스토랑에서 전통 요리를 주문"),
            ("read customer food reviews before choosing a downtown dinner [ (     ) ]", "시내 저녁 식당을 선택하기 전에 고객 음식 리뷰를 확인"),
            ("learn polite table dining manners when eating out at a formal [ (     ) ]", "격식 있는 정식 식당에서 외식할 때 예의 바른 식사 예절을 준수")
        ]
    },
    {
        "word": "parallel",
        "phonetic": "/ˈper.ə.lel/",
        "meaning": "평행한, 유사한",
        "wrong": ["paralel", "parrallel", "parallell"],
        "grammar": "p-a-r-a-l-l-e-l 철자이며, 첫 l은 하나, 뒤의 l은 두 개(ll)입니다.",
        "expl": "'평행한'은 parallel입니다. 앞은 l 1개, 뒤는 l 2개(ll)입니다.",
        "idioms": "parallel lines (평행선), run in parallel (병행하여 진행되다)",
        "predicates": [
            ("draw two straight [ (     ) ] geometric lines with a ruler in math class", "수학 시간에 자를 대고 두 개의 곧은 평행선을 제도"),
            ("notice how the railroad tracks run perfectly [ (     ) ] across the plains", "철도 선로가 평야를 가로지르며 완벽하게 평행을 이루는 모습을 관찰"),
            ("draw an insightful [ (     ) ] between historical events and current affairs", "역사적 사건과 현대 시사 문제 사이의 유사점을 통찰력 있게 비교"),
            ("align two wooden boards in a strictly [ (     ) ] position before gluing", "접착하기 전에 두 개의 목재 판자를 엄격하게 평행한 위치로 정렬")
        ]
    },
    {
        "word": "miniature",
        "phonetic": "/ˈmɪn.i.ə.tʃɚ/",
        "meaning": "소형의, 축소 모형",
        "wrong": ["miniture", "minature", "miniatuer"],
        "grammar": "mini + ature 결합으로 min-i-a-ture 철자에 주의합니다.",
        "expl": "'축소 모형'은 miniature입니다. 'a'를 빠뜨리지 않도록 유의하세요.",
        "idioms": "miniature model (축소 모형), miniature garden (미니어처 정원)",
        "predicates": [
            ("paint the delicate details on a plastic [ (     ) ] airplane model", "플라스틱 소형 비행기 축소 모형에 섬세한 디테일을 채색"),
            ("build an intricate [ (     ) ] railway city display inside a glass box", "유리 상자 안에 정교한 미니어처 철도 도시 전시물을 제작"),
            ("collect handcrafted [ (     ) ] furniture sets for a dollhouse hobby", "인형의 집 취미를 위해 정교한 수제 미니어처 가구 세트를 수집"),
            ("photograph tiny [ (     ) ] clay figurines under focused museum lighting", "박물관 집중 조명 아래에서 작은 미니어처 점토 피규어를 촬영")
        ]
    },
    {
        "word": "maintenance",
        "phonetic": "/ˈmeɪn.tən.əns/",
        "meaning": "유지, 보수",
        "wrong": ["maintainance", "maintenence", "maintenanse"],
        "grammar": "동사는 maintain이지만 명사는 main-ten-ance 형태입니다.",
        "expl": "'유지보수'는 maintenance가 맞습니다. 'maintainance'가 아닌 '-ten-ance'입니다.",
        "idioms": "regular maintenance (정기 유지보수), low maintenance (관리가 쉬운)",
        "predicates": [
            ("perform regular routine [ (     ) ] on your bicycle gears and chain", "자전거 기어와 체인에 대한 정기적인 일상 유지보수를 실시"),
            ("close the public swimming pool for scheduled filter [ (     ) ] on Monday", "월요일에 예정된 필터 교체 및 유지보수를 위해 공공 수영장을 임시 휴장"),
            ("inspect the school heating system to ensure proper winter [ (     ) ]", "적절한 동절기 유지보수를 보장하기 위해 학교 난방 시스템을 점검"),
            ("clean your musical instrument daily for long-term acoustic [ (     ) ]", "악기의 오랜 수명과 음향 유지를 위해 매일 세척 및 보수를 진행")
        ]
    },
    {
        "word": "independent",
        "phonetic": "/ˌɪn.dɪˈpen.dənt/",
        "meaning": "독립적인, 자립적인",
        "wrong": ["independant", "indipendant", "indipendent"],
        "grammar": "접미사는 -ant가 아닌 -ent(in-de-pend-ent)입니다.",
        "expl": "'독립적인'은 independent입니다. 끝 철자가 '-ant'가 아닌 '-ent'입니다.",
        "idioms": "independent thinking (독립적 사고), become independent (자립하다)",
        "predicates": [
            ("cultivate critical and [ (     ) ] thinking skills through daily reading", "매일 독서를 통해 비판적이고 독립적인 사고 능력을 함양"),
            ("encourage students to become self-reliant and [ (     ) ] learners", "학생들이 스스로 주도하는 자립적이고 독립적인 학습자가 되도록 격려"),
            ("conduct an [ (     ) ] science experiment without relying on peer answers", "동료의 답에 의존하지 않고 주도적인 독립 과학 탐구를 수행"),
            ("learn practical housekeeping chores to live an [ (     ) ] life later", "훗날 자립적인 삶을 영위하기 위해 실용적인 가사일을 스스로 습득")
        ]
    },
    {
        "word": "foreign",
        "phonetic": "/ˈfɔːr.ən/",
        "meaning": "외국의, 이질적인",
        "wrong": ["foriegn", "forein", "foreing"],
        "grammar": "f-o-r-e-i-g-n 철자이며, g는 묵음이고 'ei' 순서입니다.",
        "expl": "'외국의'는 foreign입니다. 'ie'가 아닌 'ei'이며 묵음 g가 들어갑니다.",
        "idioms": "foreign language (외국어), foreign exchange student (외국인 교환학생)",
        "predicates": [
            ("practice basic everyday phrases in a new [ (     ) ] language club", "새로운 외국어 동아리에서 일상 기초 회화 표현을 학습"),
            ("welcome international exchange students from [ (     ) ] countries warmly", "외국에서 방문한 국제 교환학생들을 따뜻하게 맞이"),
            ("watch award-winning [ (     ) ] films with English subtitle tracks", "영어 자막이 제공되는 우수한 외국 영화들을 감상"),
            ("collect colorful postal stamps and unique coins from [ (     ) ] nations", "다양한 외국 국가들의 다채로운 우표와 독특한 동전을 수집")
        ]
    },
    {
        "word": "disappear",
        "phonetic": "/ˌdɪs.əˈpɪr/",
        "meaning": "사라지다, 소멸하다",
        "wrong": ["dissappear", "disapear", "dissapear"],
        "grammar": "dis- + appear로 s는 한 개(s), p는 두 개(pp)입니다.",
        "expl": "'사라지다'는 disappear입니다. s는 1개, p는 2개(pp)입니다.",
        "idioms": "disappear without a trace (흔적도 없이 사라지다), disappear into thin air (감쪽같이 사라지다)",
        "predicates": [
            ("watch thick morning fog slowly [ (     ) ] as the warm sun rises", "따뜻한 태양이 떠오르며 짙은 아침 안개가 서서히 사라지는 모습을 관찰"),
            ("prevent precious wildlife species from starting to [ (     ) ] forever", "소중한 야생동물 종들이 영원히 소멸해 사라지는 것을 방지"),
            ("marvel at how magician tricks make playing cards [ (     ) ] into thin air", "마술사의 트릭으로 트럼프 카드가 공중으로 감쪽같이 사라지는 광경에 감탄"),
            ("clean your messy desk so missing pencils do not easily [ (     ) ] again", "잃어버린 연필이 쉽게 사라지지 않도록 어수선한 책상을 정돈")
        ]
    },
    {
        "word": "convenient",
        "phonetic": "/kənˈviː.ni.ənt/",
        "meaning": "편리한, 사용하기 편한",
        "wrong": ["convienient", "conveniant", "convenent"],
        "grammar": "con-ve-ni-ent 철자이며, 끝은 -ant가 아닌 -ent입니다.",
        "expl": "'편리한'은 convenient입니다. '-ant'가 아닌 '-ent' 철자입니다.",
        "idioms": "convenient store (편의점), convenient location (편리한 위치)",
        "predicates": [
            ("install a user-friendly mobile app that offers a fast and [ (     ) ] service", "빠르고 편리한 서비스를 제공하는 사용자 친화적 모바일 앱을 설치"),
            ("choose a study desk situated in a quiet yet highly [ (     ) ] location", "조용하면서도 접근성이 매우 편리한 위치에 있는 독서실 책상을 선택"),
            ("use lightweight digital tablets as a [ (     ) ] alternative to heavy books", "무거운 책 대신 가볍고 편리한 대안으로 디지털 태블릿을 활용"),
            ("find a mutually [ (     ) ] meeting time for all project group members", "모든 프로젝트 팀원들이 참석하기에 상호 편리한 회의 시간을 조율")
        ]
    },
    {
        "word": "celebrate",
        "phonetic": "/ˈsel.ə.breɪt/",
        "meaning": "축하하다, 기념하다",
        "wrong": ["celibrate", "celebreat", "celeberate"],
        "grammar": "c-e-l-e-b-r-a-t-e 철자이며, 첫 음절은 s가 아닌 c입니다.",
        "expl": "'축하하다'는 celebrate입니다. 's'가 아닌 'c'로 시작합니다.",
        "idioms": "celebrate a victory (승리를 축하하다), celebrate anniversary (기념일을 축하하다)",
        "predicates": [
            ("gather with beloved family members to joyfully [ (     ) ] the New Year", "새해를 기쁘게 축하하기 위해 사랑하는 가족들과 함께 모임을 진행"),
            ("organize a lively surprise party to [ (     ) ] your friend's big milestone", "친구의 큰 성과를 축하하기 위해 활기찬 깜짝 파티를 준비"),
            ("bake a sweet strawberry shortcake to [ (     ) ] graduation day together", "졸업식을 다 함께 기념하고 축하하기 위해 달콤한 딸기 케이크를 조리"),
            ("host a neighborhood festival to [ (     ) ] community cultural diversity", "지역사회의 문화적 다양성을 기념하고 축하하기 위해 동네 축제를 개최")
        ]
    }
]

def build_level2_questions():
    questions = []
    start_id = 16001
    q_counter = 0

    for cycle in range(40):
        frame_idx = cycle // 4  # 0..9
        pred_idx = cycle % 4    # 0..3
        frame_en, frame_ko = FRAMES_LVL2[frame_idx]

        for item in RAW_WORDS_LVL2:
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
    qs = build_level2_questions()
    print(f"Level 2 generated {len(qs)} questions successfully.")
    print("Sample question 1:", json.dumps(qs[0], ensure_ascii=False, indent=2))
    print("Sample question 1000:", json.dumps(qs[-1], ensure_ascii=False, indent=2))
