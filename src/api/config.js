/**
 * 개발/프로덕션 모두 /api 사용.
 * - 개발: Vite 프록시가 /api → be-dosa.store 로 전달
 * - Netlify: _redirects/netlify.toml 이 /api/* → be-dosa.store 로 프록시 → CORS 없음
 */
export const API_BASE = import.meta.env.DEV ? "/api" : "https://be-dosa.store";

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
