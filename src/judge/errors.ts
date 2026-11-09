export type JudgeFailureKind = 'timeout' | 'rate-limit' | 'unreachable' | 'unavailable';

export const JUDGE_TIMEOUT_MS = 12000;

export const JUDGE_DEGRADE_HINT =
  '这是网络或在线判题服务的问题，不是本应用坏了。可以改做 JavaScript 题（本机运行，不用联网），或在项目根目录的 .env 里配置自建 Judge0：EXPO_PUBLIC_JUDGE0_URL、EXPO_PUBLIC_JUDGE0_KEY。密钥不要写进仓库。';

export class JudgeServiceError extends Error {
  readonly kind: JudgeFailureKind;

  constructor(kind: JudgeFailureKind, message: string) {
    super(message);
    this.name = 'JudgeServiceError';
    this.kind = kind;
  }
}

export function judgeFailureMessage(kind: JudgeFailureKind, detail = ''): string {
  const head =
    kind === 'rate-limit'
      ? '判题服务限流了，请稍后再试。'
      : kind === 'timeout'
        ? '判题服务超时，没有在规定时间内返回。'
        : kind === 'unreachable'
          ? '连不上判题服务。'
          : '判题服务暂时不可用。';
  const extra = detail ? `${detail} ` : '';
  return `${head}${extra}${JUDGE_DEGRADE_HINT}`;
}

export function classifyFetchError(error: unknown): JudgeServiceError {
  if (error instanceof JudgeServiceError) return error;
  const name = error instanceof Error ? error.name : '';
  const message = error instanceof Error ? error.message : String(error);
  if (name === 'AbortError' || name === 'TimeoutError' || /aborted|timeout|timed out/i.test(message)) {
    return new JudgeServiceError('timeout', judgeFailureMessage('timeout'));
  }
  return new JudgeServiceError('unreachable', judgeFailureMessage('unreachable'));
}

export function classifyHttpStatus(status: number): JudgeServiceError {
  if (status === 429) return new JudgeServiceError('rate-limit', judgeFailureMessage('rate-limit', `HTTP ${status}。`));
  if (status === 408 || status === 504) return new JudgeServiceError('timeout', judgeFailureMessage('timeout', `HTTP ${status}。`));
  if (status === 502 || status === 503) return new JudgeServiceError('unreachable', judgeFailureMessage('unreachable', `HTTP ${status}。`));
  return new JudgeServiceError('unavailable', judgeFailureMessage('unavailable', `HTTP ${status}。`));
}

export async function fetchJudge(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), JUDGE_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) throw classifyHttpStatus(response.status);
    return response;
  } catch (error) {
    throw classifyFetchError(error);
  } finally {
    clearTimeout(timer);
  }
}
