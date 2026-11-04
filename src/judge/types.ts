export type CodingLanguage = 'python' | 'javascript';

export type JudgeRequest = {
  language: CodingLanguage;
  source: string;
  stdin: string;
};

export type JudgeResponse = {
  stdout: string;
  stderr: string;
  exitCode: number;
  timeMs: number;
  engine: string;
};

export interface CodeJudge {
  id: string;
  /** Whether this judge can run the language right now. */
  supports(language: CodingLanguage): boolean;
  run(request: JudgeRequest): Promise<JudgeResponse>;
}
