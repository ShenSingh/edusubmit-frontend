import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import PageCard from "../components/PageCard";
import { getErrorMessage, studentApi } from "../services/api";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationMessage = location.state?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await studentApi.login({ email, password });
      onLogin({
        id: response.userId,
        email: response.email,
        role: response.role
      });
      navigate("/courses");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard title="Login" subtitle="Access your student or lecturer account.">
      <AlertMessage type="success" text={registrationMessage} />
      <AlertMessage type="error" text={error} />

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="user@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="********"
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="inline-note">
        New user? <Link to="/register">Create an account</Link>
      </p>
    </PageCard>
  );
}
