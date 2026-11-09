import type { CategoryId } from '@/types';

export type CodingTest = { input: string; expected: string };

export type CodingProblem = {
  id: string;
  subjectId: CategoryId;
  title: string;
  statement: string;
  termIds: string[];
  starter: { python: string; javascript: string };
  solution: { python: string; javascript: string };
  sampleTests: CodingTest[];
  hiddenTests: CodingTest[];
};

const py = (body: string) => `def solve(data):\n${body}\n`;
const js = (body: string) => `function solve(data) {\n${body}\n}\n`;

export const codingProblems: CodingProblem[] = [
  {
    id: 'add-two',
    subjectId: 'programming',
    title: '两数相加',
    statement: '输入一行两个整数，中间用空格分开。请输出它们的和。用 {variable} 记住这两个数。',
    termIds: ['variable'],
    starter: {
      python: py('    # 在这里返回两数之和的字符串\n    return ""'),
      javascript: js('  // 在这里返回两数之和的字符串\n  return "";'),
    },
    solution: {
      python: py('    a, b = map(int, data.split())\n    return str(a + b)'),
      javascript: js('  const [a, b] = data.trim().split(/\\s+/).map(Number);\n  return String(a + b);'),
    },
    sampleTests: [
      { input: '2 3', expected: '5' },
      { input: '10 1', expected: '11' },
    ],
    hiddenTests: [
      { input: '0 0', expected: '0' },
      { input: '-1 4', expected: '3' },
    ],
  },
  {
    id: 'max-three',
    subjectId: 'programming',
    title: '三个数里最大的',
    statement: '输入三个整数。写出一个 {function}，返回其中最大的那个。',
    termIds: ['function'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    nums = list(map(int, data.split()))\n    return str(max(nums))'),
      javascript: js('  const nums = data.trim().split(/\\s+/).map(Number);\n  return String(Math.max(...nums));'),
    },
    sampleTests: [
      { input: '1 9 3', expected: '9' },
      { input: '4 4 2', expected: '4' },
    ],
    hiddenTests: [
      { input: '-5 -1 -8', expected: '-1' },
      { input: '7 0 7', expected: '7' },
    ],
  },
  {
    id: 'parity',
    subjectId: 'programming',
    title: '判断奇偶',
    statement: '输入一个整数。偶数输出 even，奇数输出 odd。结果可以想成一个 {boolean} 判断。',
    termIds: ['boolean'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    n = int(data.strip())\n    return "even" if n % 2 == 0 else "odd"'),
      javascript: js('  const n = Number(data.trim());\n  return n % 2 === 0 ? "even" : "odd";'),
    },
    sampleTests: [
      { input: '4', expected: 'even' },
      { input: '7', expected: 'odd' },
    ],
    hiddenTests: [
      { input: '0', expected: 'even' },
      { input: '-3', expected: 'odd' },
    ],
  },
  {
    id: 'repeat-word',
    subjectId: 'programming',
    title: '重复字符串',
    statement: '第一行是一个 {string}，第二行是次数。把这个字符串重复那么多次后输出。',
    termIds: ['string'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    word, times = data.split()\n    return word * int(times)'),
      javascript: js('  const [word, times] = data.trim().split(/\\s+/);\n  return word.repeat(Number(times));'),
    },
    sampleTests: [
      { input: 'ab 3', expected: 'ababab' },
      { input: 'x 1', expected: 'x' },
    ],
    hiddenTests: [
      { input: 'ha 0', expected: '' },
      { input: 'ok 2', expected: 'okok' },
    ],
  },
  {
    id: 'sum-array',
    subjectId: 'programming',
    title: '数组求和',
    statement: '输入一行整数，它们组成一个 {array}。用 {loop} 把所有数加起来。',
    termIds: ['array', 'loop'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    total = 0\n    for n in data.split():\n        total += int(n)\n    return str(total)'),
      javascript: js('  let total = 0;\n  for (const n of data.trim().split(/\\s+/)) total += Number(n);\n  return String(total);'),
    },
    sampleTests: [
      { input: '1 2 3', expected: '6' },
      { input: '10', expected: '10' },
    ],
    hiddenTests: [
      { input: '0 0 5', expected: '5' },
      { input: '-2 2 4', expected: '4' },
    ],
  },
  {
    id: 'count-words',
    subjectId: 'programming',
    title: '数一数有几个词',
    statement: '输入一行英文，词和词之间用空格分开。输出词的个数。每个词都是一个 {string}。',
    termIds: ['string'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    words = data.split()\n    return str(len(words))'),
      javascript: js('  const words = data.trim() ? data.trim().split(/\\s+/) : [];\n  return String(words.length);'),
    },
    sampleTests: [
      { input: 'hello world', expected: '2' },
      { input: 'only', expected: '1' },
    ],
    hiddenTests: [
      { input: 'a b c d', expected: '4' },
      { input: '', expected: '0' },
    ],
  },
  {
    id: 'abs-diff',
    subjectId: 'programming',
    title: '两数差的绝对值',
    statement: '输入两个整数，输出它们相差多少。想一个小 {algorithm}：大的减去小的。',
    termIds: ['algorithm'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    a, b = map(int, data.split())\n    return str(abs(a - b))'),
      javascript: js('  const [a, b] = data.trim().split(/\\s+/).map(Number);\n  return String(Math.abs(a - b));'),
    },
    sampleTests: [
      { input: '3 8', expected: '5' },
      { input: '5 5', expected: '0' },
    ],
    hiddenTests: [
      { input: '1 -4', expected: '5' },
      { input: '9 2', expected: '7' },
    ],
  },
  {
    id: 'first-last',
    subjectId: 'python',
    title: '列表的头和尾',
    statement: '输入一行整数，当成一个 {list}。输出第一个数和最后一个数，中间用空格分开。',
    termIds: ['list'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    nums = data.split()\n    return nums[0] + " " + nums[-1]'),
      javascript: js('  const nums = data.trim().split(/\\s+/);\n  return nums[0] + " " + nums[nums.length - 1];'),
    },
    sampleTests: [
      { input: '1 2 3', expected: '1 3' },
      { input: '8', expected: '8 8' },
    ],
    hiddenTests: [
      { input: '4 9', expected: '4 9' },
      { input: '-1 0 6', expected: '-1 6' },
    ],
  },
  {
    id: 'dict-get',
    subjectId: 'python',
    title: '从字典里取值',
    statement: '第一行是若干「名字=分数」，用空格分开，组成一个 {dict}。第二行是要查的名字。输出对应的分数；没有这个名字就输出 none。',
    termIds: ['dict'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    lines = data.strip().splitlines()\n    pairs = {}\n    for item in lines[0].split():\n        key, value = item.split("=")\n        pairs[key] = value\n    return pairs.get(lines[1].strip(), "none")'),
      javascript: js('  const lines = data.trim().split(/\\n/);\n  const pairs = {};\n  for (const item of lines[0].split(/\\s+/)) {\n    const [key, value] = item.split("=");\n    pairs[key] = value;\n  }\n  return pairs[lines[1].trim()] ?? "none";'),
    },
    sampleTests: [
      { input: 'ada=90 bob=70\nada', expected: '90' },
      { input: 'ada=90 bob=70\ncy', expected: 'none' },
    ],
    hiddenTests: [
      { input: 'li=100\nli', expected: '100' },
      { input: 'a=1 b=2\nb', expected: '2' },
    ],
  },
  {
    id: 'slice-three',
    subjectId: 'python',
    title: '取前三个',
    statement: '输入一行用空格分开的词。用 {slice} 的想法，只输出前三个，仍然用空格分开。不足三个就全部输出。',
    termIds: ['slice'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    words = data.split()\n    return " ".join(words[:3])'),
      javascript: js('  return data.trim().split(/\\s+/).slice(0, 3).join(" ");'),
    },
    sampleTests: [
      { input: 'a b c d', expected: 'a b c' },
      { input: 'only two', expected: 'only two' },
    ],
    hiddenTests: [
      { input: 'x', expected: 'x' },
      { input: 'one two three four', expected: 'one two three' },
    ],
  },
  {
    id: 'count-threes',
    subjectId: 'python',
    title: '能被 3 整除的个数',
    statement: '输入一行整数。用 {loop} 数一数有几个能被 3 整除。',
    termIds: ['loop'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    count = 0\n    for n in data.split():\n        if int(n) % 3 == 0:\n            count += 1\n    return str(count)'),
      javascript: js('  let count = 0;\n  for (const n of data.trim().split(/\\s+/)) if (Number(n) % 3 === 0) count += 1;\n  return String(count);'),
    },
    sampleTests: [
      { input: '3 4 6', expected: '2' },
      { input: '1 2', expected: '0' },
    ],
    hiddenTests: [
      { input: '0 9 10', expected: '2' },
      { input: '3', expected: '1' },
    ],
  },
  {
    id: 'safe-divide',
    subjectId: 'python',
    title: '除法要小心',
    statement: '输入两个整数 a 和 b。b 不是 0 就输出 a//b 的整数结果；b 是 0 就输出 error，不要让程序抛出 {exception}。',
    termIds: ['exception'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    a, b = map(int, data.split())\n    if b == 0:\n        return "error"\n    return str(a // b)'),
      javascript: js('  const [a, b] = data.trim().split(/\\s+/).map(Number);\n  if (b === 0) return "error";\n  return String(Math.trunc(a / b));'),
    },
    sampleTests: [
      { input: '7 2', expected: '3' },
      { input: '5 0', expected: 'error' },
    ],
    hiddenTests: [
      { input: '8 8', expected: '1' },
      { input: '9 4', expected: '2' },
    ],
  },
  {
    id: 'read-name',
    subjectId: 'web',
    title: '读出名字',
    statement: '输入一行类似 name=Ada age=18。把它看成很短的 {json} 数据，输出 name 后面的值。',
    termIds: ['json'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    for item in data.split():\n        key, value = item.split("=")\n        if key == "name":\n            return value\n    return ""'),
      javascript: js('  for (const item of data.trim().split(/\\s+/)) {\n    const [key, value] = item.split("=");\n    if (key === "name") return value;\n  }\n  return "";'),
    },
    sampleTests: [
      { input: 'name=Ada age=18', expected: 'Ada' },
      { input: 'age=3 name=Bo', expected: 'Bo' },
    ],
    hiddenTests: [
      { input: 'name=Li', expected: 'Li' },
      { input: 'city=HZ name=An', expected: 'An' },
    ],
  },
  {
    id: 'count-requests',
    subjectId: 'web',
    title: '数一数请求',
    statement: '每一行是一次 {request} 的路径。输出一共有多少行。空行不算。',
    termIds: ['request'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    lines = [line for line in data.splitlines() if line.strip()]\n    return str(len(lines))'),
      javascript: js('  const lines = data.split(/\\n/).filter((line) => line.trim());\n  return String(lines.length);'),
    },
    sampleTests: [
      { input: '/home\n/about', expected: '2' },
      { input: '/only', expected: '1' },
    ],
    hiddenTests: [
      { input: '/a\n\n/b\n/c', expected: '3' },
      { input: '', expected: '0' },
    ],
  },
  {
    id: 'count-tags',
    subjectId: 'web',
    title: '数组件标记',
    statement: '输入一行用空格分开的名字。数一数有几个 {component} 标记，也就是以 Button 或 Card 开头的名字。',
    termIds: ['component'],
    starter: {
      python: py('    return ""'),
      javascript: js('  return "";'),
    },
    solution: {
      python: py('    count = 0\n    for name in data.split():\n        if name.startswith("Button") or name.startswith("Card"):\n            count += 1\n    return str(count)'),
      javascript: js('  let count = 0;\n  for (const name of data.trim() ? data.trim().split(/\\s+/) : []) {\n    if (name.startsWith("Button") || name.startsWith("Card")) count += 1;\n  }\n  return String(count);'),
    },
    sampleTests: [
      { input: 'ButtonOk CardUser Text', expected: '2' },
      { input: 'Text Link', expected: '0' },
    ],
    hiddenTests: [
      { input: 'Card', expected: '1' },
      { input: 'ButtonA ButtonB CardX', expected: '3' },
    ],
  },
];

export const codingProblemById: Record<string, CodingProblem> = Object.fromEntries(
  codingProblems.map((problem) => [problem.id, problem]),
);
