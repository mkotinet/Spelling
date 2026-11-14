# -*- coding: utf-8 -*-
"""
Level 5 English Generator (일반/실무 - IDs 19001 ~ 20000)
25 Words x 40 Distinct Situational Scenarios = 1,000 Questions
Zero Generic Meta-Templates! 100% Contextual Deduction!
"""

import json

LEVEL_NAME = "일반/실무"
CATEGORY = "비즈니스 실무"

# 10 Professional Business & Executive Frames
FRAMES_LVL5 = [
    ("In accordance with corporate governance guidelines, officers must {act}.", "기업 지배구조 가이드라인에 따라 임원들은 {ko}해야 합니다."),
    ("During the quarterly executive boardroom meeting, directors decided to {act}.", "분기 임원 이사회 회의에서 이사들은 {ko}하기로 결정했습니다."),
    ("To maximize strategic investment efficiency, senior managers plan to {act}.", "전략적 투자 효율성을 극대화하기 위해 고위 관리자들은 {ko}할 계획입니다."),
    ("Before finalizing the multinational commercial contract, the legal team must {act}.", "다국적 상거래 계약을 최종 체결하기 전에 법무팀은 {ko}해야 합니다."),
    ("As part of the enterprise risk mitigation protocol, department heads frequently {act}.", "기업 리스크 완화 프로토콜의 일환으로 부서장들은 자주 {ko}합니다."),
    ("In order to satisfy international trade compliance benchmarks, it is essential to {act}.", "국제 무역 규제 준수 기준을 충족하기 위해 {ko}하는 것은 필수적입니다."),
    ("Following the annual market competitiveness audit, leadership agreed to {act}.", "연례 시장 경쟁력 감사 결과에 따라 경영진은 {ko}하기로 합의했습니다."),
    ("To maintain high standards of professional accountability, teams are required to {act}.", "높은 수준의 직업적 책무성을 유지하기 위해 실무팀들은 {ko}해야 합니다."),
    ("During cross-functional task force operations, project leads collaborate to {act}.", "부서 간 태스크포스 실무 운영 중 프로젝트 리더들은 협력하여 {ko}합니다."),
    ("In the annual shareholder address, the chief executive emphasized the goal to {act}.", "연례 주주총회 연설에서 최고경영자는 {ko}하겠다는 목표를 역설했습니다.")
]

