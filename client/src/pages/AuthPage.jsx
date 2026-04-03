import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const { token, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  if (token) return <Navigate to="/" replace />;

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "register") {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h1>{mode === "register" ? "Create Account" : "Welcome Back"}</h1>
        <p className="muted">Plan smarter. Study consistently.</p>

        {mode === "register" && (
          <input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={onChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
          minLength={6}
        />

        {error ? <p className="error">{error}</p> : null}

        <button type="submit">{mode === "register" ? "Register" : "Login"}</button>

        <button
          type="button"
          className="ghost"
          onClick={() => setMode(mode === "register" ? "login" : "register")}
        >
          {mode === "register" ? "Have an account? Login" : "New here? Register"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
