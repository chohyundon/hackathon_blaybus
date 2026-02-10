/**
 * 개발 시 Vite 프록시(/api → be-dosa.store) 사용으로 CORS 방지.
 * 새로고침 시에도 동일 오리진 요청이라 CORS 에러가 나지 않음.
 */
export const API_BASE = import.meta.env.DEV ? "/api" : "https://be-dosa.store";

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
