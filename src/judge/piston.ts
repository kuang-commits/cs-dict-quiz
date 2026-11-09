import { pistonSettings } from '@/judge/config';
import { fetchJudge } from '@/judge/errors';
import type { CodeJudge, JudgeRequest, JudgeResponse } from '@/judge/types';

const VERSIONS: Record<JudgeRequest['language'], string> = {
  python: '3.10.0',
  javascript: '18.15.0',
};

/**
 * Piston adapter. The public emkc.org execute API is whitelist-only
 * (as of 2026-02-15), so this runs only when EXPO_PUBLIC_PISTON_URL points
 * at an instance you host.
 */
export function createPiston(url: string): CodeJudge {
  return {
    id: 'piston',
    supports: () => true,
    async run(request: JudgeRequest): Promise<JudgeResponse> {
      const started = Date.now();
      const response = await fetchJudge(`${url}/api/v2/piston/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: request.language === 'python' ? 'python' : 'javascript',
          version: VERSIONS[request.language],
          files: [{ content: request.source }],
          stdin: request.stdin,
          run_timeout: 2000,
        }),
      });
      const body = (await response.json()) as {
        message?: string;
        run?: { stdout?: string; stderr?: string; code?: number; signal?: string };
      };
      if (!body.run) throw new Error(body.message || 'Piston 没有返回运行结果');
      return {
        stdout: body.run.stdout ?? '',
        stderr: body.run.stderr || body.run.signal || '',
        exitCode: body.run.code ?? 1,
        timeMs: Date.now() - started,
        engine: 'piston',
      };
    },
  };
}

export function configuredPiston(): CodeJudge | null {
  const settings = pistonSettings();
  if (!settings.enabled) return null;
  return createPiston(settings.url);
}
