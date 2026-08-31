import { Link } from "react-router-dom";
import NotificationBell from "../NotificationBell";
import GlobalSearch from "../GlobalSearch";

function Navbar({ profile, onToggle }) {
    return (
        <nav className="bg-white border-bottom sticky-top px-3 px-md-4 py-2 py-md-3 shadow-sm" style={{ zIndex: 1020 }}>
            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                <div className="d-flex align-items-center gap-2 flex-shrink-0 min-width-0">
                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center d-lg-none flex-shrink-0" onClick={onToggle} style={{ width: "38px", height: "38px", borderRadius: "8px" }}><i className="bi bi-list"></i></button>
                    <button className="btn btn-outline-secondary d-none d-lg-flex align-items-center justify-content-center flex-shrink-0" onClick={onToggle} style={{ width: "38px", height: "38px", borderRadius: "8px" }}><i className="bi bi-layout-sidebar-inset"></i></button>
                    <div className="d-none d-sm-block min-width-0">
                        <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: "0.95rem" }}>Welcome back, <span className="text-primary">{profile?.name || "Student"}</span></h6>
                        <small className="text-muted d-none d-lg-block">Continue your learning journey</small>
                    </div>
                    <div className="d-sm-none"><small className="fw-bold text-truncate">Hi, <span className="text-primary">{profile?.name?.split(" ")[0] || "Student"}</span></small></div>
                </div>
                <div className="d-none d-lg-flex flex-grow-1 justify-content-center mx-3" style={{ maxWidth: "380px" }}><GlobalSearch /></div>
                <div className="d-flex align-items-center gap-1 gap-md-2 flex-shrink-0">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "38px", height: "38px" }}><NotificationBell /></div>
                    <div className="d-none d-md-block" style={{ width: "1px", height: "32px", background: "#e9ecef" }}></div>
                    <Link to="/profile" className="d-flex align-items-center gap-2 text-decoration-none min-width-0">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "38px", height: "38px" }}><i className="bi bi-person"></i></div>
                        <div className="d-none d-md-block text-truncate"><div className="fw-semibold small text-dark text-truncate">{profile?.name || "Student"}</div><small className="text-muted text-capitalize" style={{ fontSize: "0.7rem" }}>{profile?.role || "student"}</small></div>
                    </Link>
                </div>
            </div>
            <div className="d-lg-none mt-2 w-100" style={{ minWidth: 0 }}><GlobalSearch /></div>
            <div className="d-lg-none mt-2 d-flex align-items-center gap-2 w-100">
                <Link to="/student/help-support" className="btn btn-primary rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-1 flex-shrink-0" style={{ fontSize: "0.82rem", fontWeight: "600", border: "none" }}>
                    <i className="bi bi-headset"></i> Support
                </Link>
                <Link to="/profile" className="btn btn-outline-primary rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-1 flex-shrink-0" style={{ fontSize: "0.82rem", fontWeight: "600" }}>
                    <i className="bi bi-person"></i> Profile
                </Link>
            </div>
        </nav>
    );
}
export default Navbar;
