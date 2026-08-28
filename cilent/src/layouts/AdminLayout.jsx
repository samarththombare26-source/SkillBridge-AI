import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../pages/Admin/AdminSidebar";
import AdminNavbar from "../pages/Admin/AdminNavbar";

function AdminLayout() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem("adminSidebarCollapsed") === "true");
    const [mobileOpen, setMobileOpen] = useState(false);
    useEffect(() => { localStorage.setItem("adminSidebarCollapsed", collapsed); }, [collapsed]);
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);
    useEffect(() => { const onResize = () => { if (window.innerWidth >= 992) setMobileOpen(false); }; window.addEventListener("resize", onResize); return () => window.removeEventListener("resize", onResize); }, []);
    const toggleSidebar = () => { if (window.innerWidth < 992) setMobileOpen((p) => !p); else setCollapsed((p) => !p); };
    const closeMobile = () => setMobileOpen(false);
    return (
        <div className="d-flex bg-light min-vh-100">
            <AdminSidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={toggleSidebar} onClose={closeMobile} />
            {mobileOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 1029 }} onClick={closeMobile}></div>}
            <main className="flex-grow-1" style={{ marginLeft: window.innerWidth < 992 ? 0 : (collapsed ? "70px" : "250px"), minWidth: 0, transition: "margin-left 0.3s" }}>
                <AdminNavbar onToggle={toggleSidebar} collapsed={collapsed} />
                <div className="p-3 p-md-4"><Outlet /></div>
            </main>
        </div>
    );
}
export default AdminLayout;
