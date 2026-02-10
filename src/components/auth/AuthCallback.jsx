import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

/**
 * OAuth 로그인 후 백엔드가 이 URL로 리다이렉트해주면
 * 리다이렉트가 끝난 시점에 POST /auth/token 호출 후 홈으로 이동
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const fetchAfterLogin = useAuthStore((s) => s.fetchAfterLogin);

  useEffect(() => {
    (async () => {
      await fetchAfterLogin();
      setStatus("success");
      navigate("/", { replace: true });
    })();
  }, [navigate, fetchAfterLogin]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#18191a",
        color: "#fff",
      }}>
      {status === "loading" && <p>로그인 처리 중...</p>}
      {status === "success" && <p>로그인되었습니다. 홈으로 이동합니다.</p>}
    </div>
  );
}
