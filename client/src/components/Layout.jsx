import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">Study OS</p>
          <h2>Smart Scheduler</h2>
          <p className="small">Welcome, {user?.name}</p>
        </div>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/subjects">Subjects</NavLink>
          <NavLink to="/planner">Planner</NavLink>
          <NavLink to="/insights">Insights</NavLink>
        </nav>
        <button className="danger" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <p className="muted">Keep your study streak alive with a smarter plan.</p>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
