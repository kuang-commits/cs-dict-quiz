import { CATEGORIES } from '../src/data/categories';
import { questions, questionsForCategory } from '../src/data/questions';
import { terms } from '../src/data/terms';
import { applyAnswer, emptyProgress } from '../src/state/logic';
import type { CategoryId } from '../src/types';

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

check(terms.length >= 80, `术语不足 80，实际 ${terms.length}`);
check(questions.length >= 150, `题目不足 150，实际 ${questions.length}`);
check(questions.length === terms.length * 3, '每个术语应有 3 道题');

const english = new Set<string>();
const chinese = new Set<string>();
const ids = new Set<string>();
for (const term of terms) {
  check(!ids.has(term.id), `重复 id ${term.id}`);
  ids.add(term.id);
  check(!english.has(term.english), `重复英文 ${term.english}`);
  english.add(term.english);
  check(!chinese.has(term.chinese), `重复中文 ${term.chinese}`);
  chinese.add(term.chinese);
  check(term.example.includes(term.english), `${term.id} 的例句没有包含英文`);
  check(term.pronunciation.length > 0 && term.explanation.length > 0, `${term.id} 内容不完整`);
  const occurrences = term.example.split(term.english).length - 1;
  check(occurrences === 1, `${term.id} 的例句应只出现一次英文，实际 ${occurrences}`);
}

for (const category of CATEGORIES) {
  const count = terms.filter((term) => term.category === category.id).length;
  check(count >= 8, `${category.name} 术语太少：${count}`);
}

for (const question of questions) {
  check(question.options.length === 4, `${question.id} 选项不是 4 个`);
  check(new Set(question.options).size === 4, `${question.id} 选项重复`);
  check(question.answerIndex >= 0 && question.answerIndex < 4, `${question.id} 答案下标非法`);
  const term = terms.find((item) => item.id === question.termId);
  check(term, `${question.id} 找不到术语`);
  if (!term) continue;
  const expected = question.type === 'en-to-zh' ? term.chinese : term.english;
  check(question.options[question.answerIndex] === expected, `${question.id} 正确答案不匹配`);
  if (question.type === 'fill-in') {
    check(question.prompt.includes('____'), `${question.id} 填空题没有空格`);
    check(!question.prompt.includes(term.english), `${question.id} 填空题提前露出答案`);
  }
  if (question.type === 'en-to-zh') {
    check(!question.options.some((option, index) => index !== question.answerIndex && option === term.chinese), '干扰项撞答案');
  }
}

const network = questionsForCategory('network' as CategoryId);
check(network[0]?.id === 'http:en-to-zh', '网络第一章第一题应为 HTTP 英文选义');
check(network[1]?.id === 'http:zh-to-en', '网络第二题应为 HTTP 中文选词');
check(network[2]?.id === 'http:fill-in', '网络第三题应为 HTTP 填空');

const sample = network[1];
let state = emptyProgress();
state = applyAnswer(state, sample, (sample.answerIndex + 1) % 4, 'chapter').state;
check(state.wrongs[sample.id]?.correctRetries === 0, '答错后应进入错题本');
const before = state.wrongs[sample.id];
state = applyAnswer(state, sample, sample.answerIndex, 'chapter').state;
check(state.wrongs[sample.id]?.correctRetries === before.correctRetries, '章节里答对不应移出错题');
state = applyAnswer(state, sample, sample.answerIndex, 'wrong').state;
check(state.wrongs[sample.id]?.correctRetries === 1, '错题本答对一次应记 1');
state = applyAnswer(state, sample, (sample.answerIndex + 1) % 4, 'wrong').state;
check(state.wrongs[sample.id]?.correctRetries === 0, '再答错应清零');
state = applyAnswer(state, sample, sample.answerIndex, 'wrong').state;
state = applyAnswer(state, sample, sample.answerIndex, 'wrong').state;
check(!state.wrongs[sample.id], '连续做对 2 次后应移出');
check(state.learnedTermIds.includes(sample.termId), '答对后应记入已学');
check(state.streak === 1, '当天首次作答应开始连续学习');

console.log(`术语 ${terms.length}，题目 ${questions.length}`);
console.log('错题本规则校验通过');
for (const question of network.slice(0, 3)) {
  console.log(
    question.id,
    '答案',
    question.answerIndex,
    question.options.map((option, index) => `${index}:${option}`).join(' | '),
  );
}