# 25 Core Business & Practical Words with 4 Distinct Predicates / Context Clues
RAW_WORDS_LVL5 = [
    {
        "word": "correspondence",
        "phonetic": "/ˌkɔːr.əˈspɑːn.dəns/",
        "meaning": "서신, 통신, 일치",
        "wrong": ["correspondance", "corespondence", "corespondanse"],
        "grammar": "r이 두 개(rr), 접미사는 -ance가 아닌 -ence(cor-re-spond-ence)입니다.",
        "expl": "'서신'은 correspondence입니다. rr이며 끝은 '-ence'입니다.",
        "idioms": "email correspondence (이메일 서신), in correspondence with (~와 서신을 교환하여)",
        "predicates": [
            ("archive all encrypted email [ (     ) ] with international buyers securely", "해외 바이어들과 교환한 모든 암호화된 이메일 서신을 안전하게 보관"),
            ("maintain formal written [ (     ) ] regarding contractual price adjustments", "계약상 가격 조정 협상과 관련된 공식 서면 서신 기록을 유지"),
            ("review months of diplomatic [ (     ) ] between the two trade ministries", "두 통상 부처 간에 오고 간 수개월 치의 외교적 통신 서한을 면밀히 검토"),
            ("file confidential client [ (     ) ] inside restricted cloud storage vaults", "고객과의 기밀 서신 자료를 접근 제한된 클라우드 보안 금고에 편철")
        ]
    },
    {
        "word": "itinerary",
        "phonetic": "/aɪˈtɪn.ə.rer.i/",
        "meaning": "여행 일정표",
        "wrong": ["itinirary", "itinarary", "itenerary"],
        "grammar": "i-t-i-n-e-r-a-r-y 철자이며, 두 번째 모음은 'e'입니다.",
        "expl": "'여행 일정표'는 itinerary가 맞습니다. i-t-i-n-e-r-a-r-y 모음 배열에 유의하세요.",
        "idioms": "flight itinerary (항공 일정표), detailed itinerary (상세 일정표)",
        "predicates": [
            ("finalize the overseas business travel [ (     ) ] with flight connections and hotels", "항공편 환승과 호텔 예약이 포함된 해외 출장 일정표를 최종 확정"),
            ("distribute the comprehensive conference [ (     ) ] to visiting keynote speakers", "초청 기조연설자들에게 종합 콘퍼런스 행사 일정표를 배포"),
            ("adjust the delegation's field inspection [ (     ) ] due to sudden weather delays", "갑작스러운 기상 악화로 인한 지연에 따라 대표단의 현장 실사 일정표를 변경"),
            ("confirm every local transit transfer on the executive [ (     ) ] before departure", "출국 전 경영진 출장 일정표에 기재된 모든 현지 교통 환승편을 재확인")
        ]
    },
    {
        "word": "compensation",
        "phonetic": "/ˌkɑːm.penˈseɪ.ʃən/",
        "meaning": "보상, 급여",
        "wrong": ["compensasion", "conpensation", "compansation"],
        "grammar": "com-pen-sa-tion 철자이며, '-sation' 형태에 주의합니다.",
        "expl": "'보상, 급여'는 compensation입니다. con-이 아닌 com-으로 시작합니다.",
        "idioms": "compensation package (보상 패키지), workers' compensation (산재 보상)",
        "predicates": [
            ("negotiate a competitive salary and bonus [ (     ) ] package for top AI engineers", "최고급 인공지능 엔지니어 영입을 위해 경쟁력 있는 연봉 및 성과급 보상 패키지를 협상"),
            ("provide equitable financial [ (     ) ] to property owners affected by airport expansion", "공항 확장 부지에 포함되어 피해를 입은 토지 소유주들에게 공정한 재정적 보상을 지급"),
            ("structure performance-based incentive [ (     ) ] to retain elite sales executives", "핵심 영업 임원들의 이탈을 방지하기 위해 성과 기반 인센티브 급여 체계를 설계"),
            ("disburse statutory disability [ (     ) ] to injured manufacturing factory workers", "부상을 당한 공장 생산직 근로자들에게 법정 장애 보상금을 신속히 지급")
        ]
    },
    {
        "word": "feasibility",
        "phonetic": "/ˌfiː.zəˈbɪl.ə.t̬i/",
        "meaning": "실현 가능성, 타당성",
        "wrong": ["feasability", "fesibility", "feezibility"],
        "grammar": "feasible(실현 가능한)의 명사형으로 feas-i-bil-i-ty(-ibility)입니다.",
        "expl": "'타당성'은 feasibility입니다. '-ability'가 아닌 '-ibility'입니다.",
        "idioms": "feasibility study (타당성 조사), economic feasibility (경제적 타당성)",
        "predicates": [
            ("commission an independent economic [ (     ) ] study before building the subway line", "지하철 신규 노선 착공에 앞서 독립적인 경제적 타당성 조사를 전문 기관에 의뢰"),
            ("evaluate the technical [ (     ) ] of converting commercial fleets to hydrogen fuel", "상용차 운송 차량을 수소 연료 차량으로 전면 전환하는 기술적 실현 가능성을 평가"),
            ("assess the financial [ (     ) ] of constructing offshore wind turbine farms", "해상 풍력 발전 단지 건설에 소요되는 재정적 사업 타당성을 종합 검토"),
            ("present a comprehensive commercial [ (     ) ] report to venture capital investors", "벤처캐피털 투자자들에게 사업의 상업적 성공 타당성 보고서를 공식 보고")
        ]
    },
    {
        "word": "confidentiality",
        "phonetic": "/ˌkɑːn.fə.den.ʃiˈæl.ə.t̬i/",
        "meaning": "기밀성, 비밀 유지",
        "wrong": ["confidentialaty", "confidentality", "confidenciality"],
        "grammar": "confidential + ity 형태로 con-fi-den-ti-al-i-ty(-iality)입니다.",
        "expl": "'기밀성'은 confidentiality입니다. 'tial' 철자에 유의하세요.",
        "idioms": "strict confidentiality (엄격한 기밀성), non-disclosure and confidentiality (비밀유지)",
        "predicates": [
            ("enforce strict client data [ (     ) ] agreements across all legal departments", "모든 법무 부서에 걸쳐 엄격한 의뢰인 고객 정보 기밀 유지 협약의 이행을 강제"),
            ("require partner vendors to sign binding non-disclosure and [ (     ) ] contracts", "협력업체들이 법적 구속력을 지닌 비밀유지 및 보안 서약서에 서명하도록 의무화"),
            ("safeguard medical patient records under rigorous hospital [ (     ) ] protocols", "철저한 병원 보안 기밀성 프로토콜에 의거하여 환자의 의료 기록을 안전하게 보호"),
            ("maintain complete [ (     ) ] during high-stakes corporate merger negotiations", "중대한 기업 인수합병 협상이 진행되는 동안 전 과정의 철저한 비밀 유지를 준수")
        ]
    },
    {
        "word": "collaboration",
        "phonetic": "/kəˌlæb.əˈreɪ.ʃən/",
        "meaning": "협업, 공동 연구",
        "wrong": ["colaboration", "collaborasion", "colaburation"],
        "grammar": "l이 두 개(ll) 들어가는 명사로 col-lab-o-ra-tion입니다.",
        "expl": "'협업'은 collaboration입니다. l이 2개(ll) 들어갑니다.",
        "idioms": "close collaboration (긴밀한 협업), international collaboration (국제 공조)",
        "predicates": [
            ("foster cross-departmental [ (     ) ] to accelerate software product development", "소프트웨어 제품 개발 주기를 단축하기 위해 부서 간 긴밀한 유기적 협업을 촉진"),
            ("sign a joint research [ (     ) ] treaty between university labs and pharmaceutical firms", "대학 연구소와 글로벌 제약사 간의 공동 신약 개발 협업 협약을 체결"),
            ("praise the seamless operational [ (     ) ] between air freight and maritime logistics", "항공 화물과 해운 물류 시스템 간의 빈틈없는 운영 협업 체계를 높이 평가"),
            ("encourage multilateral diplomatic [ (     ) ] to combat international cybercrime networks", "초국가적 사이버 범죄 조직에 대응하기 위해 다자간 국제 사법 협업을 강화")
        ]
    },
    {
        "word": "perspective",
        "phonetic": "/pɚˈspek.tɪv/",
        "meaning": "관점, 시각, 전망",
        "wrong": ["prespective", "perspectiv", "pespective"],
        "grammar": "per(통하여) + spect(보다) 결합으로 per-spec-tive(per-)입니다.",
        "expl": "'관점'은 perspective입니다. 'pre-'가 아닌 'per-'로 시작합니다.",
        "idioms": "from a perspective (~의 관점에서), gain perspective (넓은 시각을 얻다)",
        "predicates": [
            ("evaluate consumer market feedback from a holistic global [ (     ) ]", "거시적인 글로벌 관점과 다각적 시각에서 소비자 시장 피드백을 종합 평가"),
            ("gain a broader historical [ (     ) ] on macroeconomic inflation cycles", "거시경제 인플레이션 순환 주기에 대한 더 넓고 깊은 역사적 시각을 습득"),
            ("incorporate diverse stakeholder viewpoints to enrich our corporate [ (     ) ]", "기업의 전략적 시각을 풍부하게 확장하기 위해 다양한 이해관계자의 시각을 수렴"),
            ("analyze potential supply chain vulnerabilities from an objective risk [ (     ) ]", "객관적인 위기관리 시각에서 공급망의 잠재적 취약 요소를 면밀히 진단")
        ]
    },
    {
        "word": "benchmark",
        "phonetic": "/ˈbentʃ.mɑːrk/",
        "meaning": "기준점, 벤치마크",
        "wrong": ["benchmarck", "benchmack", "benkmark"],
        "grammar": "bench + mark의 합성어로 k 앞에는 c가 붙지 않습니다.",
        "expl": "'기준점'은 benchmark입니다. 'ck'가 아닌 'k'입니다.",
        "idioms": "industry benchmark (업계 기준점), set a benchmark (새로운 기준을 세우다)",
        "predicates": [
            ("establish product energy efficiency as the gold standard [ (     ) ] for the industry", "제품의 에너지 효율성을 전체 산업계가 따라야 할 최고 수준의 기준점으로 정립"),
            ("compare factory production speed against the global manufacturing [ (     ) ]", "공장의 조립 생산 속도를 전 세계 동종 제조업체들의 최고 벤치마크 지표와 비교"),
            ("adopt leading fintech security protocols as our operational safety [ (     ) ]", "선도적인 핀테크 보안 규정을 우리 회사의 운영 안전성 핵심 기준점으로 채택"),
            ("set a new customer satisfaction [ (     ) ] that competitors strive to match", "경쟁사들이 도달하고자 열망하는 탁월한 고객 만족도 신기록 기준점을 달성")
        ]
    },
    {
        "word": "compliance",
        "phonetic": "/kəmˈplaɪ.əns/",
        "meaning": "규정 준수, 준법 감시",
        "wrong": ["complience", "complianse", "conpliance"],
        "grammar": "comply의 파생 명사로 com-pli-ance(-ance)입니다.",
        "expl": "'규정 준수'는 compliance입니다. '-ence'가 아닌 '-ance'입니다.",
        "idioms": "regulatory compliance (규제 준수), in compliance with (~에 부합하여)",
        "predicates": [
            ("conduct mandatory annual anti-money laundering [ (     ) ] audits across all bank branches", "모든 은행 지점을 대상으로 필수 연례 자금세탁방지 준법 감시 감사를 철저히 실시"),
            ("ensure complete regulatory [ (     ) ] with new international carbon emission laws", "새롭게 발효된 국제 탄소 배출 규제 법안에 대한 완벽한 준법 규정 준수를 확보"),
            ("appoint a seasoned legal expert as the corporate chief [ (     ) ] officer", "노련한 법률 전문가를 기업 최고 준법 감시 책임자(CCO)로 공식 선임"),
            ("verify software vendor [ (     ) ] with open-source licensing guidelines", "오픈소스 소프트웨어 라이선스 가이드라인에 대한 외부 개발사의 규정 준수 여부를 검증")
        ]
    },
    {
        "word": "milestone",
        "phonetic": "/ˈmaɪl.stoʊn/",
        "meaning": "이정표, 중대 시점",
        "wrong": ["mileston", "milestonee", "maylstone"],
        "grammar": "mile + stone의 합성어로 m-i-l-e-s-t-o-n-e입니다.",
        "expl": "'이정표'는 milestone입니다. 끝에 'e'가 들어갑니다.",
        "idioms": "reach a milestone (이정표에 도달하다), historic milestone (역사적 마일스톤)",
        "predicates": [
            ("celebrate reaching ten million active monthly app users as a historic [ (     ) ]", "월간 활성 이용자 1,000만 명 돌파를 회사 성장의 역사적인 중대 이정표로 축하"),
            ("track every deliverable scheduled under the infrastructure construction [ (     ) ] roadmap", "사회기반시설 건설 마일스톤 로드맵에 예정된 모든 단계별 산출물을 추적 관리"),
            ("mark the successful completion of phase one clinical trials as a major [ (     ) ]", "신약 1상 임상시험의 성공적인 마무리를 바이오 연구의 핵심적인 이정표로 기록"),
            ("announce the company's hundredth consecutive profitable quarter as a proud [ (     ) ]", "100분기 연속 흑자 달성이라는 놀라운 성과를 기업 역사상 자랑스러운 이정표로 공표")
        ]
    },
    {
        "word": "restructuring",
        "phonetic": "/ˌriːˈstrʌk.tʃɚ.ɪŋ/",
        "meaning": "구조조정",
        "wrong": ["restructering", "restructring", "restructuing"],
        "grammar": "re + structure + ing 결합으로 re-struc-tur-ing입니다.",
        "expl": "'구조조정'은 restructuring입니다. 'tur-' 모음 철자에 유의하세요.",
        "idioms": "corporate restructuring (기업 구조조정), organizational restructuring (조직 개편)",
        "predicates": [
            ("undertake comprehensive corporate [ (     ) ] to eliminate unprofitable business units", "수익성이 저조한 사업 부문을 과감히 정리하기 위해 전면적인 기업 구조조정을 단행"),
            ("manage the strategic debt [ (     ) ] program to restore balance sheet solvency", "재무제표의 지급 능력을 회복하기 위해 전략적 채무 구조조정 프로그램을 가동"),
            ("support impacted personnel with outplacement packages during organizational [ (     ) ]", "조직 구조조정 기간 동안 영향을 받는 인력들에게 전직 지원 패키지를 적극 제공"),
            ("streamline administrative layers through agile managerial [ (     ) ]", "민첩한 경영 구조조정을 단행하여 중복된 행정 관리 계층을 대폭 간소화")
        ]
    },
    {
        "word": "expenditure",
        "phonetic": "/ɪkˈspen.də.tʃɚ/",
        "meaning": "지출, 비용",
        "wrong": ["expendature", "expenditer", "expendatur"],
        "grammar": "ex-pen-di-ture 철자이며, di-ture(-ture)에 유의합니다.",
        "expl": "'지출'은 expenditure입니다. '-dature'가 아닌 '-diture'입니다.",
        "idioms": "capital expenditure (자본적 지출), military expenditure (군사비 지출)",
        "predicates": [
            ("curb excessive discretionary marketing [ (     ) ] during periods of economic downturn", "경기 침체 국면 동안 불필요한 재량적 마케팅 비용 지출을 강력히 억제"),
            ("authorize capital equipment [ (     ) ] to modernize the automated semiconductor plant", "반도체 자동화 생산 라인을 현대화하기 위한 대규모 자본 장비 설비 지출을 승인"),
            ("audit all official travel and entertainment [ (     ) ] reports for fiscal integrity", "재정적 투명성을 담보하기 위해 모든 임직원 출장 및 업무 접대비 지출 내역을 감사"),
            ("increase annual government research [ (     ) ] to support renewable green technologies", "친환경 청정 기술 개발을 지원하기 위해 정부의 연간 연구개발 예산 지출을 증액")
        ]
    },
    {
        "word": "allocation",
        "phonetic": "/ˌæl.əˈkeɪ.ʃən/",
        "meaning": "배분, 할당",
        "wrong": ["alocation", "allocasion", "allocution"],
        "grammar": "l이 두 개(ll) 들어가는 명사로 al-lo-ca-tion입니다.",
        "expl": "'배분'은 allocation입니다. l이 2개(ll) 들어갑니다.",
        "idioms": "asset allocation (자산 배분), resource allocation (자원 할당)",
        "predicates": [
            ("optimize strategic budget [ (     ) ] across regional research facilities", "지방 연구 시설 전반에 걸친 전략적 예산 재원 배분을 최적화"),
            ("diversify institutional asset [ (     ) ] to hedge against unexpected currency devaluations", "예기치 않은 환율 급변동 위험을 분산하기 위해 기관 자산 배분을 다각화"),
            ("ensure fair vaccine supply [ (     ) ] to vulnerable rural healthcare clinics", "의료 취약지인 농어촌 보건소에 백신 공급 물량을 공정하게 배분"),
            ("rebalance server resource [ (     ) ] to handle peak holiday shopping traffic surges", "휴일 쇼핑 트래픽 폭증에 대비하여 클라우드 서버 자원 할당량을 유연하게 재조정")
        ]
    },
    {
        "word": "contingency",
        "phonetic": "/kənˈtɪn.dʒən.si/",
        "meaning": "비상사태, 우발 사태",
        "wrong": ["contingansy", "contingensy", "contingancy"],
        "grammar": "con-tin-gen-cy 철자이며, -ency 접미사 형태입니다.",
        "expl": "'우발 사태'는 contingency입니다. '-ancy'가 아닌 '-ency'입니다.",
        "idioms": "contingency plan (비상 대응 계획), contingency fund (비상 예비비)",
        "predicates": [
            ("formulate a rigorous operational [ (     ) ] plan to withstand sudden energy blackouts", "돌발적인 대규모 정전 사태에 견딜 수 있도록 치밀한 운영 비상 대응 계획을 수립"),
            ("reserve emergency liquidity in a dedicated [ (     ) ] fund for macroeconomic shocks", "거시경제 충격에 대비하여 전용 비상 예비비 펀드에 비상 유동성을 사전 비축"),
            ("drill emergency evacuation teams on industrial fire [ (     ) ] procedures", "산업 현장 화재 등 비상사태 대응 절차에 맞춰 긴급 대피팀 훈련을 반복 실시"),
            ("prepare alternative transport supply chains as a critical geopolitical [ (     ) ] measure", "지정학적 리스크 발발에 대비한 결정적 비상 대책으로 대체 운송 공급망을 구축")
        ]
    },
    {
        "word": "liquidation",
        "phonetic": "/ˌlɪk.wəˈdeɪ.ʃən/",
        "meaning": "청산, 매각",
        "wrong": ["liquidasion", "liquadation", "liquidetion"],
        "grammar": "liquidate의 파생 명사로 li-qui-da-tion입니다.",
        "expl": "'청산'은 liquidation입니다. 'qui' 뒤에 'dation'이 옵니다.",
        "idioms": "forced liquidation (강제 청산), assets liquidation (자산 매각 청산)",
        "predicates": [
            ("supervise the orderly corporate [ (     ) ] of the insolvent retail chain", "파산한 유통 체인 기업의 질서 있는 파산 청산 절차를 철저히 감독"),
            ("auction surplus commercial real estate through rapid asset [ (     ) ] proceedings", "신속한 부실 자산 매각 청산 절차를 통해 유휴 상업용 부동산을 경매 처분"),
            ("protect senior creditor claims during bankruptcy [ (     ) ] proceedings in court", "법원 회생 파산 청산 재판 과정에서 선순위 채권자의 권리를 합법적으로 보호"),
            ("prevent distress asset fire sales by avoiding hasty collateral [ (     ) ]", "성급한 담보 자산의 강제 청산을 방지함으로써 부실 자산의 헐값 매각을 차단")
        ]
    },
    {
        "word": "stakeholder",
        "phonetic": "/ˈsteɪkˌhoʊl.dɚ/",
        "meaning": "이해관계자",
        "wrong": ["stakeholdar", "steakeholder", "stakehoulder"],
        "grammar": "stake + holder 합성어로 s-t-a-k-e-h-o-l-d-e-r입니다.",
        "expl": "'이해관계자'는 stakeholder입니다. 'steak'가 아닌 'stake'입니다.",
        "idioms": "key stakeholder (핵심 이해관계자), stakeholder engagement (이해관계자 참여)",
        "predicates": [
            ("convene a consultative forum to solicit [ (     ) ] feedback on urban development", "도시 개발 사업과 관련하여 광범위한 이해관계자 피드백을 수렴하는 자문 포럼을 소집"),
            ("balance shareholder profit expectations with broad community [ (     ) ] interests", "주주의 단기 수익 기대치와 지역사회 전체 이해관계자의 권익을 조화롭게 절충"),
            ("publish an annual sustainability report demonstrating proactive [ (     ) ] engagement", "적극적인 대외 이해관계자 소통과 참여를 입증하는 연례 지속가능경영 보고서를 발간"),
            ("mediate competing demands raised by internal and external [ (     ) ] groups", "사내외 다양한 이해관계자 집단이 제기하는 상충된 요구사항들을 지혜롭게 중재")
        ]
    },
    {
        "word": "authorization",
        "phonetic": "/ˌɑː.θɚ.əˈzeɪ.ʃən/",
        "meaning": "승인, 인가",
        "wrong": ["authorisasion", "authorazation", "authorizasion"],
        "grammar": "authorize + ation 형태로 au-thor-i-za-tion입니다.",
        "expl": "'승인'은 authorization입니다. 'author-' 뒤에 'ization'입니다.",
        "idioms": "official authorization (공식 인가), require authorization (승인이 필요하다)",
        "predicates": [
            ("obtain formal regulatory [ (     ) ] from the health ministry prior to clinical sales", "시판 전 보건 당국으로부터 신약 판매에 대한 공식 인가 및 승인을 취득"),
            ("restrict sensitive network server access to personnel with multi-factor [ (     ) ]", "다중 인증 승인 절차를 통과한 필수 보안 인력에게만 민감 서버 접근을 허가"),
            ("require prior written managerial [ (     ) ] before initiating large capital purchases", "대규모 자본재 구매 계약을 체결하기 전에 경영진의 사전 서면 승인을 의무화"),
            ("revoke compromised administrator access [ (     ) ] immediately following a data breach", "데이터 침해 사고 발생 즉시 유출된 관리자 접근 승인 권한을 전격 박탈")
        ]
    },
    {
        "word": "verification",
        "phonetic": "/ˌver.ə.fəˈkeɪ.ʃən/",
        "meaning": "검증, 확인",
        "wrong": ["verificasion", "verafication", "verificating"],
        "grammar": "verify + ation 형태로 ver-i-fi-ca-tion입니다.",
        "expl": "'검증'은 verification입니다. 'vera-'가 아닌 'veri-'입니다.",
        "idioms": "identity verification (신원 확인), independent verification (독립적 검증)",
        "predicates": [
            ("implement biometric fingerprint [ (     ) ] for secure mobile banking transactions", "모바일 금융 뱅킹 거래의 완벽한 보안을 위해 생체 지문 인증 검증 체계를 도입"),
            ("demand independent laboratory [ (     ) ] of all zero-emission vehicle test results", "모든 무공해 친환경 차량의 배출가스 시험 결과에 대해 공인 기관의 독립적 검증을 요구"),
            ("subject new aerospace titanium alloys to rigorous stress [ (     ) ] tests", "새로운 항공우주용 티타늄 합금을 극한의 강도 및 내구성 실증 검증 시험에 회부"),
            ("complete formal credential [ (     ) ] before certifying medical residency applicants", "전공의 지원자를 최종 선발하기 전에 공식 학위 및 자격 이력 검증 절차를 완료")
        ]
    },
    {
        "word": "profitability",
        "phonetic": "/ˌprɑː.fə.t̬əˈbɪl.ə.t̬i/",
        "meaning": "수익성",
        "wrong": ["profitibility", "profitabelity", "profitabillity"],
        "grammar": "profitable + ity 결합으로 pro-fit-a-bil-i-ty(-ability)입니다.",
        "expl": "'수익성'은 profitability입니다. '-ibility'가 아닌 '-ability'입니다.",
        "idioms": "boost profitability (수익성을 끌어올리다), long-term profitability (장기적 수익성)",
        "predicates": [
            ("improve overall operating [ (     ) ] through rigorous lean manufacturing practices", "군더더기 없는 린 제조 공정 혁신을 통해 회사의 전반적인 영업 수익성을 획기적으로 개선"),
            ("calculate projected return on investment to ensure adequate capital [ (     ) ]", "적정 수준의 투자 수익성을 담보하기 위해 예상 투자자본수익률(ROI)을 정밀 산출"),
            ("divest chronically unprofitable product lines to protect corporate net [ (     ) ]", "기업의 순수익성을 방어하기 위해 만성 적자에 시달리는 비핵심 제품 라인을 과감히 매각"),
            ("forecast next year's corporate margin expansion and commercial [ (     ) ] trends", "내년도 기업의 마진율 확대 폭과 상업적 수익성 개선 추세를 정밀 전망")
        ]
    },
    {
        "word": "negotiation",
        "phonetic": "/nəˌɡoʊ.ʃiˈeɪ.ʃən/",
        "meaning": "협상, 절충",
        "wrong": ["negosiation", "negotiatione", "negociasion"],
        "grammar": "ne-go-ti-a-tion 철자이며, ti가 'sh' 소리를 냅니다.",
        "expl": "'협상'은 negotiation입니다. 'si'나 'ci'가 아닌 'ti'(tiation)입니다.",
        "idioms": "enter into negotiations (협상에 착수하다), tough negotiations (난항을 겪는 협상)",
        "predicates": [
            ("enter into intense bilateral trade [ (     ) ] to reduce cross-border tariff barriers", "국경 간 관세 장벽을 낮추기 위해 치열한 양자 무역 통상 협상 테이블에 착수"),
            ("lead strategic contract [ (     ) ] with enterprise software enterprise vendors", "기업용 소프트웨어 핵심 공급사들과 유리한 전략적 라이선스 계약 협상을 주도"),
            ("resolve contentious labor dispute terms through patient and constructive [ (     ) ]", "인내심 있고 건설적인 대화와 협상을 통해 첨예한 노사 갈등 쟁점을 평화적으로 타결"),
            ("maintain calm diplomatic tact during complex international border [ (     ) ] sessions", "복잡한 국제 국경 획정 협상 회담 동안 냉철하고 노련한 외교적 기지를 발휘")
        ]
    },
    {
        "word": "procurement",
        "phonetic": "/prəˈkjʊr.mənt/",
        "meaning": "조달, 구매",
        "wrong": ["procurment", "procuerment", "procurmant"],
        "grammar": "procure(조달하다) + ment 결합으로 pro-cure-ment입니다.",
        "expl": "'조달'은 procurement입니다. 'e'를 빠뜨려 'procurment'로 쓰지 마세요.",
        "idioms": "defense procurement (방위력 조달), green procurement (친환경 조달)",
        "predicates": [
            ("streamline defense weapon system [ (     ) ] to deliver equipment to the frontline faster", "최전방 부대에 군사장비를 신속히 보급하기 위해 방위 무기 체계 조달 절차를 간소화"),
            ("enforce sustainable green [ (     ) ] policies for all office equipment and furniture", "모든 사무용 기기 및 가구 구매 시 친환경 지속가능 조달 정책을 엄격히 적용"),
            ("digitize the corporate vendor [ (     ) ] pipeline to ensure transparent bidding", "투명하고 공정한 입찰 경쟁을 보장하기 위해 기업의 협력사 조달 파이프라인을 전면 디지털화"),
            ("diversify raw semiconductor material [ (     ) ] channels to hedge geopolitical embargoes", "지정학적 금수 조치 위험을 분산하기 위해 반도체 원자재 조달 수급 채널을 다변화")
        ]
    },
    {
        "word": "delegation",
        "phonetic": "/ˌdel.əˈɡeɪ.ʃən/",
        "meaning": "위임, 대표단",
        "wrong": ["delegasion", "delagation", "delegatian"],
        "grammar": "delegate + ion 형태로 del-e-ga-tion(모음 e)입니다.",
        "expl": "'위임, 대표단'은 delegation입니다. 'del-a-'가 아닌 'del-e-'입니다.",
        "idioms": "effective delegation (효과적인 권한 위임), trade delegation (무역 대표단)",
        "predicates": [
            ("practice effective authority [ (     ) ] to empower regional branch project directors", "지역 지사 프로젝트 책임자들의 자율성을 극대화하기 위해 효과적인 권한 위임을 실천"),
            ("send a high-level trade [ (     ) ] to explore bilateral industrial energy partnerships", "양국 간 산업 에너지 파트너십 확대를 모색하기 위해 고위급 경제 무역 대표단을 파견"),
            ("host the international diplomatic [ (     ) ] at the presidential reception center", "대통령 공식 영빈관에서 각국에서 방문한 국제 외교 사절 대표단을 성대히 영접"),
            ("encourage managerial task [ (     ) ] so senior executives focus on long-term strategy", "최고경영진이 장기 경영 전략에 집중할 수 있도록 실무 과업의 효율적 하부 위임을 장려")
        ]
    },
    {
        "word": "diversification",
        "phonetic": "/daɪˌvɝː.sə.fəˈkeɪ.ʃən/",
        "meaning": "다각화, 다양화",
        "wrong": ["diversificasion", "divercification", "diversafication"],
        "grammar": "diversify + ation 형태로 di-ver-si-fi-ca-tion입니다.",
        "expl": "'다각화'는 diversification입니다. 'ver-si-' 철자에 유의하세요.",
        "idioms": "product diversification (제품 다각화), portfolio diversification (포트폴리오 다변화)",
        "predicates": [
            ("pursue aggressive revenue [ (     ) ] to reduce dependence on legacy software sales", "기존 구형 소프트웨어 매출에 대한 의존도를 낮추기 위해 공격적인 수익 구조 다각화를 추진"),
            ("implement institutional portfolio [ (     ) ] across global real estate and bonds", "글로벌 부동산과 채권 등 다양한 자산군 전반에 걸쳐 기관 포트폴리오 분산 다각화를 실행"),
            ("accelerate supply chain [ (     ) ] away from high-tariff international manufacturing hubs", "고율 관세가 부과되는 특정 해외 제조 거점에서 벗어나 공급망 수급 다각화를 가속화"),
            ("expand company market [ (     ) ] by introducing sustainable consumer lifestyle products", "친환경 라이프스타일 소비재 신제품을 선보임으로써 회사의 시장 포트폴리오를 다각화")
        ]
    },
    {
        "word": "productivity",
        "phonetic": "/ˌproʊ.dʌkˈtɪv.ə.t̬i/",
        "meaning": "생산성",
        "wrong": ["productivaty", "productivty", "productevity"],
        "grammar": "productive + ity 형태로 pro-duc-tiv-i-ty입니다.",
        "expl": "'생산성'은 productivity입니다. 'tiv-' 뒤에 'ity'입니다.",
        "idioms": "boost productivity (생산성을 증대시키다), labor productivity (노동 생산성)",
        "predicates": [
            ("boost employee workplace [ (     ) ] by deploying modern collaborative software suites", "현대적인 협업 소프트웨어를 도입하여 임직원의 업무 생산성을 비약적으로 향상"),
            ("measure national labor [ (     ) ] gains achieved through advanced factory robotics", "첨단 산업용 로봇 도입을 통해 달성된 국가 제조업의 노동 생산성 증가율을 측정"),
            ("optimize farm agricultural [ (     ) ] using satellite soil moisture monitoring technology", "위성 토양 수분 모니터링 기술을 활용하여 친환경 농업의 단위 면적당 생산성을 극대화"),
            ("streamline administrative workflows to eliminate bottlenecks and increase office [ (     ) ]", "업무 병목 현상을 해소하고 사무실 전반의 생산성을 높이기 위해 관리 워크플로를 최적화")
        ]
    },
    {
        "word": "transparency",
        "phonetic": "/trænˈsper.ən.si/",
        "meaning": "투명성",
        "wrong": ["transparancy", "transperency", "transparansy"],
        "grammar": "trans-par-en-cy 철자이며, -ancy가 아닌 -ency입니다.",
        "expl": "'투명성'은 transparency입니다. '-ancy'가 아닌 '-ency'임에 주의하세요.",
        "idioms": "financial transparency (재정적 투명성), ensure transparency (투명성을 확보하다)",
        "predicates": [
            ("champion financial reporting [ (     ) ] by disclosing audited accounts to investors", "감사받은 재무회계 장부를 투자자들에게 투명하게 공개하여 경영 투명성을 선도"),
            ("enhance supply chain [ (     ) ] through end-to-end blockchain product tracing", "엔드투엔드 블록체인 정밀 추적 기술을 통해 공급망 전체의 투명성을 대폭 강화"),
            ("insist on complete administrative [ (     ) ] in public university admissions decisions", "국공립 대학교 입학 전형 사정 과정의 완전하고 공정한 행정적 투명성을 엄격히 요구"),
            ("publish municipal spending data online to guarantee public tax [ (     ) ]", "시민의 세금 집행에 대한 투명성을 보장하기 위해 지자체 재정 지출 데이터를 온라인에 공개")
        ]
    }
]

def build_level5_questions():
    questions = []
    start_id = 19001
    q_counter = 0

    for cycle in range(40):
        frame_idx = cycle // 4  # 0..9
        pred_idx = cycle % 4    # 0..3
        frame_en, frame_ko = FRAMES_LVL5[frame_idx]

        for item in RAW_WORDS_LVL5:
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
    qs = build_level5_questions()
    print(f"Level 5 generated {len(qs)} questions successfully.")
    print("Sample question 1:", json.dumps(qs[0], ensure_ascii=False, indent=2))
    print("Sample question 1000:", json.dumps(qs[-1], ensure_ascii=False, indent=2))
