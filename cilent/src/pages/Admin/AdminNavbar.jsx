function AdminNavbar({ onToggle }) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return (
        <nav className="bg-white border-bottom sticky-top px-3 px-md-4 py-3 shadow-sm" style={{ zIndex: 1020 }}>
            <div className="d-flex justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center" onClick={onToggle} style={{ width: "38px", height: "38px", borderRadius: "8px" }}><i className="bi bi-list d-lg-none"></i><i className="bi bi-layout-sidebar-inset d-none d-lg-block"></i></button>
                    <div className="d-none d-md-block"><h6 className="fw-bold mb-0">Welcome back, <span className="text-primary">{user?.name || "Admin"}</span></h6><small className="text-muted d-none d-lg-block">Manage SkillBridgeAI platform</small></div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px" }}><i className="bi bi-bell"></i></button>
                    <div className="d-none d-md-block" style={{ width: "1px", height: "32px", background: "#e9ecef" }}></div>
                    <div className="d-flex align-items-center gap-2"><div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px" }}><i className="bi bi-shield-lock"></i></div><div className="d-none d-md-block"><div className="fw-semibold small">{user?.name || "Admin"}</div><small className="text-muted" style={{ fontSize: "0.7rem" }}>Administrator</small></div></div>
                </div>
            </div>
        </nav>
    );
}
export default AdminNavbar;
