import { execute } from '@/judge/index';
import type { CodingLanguage } from '@/judge/types';
import type { CodingProblem, CodingTest } from '@/data/coding-problems';

export type TestReport = {
  hidden: boolean;
  input: string;
  expected: string;
  stdout: string;
  stderr: string;
  pass: boolean;
  timeMs: number;
  engine: string;
  degraded: boolean;
};

function normalize(value: string): string {
  return value.replace(/\r\n/g, '\n').trim();
}

async function runOne(language: CodingLanguage, source: string, test: CodingTest, hidden: boolean): Promise<TestReport> {
  const result = await execute(language, source, test.input);
  return {
    hidden,
    input: test.input,
    expected: test.expected,
    stdout: result.stdout,
    stderr: result.stderr,
    pass: result.exitCode === 0 && normalize(result.stdout) === normalize(test.expected),
    timeMs: result.timeMs,
    engine: result.engine,
    degraded: result.engine === 'unavailable',
  };
}

export async function runTests(problem: CodingProblem, language: CodingLanguage, source: string, mode: 'sample' | 'submit'): Promise<TestReport[]> {
  const visible = problem.sampleTests.map((test) => runOne(language, source, test, false));
  if (mode === 'sample') return Promise.all(visible);
  const hidden = problem.hiddenTests.map((test) => runOne(language, source, test, true));
  return Promise.all([...visible, ...hidden]);
}
