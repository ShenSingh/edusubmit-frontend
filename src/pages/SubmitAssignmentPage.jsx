import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import PageCard from "../components/PageCard";
import { fileApi, getErrorMessage, submissionApi } from "../services/api";

export default function SubmitAssignmentPage({ user }) {
  const [searchParams] = useSearchParams();
  const [assignmentId, setAssignmentId] = useState(searchParams.get("assignmentId") || "");
  const [courseId, setCourseId] = useState(searchParams.get("courseId") || "");
  const [file, setFile] = useState(null);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSubmissions = async () => {
    try {
      const data = await submissionApi.listStudentSubmissions(user.id);
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }

    setLoading(true);
    try {
      const uploadResponse = await fileApi.uploadAssignmentFile(file, user.email);
      const metadata = uploadResponse.file || uploadResponse;

      await submissionApi.createSubmissionRecord({
        assignmentId,
        studentId: String(user.id),
        courseId,
        fileId: metadata.fileId,
        fileName: metadata.fileName
      });

      setMessage("Submission created successfully.");
      setFile(null);
      await loadSubmissions();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard title="Submit Assignment" subtitle="Upload file and create a submission record.">
      <AlertMessage type="error" text={error} />
      <AlertMessage type="success" text={message} />

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Assignment ID
          <input value={assignmentId} onChange={(event) => setAssignmentId(event.target.value)} required />
        </label>

        <label>
          Course ID
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} required />
        </label>

        <label>
          Assignment File
          <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Upload + Submit"}
        </button>
      </form>

      <h2 className="section-heading">My Submissions</h2>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Submission ID</th>
              <th>Assignment ID</th>
              <th>Status</th>
              <th>Grade</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.id}</td>
                <td>{submission.assignmentId}</td>
                <td>{submission.status}</td>
                <td>{submission.grade ?? "-"}</td>
                <td>{submission.feedback || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageCard>
  );
}
