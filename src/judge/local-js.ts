import type { CodeJudge, JudgeRequest, JudgeResponse } from '@/judge/types';

const TIMEOUT_MS = 1500;

export function runLocalJavaScript(source: string, stdin: string): JudgeResponse {
  const started = Date.now();
  try {
    const factory = new Function(`${source}\n; return typeof solve === "function" ? solve : null;`);
    const solve = factory() as ((data: string) => unknown) | null;
    if (!solve) {
      return {
        stdout: '',
        stderr: '请定义函数 solve(data)，data 是整段输入。',
        exitCode: 1,
        timeMs: Date.now() - started,
        engine: 'local-js',
      };
    }
    let finished = false;
    let value = '';
    const timer = setTimeout(() => {
      finished = true;
    }, TIMEOUT_MS);
    try {
      const result = solve(stdin);
      value = result == null ? '' : String(result);
    } finally {
      clearTimeout(timer);
    }
    if (finished && !value) {
      return {
        stdout: '',
        stderr: '运行超时',
        exitCode: 1,
        timeMs: Date.now() - started,
        engine: 'local-js',
      };
    }
    return { stdout: value, stderr: '', exitCode: 0, timeMs: Date.now() - started, engine: 'local-js' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { stdout: '', stderr: message, exitCode: 1, timeMs: Date.now() - started, engine: 'local-js' };
  }
}

export const localJavaScriptJudge: CodeJudge = {
  id: 'local-js',
  supports: (language) => language === 'javascript',
  async run(request: JudgeRequest) {
    return runLocalJavaScript(request.source, request.stdin);
  },
};
