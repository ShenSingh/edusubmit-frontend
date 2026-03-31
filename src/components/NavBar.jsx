import { NavLink } from "react-router-dom";

export default function NavBar({ user, onLogout }) {
  return (
    <header className="nav-shell">
      <div className="nav-brand">EduSubmit</div>

      <nav className="nav-links">
        {!user && <NavLink to="/login">Login</NavLink>}
        {!user && <NavLink to="/register">Register</NavLink>}
        {user && <NavLink to="/courses">Courses</NavLink>}
        {user && <NavLink to="/assignments">Assignments</NavLink>}
        {user && user.role === "STUDENT" && <NavLink to="/submit">Submit</NavLink>}
        {user && user.role === "LECTURER" && <NavLink to="/dashboard">Dashboard</NavLink>}
      </nav>

      <div className="nav-user-area">
        {user ? (
          <>
            <span className="nav-user-pill">{user.email} ({user.role})</span>
            <button className="btn btn-secondary" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
