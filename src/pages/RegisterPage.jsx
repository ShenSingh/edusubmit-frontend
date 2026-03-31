import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import PageCard from "../components/PageCard";
import { getErrorMessage, studentApi } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await studentApi.register(formData);
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => {
        navigate("/login", { state: { message: "Registration successful. Please login." } });
      }, 900);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard title="Register" subtitle="Create a student or lecturer account.">
      <AlertMessage type="error" text={error} />
      <AlertMessage type="success" text={success} />

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            value={formData.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            required
          />
        </label>

        <label>
          Last Name
          <input
            value={formData.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
            minLength={8}
          />
        </label>

        <label>
          Role
          <select value={formData.role} onChange={(event) => updateField("role", event.target.value)}>
            <option value="STUDENT">Student</option>
            <option value="LECTURER">Lecturer</option>
          </select>
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="inline-note">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </PageCard>
  );
}
