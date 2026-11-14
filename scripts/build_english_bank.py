# -*- coding: utf-8 -*-
"""
Master Builder for ENGLISH_QUESTION_BANK (english_questions.js)
Combines all 5 levels (IDs 15001 ~ 20000, 1,000 per level = 5,000 questions).
Zero generic meta-templates! 100% semantic deduction!
"""

import os
import json
from gen_english_lvl1 import build_level1_questions
from gen_english_lvl2 import build_level2_questions
from gen_english_lvl3 import build_level3_questions
from gen_english_lvl4 import build_level4_questions
from gen_english_lvl5 import build_level5_questions

def build_english_bank():
    print("Generating Level 1 (초등/기초)...")
    lvl1 = build_level1_questions()
    print("Generating Level 2 (중등/필수)...")
    lvl2 = build_level2_questions()
    print("Generating Level 3 (고등/심화)...")
    lvl3 = build_level3_questions()
    print("Generating Level 4 (수능/기출)...")
    lvl4 = build_level4_questions()
    print("Generating Level 5 (일반/실무)...")
    lvl5 = build_level5_questions()

    all_questions = lvl1 + lvl2 + lvl3 + lvl4 + lvl5
    print(f"Total English questions combined: {len(all_questions)}")
    assert len(all_questions) == 5000, f"Expected 5000, got {len(all_questions)}"

    LEVEL_PROMPTS_ENGLISH = {
        "초등/기초": "문장을 읽고 빈칸에 들어갈 알맞은 영어 단어를 골라보세요.",
        "중등/필수": "다음 영어 문장의 빈칸에 들어갈 올바른 철자의 영단어를 고르세요.",
        "고등/심화": "문맥상 빈칸에 가장 적절한 어휘의 올바른 영문 철자를 고르세요.",
        "수능/기출": "다음 수능 지문 문맥의 빈칸에 들어갈 가장 적절한 영어 어휘를 고르세요.",
        "일반/실무": "다음 비즈니스 실무 문맥의 빈칸에 들어갈 올바른 영어 어휘를 고르세요."
    }

    # Schema integrity check & level-appropriate question prompt assignment
    seen_ids = set()
    for idx, q in enumerate(all_questions):
        expected_id = 15001 + idx
        assert q["id"] == expected_id, f"ID mismatch at index {idx}: {q['id']} vs {expected_id}"
        assert q["id"] not in seen_ids, f"Duplicate ID: {q['id']}"
        seen_ids.add(q["id"])

        q_num = q["id"] - 15000
        prompt_prefix = LEVEL_PROMPTS_ENGLISH.get(q["level"], "다음 영어 문장의 빈칸에 들어갈 올바른 철자의 단어를 고르세요.")
        q["question"] = f"{prompt_prefix} (문항 #{q_num})"

        assert len(q["options"]) == 4, f"Options length != 4 at ID {q['id']}"
        assert len(set(q["options"])) == 4, f"Duplicate options at ID {q['id']}: {q['options']}"
        assert 0 <= q["answerIndex"] < 4, f"Invalid answerIndex at ID {q['id']}"
        assert q["options"][q["answerIndex"]] == q["englishWord"], f"Answer mismatch at ID {q['id']}"
        assert "[ (     ) ]" in q["sentence"], f"Sentence missing blank at ID {q['id']}"
        assert " / " not in q["sentence"], f"Slash comparison present at ID {q['id']}"
        assert q["sentenceTranslation"], f"Missing translation at ID {q['id']}"
        assert q["grammar"] and q["meaning"], f"Missing grammar/meaning at ID {q['id']}"

    output_path = os.path.join(os.path.dirname(__file__), "..", "english_questions.js")
    
    header = """/**
 * 하루맞춤 (Haru Matchum) - 영어 스펠링 및 어휘 문제은행 데이터베이스 (총 5,000문항)
 * 단계별(5개 레벨) 각 1,000문항 완전 분배 & 4지선다 [ (     ) ] 표준 빈칸 100% 준수
 * 네이버 영어사전 딥링크 & 문장 한글 번역, 핵심 숙어, 발음기호 및 영문법 포인트 연동
 */

const ENGLISH_QUESTION_BANK = """

    footer = """;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ENGLISH_QUESTION_BANK };
}
"""

    print("Serializing JSON data...")
    json_body = json.dumps(all_questions, ensure_ascii=False, indent=2)

    print(f"Writing to {output_path}...")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write(json_body)
        f.write(footer)

    file_size = os.path.getsize(output_path)
    print(f"Successfully generated english_questions.js! File size: {file_size:,} bytes")

if __name__ == "__main__":
    build_english_bank()
