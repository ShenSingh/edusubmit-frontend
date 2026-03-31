import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import PageCard from "../components/PageCard";
import { getErrorMessage, submissionApi } from "../services/api";

function normalizeDateTime(value) {
  if (!value) {
    return value;
  }
  return value.length === 16 ? `${value}:00` : value;
}

export default function AssignmentsPage({ user }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [courseId, setCourseId] = useState(searchParams.get("courseId") || "");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    courseId: searchParams.get("courseId") || "",
    title: "",
    description: "",
    dueDate: ""
  });

  const loadAssignments = async (selectedCourseId) => {
    setError("");
    setLoading(true);

    try {
      const data = selectedCourseId
        ? await submissionApi.listAssignmentsByCourse(selectedCourseId)
        : await submissionApi.listAssignments();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments(courseId);
  }, [courseId]);

  const handleCreateAssignment = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await submissionApi.createAssignment({
        ...formData,
        dueDate: normalizeDateTime(formData.dueDate),
        createdBy: user.email
      });
      setMessage("Assignment created successfully.");
      setFormData((prev) => ({ ...prev, title: "", description: "", dueDate: "" }));
      await loadAssignments(courseId || formData.courseId);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  return (
    <PageCard title="Assignments" subtitle="List and manage assignments by course.">
      <AlertMessage type="error" text={error} />
      <AlertMessage type="success" text={message} />

      <div className="form-inline">
        <label>
          Course ID
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} placeholder="Filter by course" />
        </label>
        <button className="btn btn-secondary" onClick={() => loadAssignments(courseId)}>Refresh</button>
      </div>

      {user.role === "LECTURER" ? (
        <form className="form-grid form-split" onSubmit={handleCreateAssignment}>
          <label>
            Course ID
            <input
              value={formData.courseId}
              onChange={(event) => setFormData((prev) => ({ ...prev, courseId: event.target.value }))}
              required
            />
          </label>
          <label>
            Title
            <input
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>
          <label className="full-width">
            Description
            <textarea
              rows={3}
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
          </label>
          <label>
            Due Date
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
              required
            />
          </label>
          <button className="btn" type="submit">Create Assignment</button>
        </form>
      ) : null}

      {loading ? <p>Loading assignments...</p> : null}

      <div className="item-grid stagger-grid">
        {assignments.map((assignment) => (
          <article key={assignment.id} className="item-card">
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
            <p><strong>Course:</strong> {assignment.courseId}</p>
            <p><strong>Due:</strong> {assignment.dueDate}</p>
            <div className="row-actions">
              {user.role === "STUDENT" ? (
                <button
                  className="btn"
                  onClick={() => navigate(`/submit?assignmentId=${assignment.id}&courseId=${assignment.courseId}`)}
                >
                  Submit
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/dashboard?assignmentId=${assignment.id}`)}
                >
                  View Submissions
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </PageCard>
  );
}
