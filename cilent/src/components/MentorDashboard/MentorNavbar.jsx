import { Link } from "react-router-dom";
import NotificationBell from "../NotificationBell";
function MentorNavbar({ mentor, onToggle }) {
    return (
        <nav className="bg-white border-bottom sticky-top px-3 px-md-4 py-2 py-md-3 shadow-sm" style={{ zIndex: 1020 }}>
            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center gap-2 min-width-0">
                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-shrink-0" onClick={onToggle} style={{ width: "38px", height: "38px", borderRadius: "8px" }}><i className="bi bi-list d-lg-none"></i><i className="bi bi-layout-sidebar-inset d-none d-lg-block"></i></button>
                    <div className="d-none d-sm-block min-width-0"><h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: "0.95rem" }}>Welcome back, <span className="text-primary">{mentor?.name || "Mentor"}</span></h6><small className="text-muted d-none d-lg-block">Manage your mentorship</small></div>
                    <div className="d-sm-none"><small className="fw-bold text-truncate">Hi, <span className="text-primary">{mentor?.name?.split(" ")[0] || "Mentor"}</span></small></div>
                </div>
                <div className="d-flex align-items-center gap-1 gap-md-2 flex-shrink-0">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "38px", height: "38px" }}><NotificationBell /></div>
                    <div className="d-none d-md-block" style={{ width: "1px", height: "32px", background: "#e9ecef" }}></div>
                    <Link to="/mentor/profile" className="d-flex align-items-center gap-2 text-decoration-none min-width-0"><div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "38px", height: "38px" }}><i className="bi bi-person-workspace"></i></div><div className="d-none d-md-block text-truncate"><div className="fw-semibold small text-dark text-truncate">{mentor?.name || "Mentor"}</div><small className="text-muted" style={{ fontSize: "0.7rem" }}>Mentor</small></div></Link>
                </div>
            </div>
        </nav>
    );
}
export default MentorNavbar;
