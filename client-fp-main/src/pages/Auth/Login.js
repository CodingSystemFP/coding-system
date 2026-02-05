import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, useSearchParams } from "react-router-dom";
import { useUsers } from "../../context/UserContext";
import { useData } from "../../context/DataContext";
import LoginForm from "../../components/Auth/LoginForm";
import "../../styles/Auth.css";

export default function LoginPage() {
  const { login } = useUsers();
  const { currentUser, isAuthChecked } = useData();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState("");

  // 🔹 הצגת הודעה שהועברה בניווט (אם יש)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // 🔹 ניקוי סשן אם מגיעים מהקישור במייל
  useEffect(() => {
    const fromEmail = searchParams.get("fromEmail") === "true";

    if (!fromEmail) return;

    const forceLogout = async () => {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (e) {
        console.error("Auto logout failed:", e);
      }
    };

    forceLogout();
  }, [searchParams]);

  // 🔹 ניתוב אוטומטי רק אם זה לא כניסה מהקישור במייל
  useEffect(() => {
    const fromEmail = searchParams.get("fromEmail") === "true";
    if (fromEmail) return; // לא לבצע redirect אוטומטי אם באים מהמייל

    if (location.pathname !== "/") return;

    if (isAuthChecked && currentUser) {
      switch (currentUser.role) {
        case "coder":
          navigate("/coderHome", { replace: true });
          break;
        case "investigator":
          navigate("/investigatorHome", { replace: true });
          break;
        case "admin":
          navigate("/adminHome", { replace: true });
          break;
        default:
          break;
      }
    }
  }, [currentUser, isAuthChecked, navigate, location.pathname, searchParams]);

  const handleLogin = async (username, password) => {
    const result = await login(username, password);
    if (!result.success) {
      setMessage(result.message);
    } else {
      switch (result.user.role) {
        case "coder":
          navigate("/coderHome");
          break;
        case "investigator":
          navigate("/investigatorHome");
          break;
        case "admin":
          navigate("/adminHome");
          break;
        default:
          navigate("/");
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/reset-password");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🔐</div>
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">Enter the Coding System</p>
        </div>

        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
        />

        {message && (
          <div
            className={`auth-message ${
              message.toLowerCase().includes("error") ? "error" : "info"
            }`}
          >
            {message}
          </div>
        )}

        <div className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">Click here to register</Link>
        </div>
      </div>
    </div>
  );
}
