import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      navigate("/login");
      return;
    }

    api
      .post("/auth/google", { code })
      .then((res) => {
        login(res.data.token, res.data.user);
        setTimeout(() => navigate("/dashboard"), 1800);
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Signing you in...</p>
    </div>
  );
};

export default AuthCallbackPage;