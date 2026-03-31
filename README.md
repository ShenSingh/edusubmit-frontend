# edusubmit-frontend

React + Vite frontend for the EduSubmit Student Assignment Submission System.

## Stack

- React
- Vite
- Axios
- React Router

## API Gateway

All requests go through API Gateway:

- Base URL: `http://localhost:8080`
- Student service via `/student/...`
- Submission service via `/submission/...`
- File service via `/file/...`

## Project Structure

```text
src/
  components/
  pages/
  services/
  App.jsx
  main.jsx
```

## Implemented Pages

- Login Page
- Register Page
- Courses Page
- Assignments Page
- Submit Assignment Page
- Lecturer Dashboard

## Implemented Features

- Login by email/password
- Register student or lecturer
- List courses
- Lecturer create course
- List assignments
- Lecturer create assignment
- Upload assignment file
- Create submission record
- View submissions
- Grade submission
- Add feedback

## Run Locally

1. Copy env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm run dev
```

4. Open:

`http://localhost:5173`

## Notes

- Ensure API Gateway and backend services are running before using the frontend.
- Gateway base URL is configured in `.env.example` using `VITE_API_BASE_URL`.
# edusubmit-frontend
