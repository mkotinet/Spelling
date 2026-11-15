// korean_grammar_validator.js
// Korean Sentence Integrity & Grammar Validation Engine for Haru Matchum
// Inspired by korean-spell-check, grammar-checker & humanize-korean principles

/**
 * Validates whether filling the question's answer into the blank results in a
 * natural, fluent, and grammatically correct Korean sentence.
 * 
 * Rules:
 * 1. Base Form before Noun (관형사형 필수): An uninflected base verb/adjective (-다) directly preceding a noun is invalid.
 * 2. Base Form before Auxiliary Verb (보조용언 연결어미 필수): Base form directly before '보았다', '있었다', etc. is invalid.
 * 3. Mid-sentence Dangling Base Form (접속/원인 연결어미 필수): Base form connecting to another clause without -어서/-아서/-고 is invalid.
 * 4. Quoted Citation for Proverbs before '격이다' (인용 부호 표준): Proverbs before '격이다' must be in quotes.
 */
function validateSentenceIntegrity(question) {
  const errors = [];
  let detectedRule = null;

  if (!question || !question.sentence || !Array.isArray(question.options)) {
    return {
      valid: false,
      isValid: false,
      errors: ['질문 형식 불일치'],
      rule: '형식 불일치',
      filledSentence: '',
      completedSentence: ''
    };
  }

  const ansIndex = typeof question.answerIndex === 'number' ? question.answerIndex : 0;
  const answer = question.options[ansIndex];
  if (typeof answer !== 'string') {
    return {
      valid: false,
      isValid: false,
      errors: ['정답 선택지가 유효한 문자열이 아님'],
      rule: '정답 형식 불일치',
      filledSentence: '',
      completedSentence: ''
    };
  }

  const blankRegex = /\[\s*\(\s*\)\s*\]|\(\s*\?\s*\)|\(\s*\)/;
  if (!blankRegex.test(question.sentence)) {
    return {
      valid: false,
      isValid: false,
      errors: ['문장 내 빈칸 표시[ (     ) ] 누락'],
      rule: '빈칸 누락',
      filledSentence: question.sentence,
      completedSentence: question.sentence
    };
  }

  const filledSentence = question.sentence.replace(blankRegex, answer).trim();

  // Rule 4: Proverbs before '격이다' without quotes
  if (question.sentence.includes('[ (     ) ] 격이다') || question.sentence.includes('(     ) 격이다') || question.sentence.includes('( ? ) 격이다')) {
    errors.push("속담/격언 인용 뒤 '격이다' 연결 시 따옴표 '[ (     ) ]' 누락으로 인한 비문");
    detectedRule = 'Rule 4: 속담 인용 부호 누락 비문';
  }

  // Check mid-sentence blank position
  const isEndBlank = /\[\s*\(\s*\)\s*\]\s*[\.\?!]?\s*$/.test(question.sentence);
  if (!isEndBlank && typeof answer === 'string' && answer.endsWith('다')) {
    // Exempt adverbs like '들입다'
    if (answer !== '들입다') {
      const matchAfter = question.sentence.match(/(?:\[\s*\(\s*\)\s*\]|\(\s*\?\s*\)|\(\s*\))\s*([가-힣]+)/);
      if (matchAfter) {
        const after = matchAfter[1];
        const isQuotedOrAllowedConnective = after.startsWith('라고') || after.startsWith('고') || after.startsWith('며') || after.startsWith('는');

        if (!isQuotedOrAllowedConnective) {
          // Rule 2: Auxiliary verbs (보았다, 있었다, 두었다 등)
          const isAuxiliary = ['보았다', '보다', '있었다', '있다', '두었다', '놓았다', '주었다', '버렸다', '싶다', '싶었다'].includes(after);
          if (isAuxiliary) {
            errors.push(`보조용언 '${after}' 앞 빈칸에 기본형 '${answer}' 결합으로 비문 발생 (연결어미 -어/-아/-고 필요)`);
            detectedRule = 'Rule 2: 보조용언 앞 용언 기본형(-다) 결합 비문';
          } else {
            // Rule 1 & 3: Base form before noun or connecting to another clause
            errors.push(`문장 중간 빈칸에 용언 기본형 '${answer}' 결합 후 '${after}'와 단절되어 비문 발생 (관형사형 또는 연결어미 필요)`);
            detectedRule = after.match(/^[가-힣]{1,4}(?:이|가|을|를|과|와|의|에|은|는)?$/) && !['후', '때', '곳', '중'].includes(after)
              ? 'Rule 1: 체언 앞 용언 기본형(-다) 결합 비문'
              : 'Rule 3: 접속/원인 부사절 기본형(-다) 결합 비문';
          }
        }
      }
    }
  }

  const isValid = errors.length === 0;

  return {
    valid: isValid,
    isValid,
    errors,
    rule: detectedRule,
    filledSentence,
    completedSentence: filledSentence
  };
}

/**
 * Validates an entire question bank for grammar integrity
 */
function validateBank(bankName, questions) {
  let validCount = 0;
  const errorItems = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const res = validateSentenceIntegrity(q);
    if (res.valid) {
      validCount++;
    } else {
      errorItems.push({
        index: i,
        id: q.id,
        errors: res.errors,
        sentence: q.sentence,
        answer: q.options[q.answerIndex || 0],
        filled: res.filledSentence
      });
    }
  }

  return {
    bankName,
    total: questions.length,
    validCount,
    errorCount: errorItems.length,
    errorItems
  };
}

/**
 * General helper to check Korean sentence grammar directly
 */
function checkKoreanSentenceGrammar(sentenceWithAnswer) {
  if (!sentenceWithAnswer || typeof sentenceWithAnswer !== 'string') {
    return { valid: false, errors: ['유효하지 않은 문장'] };
  }
  const fakeQ = {
    sentence: `[ (     ) ] ${sentenceWithAnswer}`,
    options: ['테스트'],
    answerIndex: 0
  };
  return validateSentenceIntegrity(fakeQ);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateSentenceIntegrity,
    validateBank,
    checkKoreanSentenceGrammar
  };
}
