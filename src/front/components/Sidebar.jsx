import { Link, useNavigate, NavLink } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Sidebar = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo">TASKFLOW</Link>
      </div>

      <div
        className="user-profile-summary"
        onClick={() => navigate("/profile")}
        style={{ cursor: "pointer" }}
      >
        <div className="user-avatar">
          {store.profile.photo ? (
            <img
              src={store.profile.photo}
              alt="User Avatar"
              className="img-fluid rounded-circle"
            />
          ) : (
            <span>{store.profile.name[0]}</span>
          )}
        </div>
        <span className="username">{store.profile.name}</span>
        <span className="user-email">{store.profile.email}</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-desktop"></i>
              <span className="nav-text">Escritorio</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/groups" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-users"></i>
              <span className="nav-text">Tus Clanes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/finances" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-wallet"></i>
              <span className="nav-text">Finanzas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-user-circle"></i>
              <span className="nav-text">Tu Perfil</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/config" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-cog"></i>
              <span className="nav-text">Configuración</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/chat" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-comments"></i>
              <span className="nav-text">Chat</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};