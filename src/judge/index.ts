import { configuredJudge0 } from '@/judge/judge0';
import { localJavaScriptJudge } from '@/judge/local-js';
import { configuredPiston } from '@/judge/piston';
import type { CodeJudge, CodingLanguage, JudgeRequest, JudgeResponse } from '@/judge/types';

export type { CodingLanguage, JudgeResponse } from '@/judge/types';

function wrap(language: CodingLanguage, source: string): string {
  if (language === 'python') {
    return `${source}\nimport sys\nsys.stdout.write(str(solve(sys.stdin.read())))\n`;
  }
  return `${source}\nconst fs = require('fs');\nprocess.stdout.write(String(solve(fs.readFileSync(0, 'utf8'))));\n`;
}

export async function execute(language: CodingLanguage, userSource: string, stdin: string): Promise<JudgeResponse> {
  const request: JudgeRequest = {
    language,
    source: language === 'javascript' ? userSource : wrap(language, userSource),
    stdin,
  };
  const judges = selectJudges(language);
  let lastError = '没有可用的判题器';
  for (const judge of judges) {
    try {
      if (judge.id === 'local-js') return localJavaScriptJudge.run({ ...request, source: userSource });
      return await judge.run(request);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return {
    stdout: '',
    stderr: language === 'python' ? `${lastError}。JavaScript 可以离线运行；Python 需要可访问的 Judge0 或自建 Piston。` : lastError,
    exitCode: 1,
    timeMs: 0,
    engine: 'unavailable',
  };
}

export function selectJudges(language: CodingLanguage): CodeJudge[] {
  const remote = [configuredPiston(), configuredJudge0()].filter((judge): judge is CodeJudge => Boolean(judge));
  if (language === 'javascript') return [localJavaScriptJudge, ...remote];
  return remote;
}

export function judgeLabel(language: CodingLanguage): string {
  const first = selectJudges(language)[0];
  if (!first) return '未配置';
  if (first.id === 'local-js') return '本机 JavaScript';
  if (first.id === 'piston') return '自建 Piston';
  return 'Judge0';
}
