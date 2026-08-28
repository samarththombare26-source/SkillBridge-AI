import { Link } from "react-router-dom";
import NotificationBell from "../NotificationBell";
function MentorNavbar({ mentor, onToggle }) {
    return (
        <nav className="bg-white border-bottom sticky-top px-3 px-md-4 py-3 shadow-sm" style={{ zIndex: 1020 }}>
            <div className="d-flex justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center" onClick={onToggle} style={{ width: "38px", height: "38px", borderRadius: "8px" }}><i className="bi bi-list d-lg-none"></i><i className="bi bi-layout-sidebar-inset d-none d-lg-block"></i></button>
                    <div className="d-none d-md-block"><h6 className="fw-bold mb-0">Welcome back, <span className="text-primary">{mentor?.name || "Mentor"}</span></h6><small className="text-muted d-none d-lg-block">Manage your mentorship</small></div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px" }}><NotificationBell /></div>
                    <div className="d-none d-md-block" style={{ width: "1px", height: "32px", background: "#e9ecef" }}></div>
                    <Link to="/mentor/profile" className="d-flex align-items-center gap-2 text-decoration-none"><div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px" }}><i className="bi bi-person-workspace"></i></div><div className="d-none d-md-block"><div className="fw-semibold small text-dark">{mentor?.name || "Mentor"}</div><small className="text-muted" style={{ fontSize: "0.7rem" }}>Mentor</small></div></Link>
                </div>
            </div>
        </nav>
    );
}
export default MentorNavbar;
