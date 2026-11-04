import { JUDGE0_LANGUAGE_IDS, judge0Settings } from '@/judge/config';
import type { CodeJudge, JudgeRequest, JudgeResponse } from '@/judge/types';

type Submission = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  time?: string | null;
  status?: { id?: number; description?: string };
};

export function createJudge0(url: string, key: string): CodeJudge {
  return {
    id: 'judge0',
    supports: () => true,
    async run(request: JudgeRequest): Promise<JudgeResponse> {
      const started = Date.now();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (key) headers['X-Auth-Token'] = key;
      const response = await fetch(`${url}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_code: request.source,
          language_id: JUDGE0_LANGUAGE_IDS[request.language],
          stdin: request.stdin,
          cpu_time_limit: 2,
        }),
      });
      if (!response.ok) {
        throw new Error(`判题服务返回 ${response.status}`);
      }
      const body = (await response.json()) as Submission;
      const stderr = [body.stderr, body.compile_output, body.message].filter(Boolean).join('\n');
      const statusId = body.status?.id ?? 0;
      const accepted = statusId === 3;
      return {
        stdout: body.stdout ?? '',
        stderr: accepted ? stderr : stderr || body.status?.description || '运行失败',
        exitCode: accepted ? 0 : statusId || 1,
        timeMs: body.time ? Math.round(Number(body.time) * 1000) : Date.now() - started,
        engine: 'judge0',
      };
    },
  };
}

export function configuredJudge0(): CodeJudge | null {
  const settings = judge0Settings();
  if (!settings.enabled) return null;
  return createJudge0(settings.url, settings.key);
}
