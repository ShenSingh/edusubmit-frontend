import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import PageCard from "../components/PageCard";
import { getErrorMessage, studentApi } from "../services/api";

export default function CoursesPage({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [courseForm, setCourseForm] = useState({
    code: "",
    title: "",
    description: ""
  });

  const loadCourses = async () => {
    setError("");
    try {
      const data = await studentApi.listCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await studentApi.createCourse({
        ...courseForm,
        lecturerId: user.id
      });
      setCourseForm({ code: "", title: "", description: "" });
      setMessage("Course created successfully.");
      await loadCourses();
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  const handleEnroll = async (courseId) => {
    setError("");
    setMessage("");

    try {
      await studentApi.createEnrollment({ studentId: user.id, courseId });
      setMessage("Enrollment created successfully.");
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    }
  };

  return (
    <PageCard title="Courses" subtitle="View available courses and manage them based on your role.">
      <AlertMessage type="error" text={error} />
      <AlertMessage type="success" text={message} />

      {user.role === "LECTURER" ? (
        <form className="form-grid form-split" onSubmit={handleCreateCourse}>
          <label>
            Code
            <input
              value={courseForm.code}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, code: event.target.value }))}
              required
            />
          </label>
          <label>
            Title
            <input
              value={courseForm.title}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>
          <label className="full-width">
            Description
            <textarea
              value={courseForm.description}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={3}
              required
            />
          </label>
          <button className="btn" type="submit">
            Create Course
          </button>
        </form>
      ) : null}

      {loading ? <p>Loading courses...</p> : null}

      <div className="item-grid stagger-grid">
        {courses.map((course) => (
          <article key={course.id} className="item-card">
            <h3>{course.code} - {course.title}</h3>
            <p>{course.description}</p>
            <div className="row-actions">
              <button className="btn btn-secondary" onClick={() => navigate(`/assignments?courseId=${course.id}`)}>
                View Assignments
              </button>
              {user.role === "STUDENT" ? (
                <button className="btn" onClick={() => handleEnroll(course.id)}>
                  Enroll
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </PageCard>
  );
}
