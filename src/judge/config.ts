/**
 * Judge endpoints come from Expo public env vars.
 * Nothing secret is stored in source. See README for how to set them.
 *
 * EXPO_PUBLIC_JUDGE0_URL   optional. Empty uses the public ce.judge0.com instance for Python.
 * EXPO_PUBLIC_JUDGE0_KEY   optional RapidAPI or self-hosted auth token. Sent only as a header.
 * EXPO_PUBLIC_JUDGE0_PUBLIC  set to "0" to disable the public instance when no URL is set.
 * EXPO_PUBLIC_PISTON_URL   optional self-hosted Piston. The public emkc execute API is closed.
 */

const PUBLIC_JUDGE0 = 'https://ce.judge0.com';

function read(name: string): string {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function judge0Settings(): { url: string; key: string; enabled: boolean } {
  const explicit = read('EXPO_PUBLIC_JUDGE0_URL').replace(/\/$/, '');
  const key = read('EXPO_PUBLIC_JUDGE0_KEY');
  const allowPublic = read('EXPO_PUBLIC_JUDGE0_PUBLIC') !== '0';
  const url = explicit || (allowPublic ? PUBLIC_JUDGE0 : '');
  return { url, key, enabled: Boolean(url) };
}

export function pistonSettings(): { url: string; enabled: boolean } {
  const url = read('EXPO_PUBLIC_PISTON_URL').replace(/\/$/, '');
  return { url, enabled: Boolean(url) };
}

export const JUDGE0_LANGUAGE_IDS: Record<'python' | 'javascript', number> = {
  python: 92,
  javascript: 93,
};
