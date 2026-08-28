import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MentorSidebar from "../components/MentorDashboard/MentorSidebar";
import MentorNavbar from "../components/MentorDashboard/MentorNavbar";
import API from "../api/axiosInstance";

function MentorLayout() {
    const [mentor, setMentor] = useState(null);
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem("mentorSidebarCollapsed") === "true");
    const [mobileOpen, setMobileOpen] = useState(false);
    useEffect(() => { getMentorProfile(); }, []);
    useEffect(() => { localStorage.setItem("mentorSidebarCollapsed", collapsed); }, [collapsed]);
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);
    useEffect(() => { const onResize = () => { if (window.innerWidth >= 992) setMobileOpen(false); }; window.addEventListener("resize", onResize); return () => window.removeEventListener("resize", onResize); }, []);
    const getMentorProfile = async () => { try { const res = await API.get("/mentor/profile"); setMentor(res.data.mentor); } catch (e) { console.log(e); setMentor(null); } };
    const toggleSidebar = () => { if (window.innerWidth < 992) setMobileOpen((p) => !p); else setCollapsed((p) => !p); };
    const closeMobile = () => setMobileOpen(false);
    return (
        <div className="d-flex bg-light min-vh-100">
            <MentorSidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={toggleSidebar} onClose={closeMobile} />
            {mobileOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 1029 }} onClick={closeMobile}></div>}
            <main className="flex-grow-1" style={{ marginLeft: window.innerWidth < 992 ? 0 : (collapsed ? "70px" : "250px"), minWidth: 0, transition: "margin-left 0.3s" }}>
                <MentorNavbar mentor={mentor} onToggle={toggleSidebar} collapsed={collapsed} />
                <div className="p-3 p-md-4"><Outlet /></div>
            </main>
        </div>
    );
}
export default MentorLayout;
