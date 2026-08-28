import { Link, useNavigate, useLocation } from "react-router-dom";
function Sidebar({ collapsed = false, mobileOpen = false, onToggle, onClose }) {
    const navigate = useNavigate(); const location = useLocation();
    const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };
    const isActive = (path) => path === "/student" ? location.pathname === "/student" : location.pathname.startsWith(path);
    const menuItems = [
        { name: "Dashboard", path: "/student", icon: "bi-speedometer2" },
        { name: "Career Recommendation", path: "/student/career-recommendation", icon: "bi-stars" },
        {
            name: "Resume Builder",
            path: "/student/resume-builder",
            icon: "bi-file-earmark-person"
        },

        {
            name: "Resume Analyzer",
            path: "/student/resume-analyze",
            icon: "bi-file-earmark-check"
        },
        { name: "Internships", path: "/student/internships", icon: "bi-briefcase" },
        { name: "Find Mentors", path: "/student/mentors", icon: "bi-person-workspace" },
        { name: "My Mentors", path: "/student/my-mentors", icon: "bi-people" },
        { name: "My Applications", path: "/student/my-applications", icon: "bi-journal-check" },
        { name: "Certificates", path: "/student/certificates", icon: "bi-award" },
        { name: "Skill Quiz", path: "/student/skill-quiz", icon: "bi-patch-question" },
        { name: "Saved Items", path: "/student/saved", icon: "bi-bookmark-heart" },
        { name: "My Profile", path: "/profile", icon: "bi-person-circle" }
    ];
    const width = mobileOpen ? "280px" : collapsed ? "72px" : "250px";
    const displayClass = mobileOpen ? "d-flex" : "d-none d-lg-flex";
    return (
        <aside className={`app-sidebar d-flex flex-column text-white ${collapsed ? "collapsed" : ""} ${displayClass} ${mobileOpen ? "mobile-open" : ""}`} style={{ width, minWidth: width, zIndex: 1030 }}>
            <div className={`d-flex align-items-center p-3 ${collapsed && !mobileOpen ? "justify-content-center" : "justify-content-between"}`}>
                {(!collapsed || mobileOpen) && <div><h6 className="sidebar-brand mb-0">SkillBridgeAI</h6><small className="sidebar-subtitle text-secondary" style={{ fontSize: "0.7rem" }}>Student Portal</small></div>}
                <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-secondary border-0 text-white d-none d-lg-flex" onClick={onToggle} style={{ width: "32px", height: "32px" }}><i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i></button>
                    {mobileOpen && <button className="btn btn-sm btn-outline-light border-0 d-lg-none" onClick={onClose} style={{ width: "32px", height: "32px" }}><i className="bi bi-x-lg"></i></button>}
                    {!mobileOpen && <button className="btn btn-sm btn-outline-light border-0 d-lg-none" onClick={onToggle} style={{ width: "32px", height: "32px" }}><i className="bi bi-list"></i></button>}
                </div>
            </div>
            {collapsed && !mobileOpen && <div className="text-center"><small className="sidebar-brand" style={{ fontSize: "0.75rem" }}>SB</small></div>}
            <hr className="border-secondary opacity-25 mx-3 my-2" />
            <div className="px-2 flex-grow-1 overflow-auto">
                {(!collapsed || mobileOpen) && <small className="sidebar-section px-2">Main Menu</small>}
                <nav className="nav flex-column gap-1 mt-2">
                    {menuItems.map((item) => (
                        <Link key={item.path} to={item.path} onClick={mobileOpen ? onClose : undefined} className={`sidebar-link ${isActive(item.path) ? "active" : ""} ${collapsed && !mobileOpen ? "justify-content-center" : ""}`} title={collapsed && !mobileOpen ? item.name : undefined}>
                            <i className={`bi ${item.icon}`}></i>
                            <span className="sidebar-brand-text">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-2 mt-auto">
                <hr className="border-secondary opacity-25" />
                <button className={`sidebar-footer-btn ${collapsed && !mobileOpen ? "justify-content-center" : ""}`}><i className="bi bi-question-circle"></i><span className="sidebar-brand-text">{(!collapsed || mobileOpen) && "Help & Support"}</span></button>
                <button className={`sidebar-footer-btn danger ${collapsed && !mobileOpen ? "justify-content-center" : ""}`} onClick={handleLogout}><i className="bi bi-box-arrow-right"></i><span className="sidebar-brand-text">{(!collapsed || mobileOpen) && "Logout"}</span></button>
            </div>
        </aside>
    );
}
export default Sidebar;
