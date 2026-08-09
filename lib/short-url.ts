const SHORT_URL_BASE = (
  process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? 'http://localhost:3000'
).replace(/\/$/, '');

export function getShortUrl(code: string) {
  return `${SHORT_URL_BASE}/${encodeURIComponent(code)}`;
}

export function getShortUrlPath(code: string) {
  return `/${encodeURIComponent(code)}`;
}
