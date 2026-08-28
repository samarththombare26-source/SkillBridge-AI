import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Navbar from "../components/Dashboard/Navbar";
import API from "../api/axiosInstance";

function StudentLayout() {
    const [profile, setProfile] = useState(null);
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem("studentSidebarCollapsed") === "true");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => { getProfile(); }, []);
    useEffect(() => { localStorage.setItem("studentSidebarCollapsed", collapsed); }, [collapsed]);
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 992) setMobileOpen(false); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const getProfile = async () => {
        try { const res = await API.get("/profile"); setProfile(res.data.user); } catch (e) { console.log(e); }
    };
    const toggleSidebar = () => {
        if (window.innerWidth < 992) setMobileOpen((p) => !p);
        else setCollapsed((p) => !p);
    };
    const closeMobile = () => setMobileOpen(false);

    return (
        <div className="d-flex bg-light min-vh-100">
            <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={toggleSidebar} onClose={closeMobile} />
            {mobileOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 1029 }} onClick={closeMobile}></div>}
            <main className="flex-grow-1" style={{ marginLeft: window.innerWidth < 992 ? 0 : (collapsed ? "70px" : "250px"), minWidth: 0, transition: "margin-left 0.3s" }}>
                <Navbar profile={profile} onToggle={toggleSidebar} collapsed={collapsed} />
                <div className="p-3 p-md-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
export default StudentLayout;
