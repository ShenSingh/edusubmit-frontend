import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import PageCard from "../components/PageCard";
import { fileApi, getErrorMessage, submissionApi } from "../services/api";

export default function LecturerDashboardPage() {
  const [searchParams] = useSearchParams();
  const initialAssignment = useMemo(() => searchParams.get("assignmentId") || "", [searchParams]);

  const [assignmentId, setAssignmentId] = useState(initialAssignment);
  const [submissions, setSubmissions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSubmissions = async () => {
    if (!assignmentId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await submissionApi.listAssignmentSubmissions(assignmentId);
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialAssignment) {
      loadSubmissions();
    }
  }, [initialAssignment]);

  const updateDraft = (submissionId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value
      }
    }));
  };

  const handleGrade = async (submissionId) => {
    const draft = drafts[submissionId] || {};
    const numericGrade = Number(draft.grade);

    if (Number.isNaN(numericGrade)) {
      setError("Please enter a valid grade.");
      return;
    }

    setError("");
    setMessage("");

    try {
      await submissionApi.gradeSubmission(submissionId, {
        grade: numericGrade,
        feedback: draft.feedback || ""
      });
      setMessage("Grade saved.");
      await loadSubmissions();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const blob = await fileApi.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `${fileId}.bin`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  return (
    <PageCard title="Lecturer Dashboard" subtitle="View submissions and assign grades with feedback.">
      <AlertMessage type="error" text={error} />
      <AlertMessage type="success" text={message} />

      <div className="form-inline">
        <label>
          Assignment ID
          <input value={assignmentId} onChange={(event) => setAssignmentId(event.target.value)} placeholder="Enter assignment id" />
        </label>
        <button className="btn" onClick={loadSubmissions}>Load Submissions</button>
      </div>

      {loading ? <p>Loading submissions...</p> : null}

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Submission ID</th>
              <th>Student ID</th>
              <th>File</th>
              <th>Status</th>
              <th>Grade</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => {
              const draft = drafts[submission.id] || {};
              return (
                <tr key={submission.id}>
                  <td>{submission.id}</td>
                  <td>{submission.studentId}</td>
                  <td>{submission.fileName || submission.fileId}</td>
                  <td>{submission.status}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={draft.grade ?? submission.grade ?? ""}
                      onChange={(event) => updateDraft(submission.id, "grade", event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={draft.feedback ?? submission.feedback ?? ""}
                      onChange={(event) => updateDraft(submission.id, "feedback", event.target.value)}
                    />
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-secondary" onClick={() => handleDownload(submission.fileId, submission.fileName)}>
                        Download
                      </button>
                      <button className="btn" onClick={() => handleGrade(submission.id)}>
                        Save Grade
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageCard>
  );
}
