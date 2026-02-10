import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

/** OAuth 로그인 후 백엔드가 이 URL로 리다이렉트해주면 토큰/상태를 받아 저장하고 홈으로 이동 */
const AUTH_STORAGE_KEY = "auth_token";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const token =
      searchParams.get("token") ||
      searchParams.get("access_token") ||
      searchParams.get("accessToken");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setTimeout(() => navigate("/", { replace: true }), 2000);
      return;
    }

    if (token) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, token);
      } catch (e) {
        console.warn("Auth storage failed", e);
      }
    }
    // 토큰이 없어도 백엔드가 세션 쿠키로 처리했을 수 있음 → 홈으로
    setStatus("success");
    navigate("/", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#18191a",
        color: "#fff",
        flexDirection: "column",
        gap: "16px",
      }}>
      {status === "loading" && <p>로그인 처리 중...</p>}
      {status === "success" && <p>로그인되었습니다. 홈으로 이동합니다.</p>}
      {status === "error" && (
        <p>로그인에 실패했습니다. 잠시 후 홈으로 이동합니다.</p>
      )}
    </div>
  );
}

export { AUTH_STORAGE_KEY };
