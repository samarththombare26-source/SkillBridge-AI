import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getRole, getDashboardPath, logout as clearAuth } from "../../utils/auth";
const SECTIONS = ["home", "features", "about", "process", "testimonials", "contact"];
function Navbar() {
    const [active, setActive] = useState("home");
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    const navigate = useNavigate();
    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 12);
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
            let cur = "home";
            SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop - 120) cur = id; });
            setActive(cur);
        };
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    const dashboardPath = getDashboardPath(getRole());
    const handleLogout = () => { clearAuth(); setLoggedIn(false); navigate("/"); };
    const closeMenu = () => { const el = document.getElementById("landingNav"); if (el) el.classList.remove("show"); };
    return (
        <>
            <div className="scroll-progress" style={{ width: `${progress}%` }}></div>
            <nav className={`navbar navbar-expand-lg landing-nav ${scrolled ? "scrolled" : ""}`}>
                <div className="container">
                    <Link className="navbar-brand brand-logo" to="/" onClick={closeMenu}><i className="bi bi-lightning-charge-fill me-1"></i>SkillBridgeAI</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#landingNav"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="landingNav">
                        <ul className="navbar-nav ms-auto align-items-lg-center">
                            {SECTIONS.map((id) => (
                                <li className="nav-item" key={id}><a href={`#${id}`} className={`nav-link ${active === id ? "active" : ""}`} onClick={closeMenu}>{id === "home" ? "Home" : id === "process" ? "How It Works" : id.charAt(0).toUpperCase() + id.slice(1)}</a></li>
                            ))}
                        </ul>
                        <div className="d-flex flex-column flex-lg-row gap-2 ms-lg-3 mt-3 mt-lg-0">
                            {loggedIn ? (
                                <>
                                    <Link to={dashboardPath} className="btn btn-grad" onClick={closeMenu}><i className="bi bi-speedometer2 me-1"></i> Dashboard</Link>
                                    <button className="btn btn-ghost" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1"></i> Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-ghost" onClick={closeMenu}><i className="bi bi-box-arrow-in-right me-1"></i> Login</Link>
                                    <Link to="/register" className="btn btn-grad" onClick={closeMenu}><i className="bi bi-person-plus me-1"></i> Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
export default Navbar;
