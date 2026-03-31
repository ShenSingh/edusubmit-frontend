import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://platform-vm-external-ip:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

function unwrap(response) {
  return response.data;
}

export function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || "Request failed";
}

export const studentApi = {
  register: (payload) => apiClient.post("/student/api/students/register", payload).then(unwrap),
  login: (payload) => apiClient.post("/student/api/students/login", payload).then(unwrap),
  listCourses: () => apiClient.get("/student/api/courses").then(unwrap),
  createCourse: (payload) => apiClient.post("/student/api/courses", payload).then(unwrap),
  createEnrollment: (payload) => apiClient.post("/student/api/enrollments", payload).then(unwrap)
};

export const submissionApi = {
  listAssignments: () => apiClient.get("/submission/api/assignments").then(unwrap),
  listAssignmentsByCourse: (courseId) =>
    apiClient.get(`/submission/api/assignments/course/${courseId}`).then(unwrap),
  createAssignment: (payload) => apiClient.post("/submission/api/assignments", payload).then(unwrap),
  createSubmissionRecord: (payload) => apiClient.post("/submission/api/submissions", payload).then(unwrap),
  listStudentSubmissions: (studentId) =>
    apiClient.get(`/submission/api/submissions/student/${studentId}`).then(unwrap),
  listAssignmentSubmissions: (assignmentId) =>
    apiClient.get(`/submission/api/submissions/assignment/${assignmentId}`).then(unwrap),
  gradeSubmission: (submissionId, payload) =>
    apiClient.put(`/submission/api/submissions/${submissionId}/grade`, payload).then(unwrap)
};

export const fileApi = {
  uploadAssignmentFile: (file, uploadedBy) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadedBy", uploadedBy);

    return apiClient
      .post("/file/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(unwrap);
  },
  getMetadata: (fileId) => apiClient.get(`/file/api/files/${fileId}`).then(unwrap),
  downloadFile: (fileId) =>
    apiClient.get(`/file/api/files/download/${fileId}`, { responseType: "blob" }).then((response) => response.data)
};
