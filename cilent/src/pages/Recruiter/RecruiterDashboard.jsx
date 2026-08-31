import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosInstance";

function RecruiterDashboard() {

    const [stats, setStats] = useState({ internships: 0, applications: 0 });
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [internRes, appRes] = await Promise.allSettled([
                API.get("/internships"),
                API.get("/internship-applications")
            ]);
            if (internRes.status === "fulfilled") {
                setInternships(internRes.value.data.internships?.slice(0, 4) || []);
                setStats((s) => ({ ...s, internships: internRes.value.data.internships?.length || 0 }));
            }
            if (appRes.status === "fulfilled") {
                setStats((s) => ({ ...s, applications: appRes.value.data.applications?.length || appRes.value.data.internshipApplications?.length || 0 }));
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="container py-4 py-md-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="text-muted mt-3">Loading recruiter dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3 flex-column flex-sm-row">
                <div>
                    <h3 className="fw-bold mb-1">Recruiter Dashboard</h3>
                    <p className="text-muted mb-0">Welcome, {user?.name || "Recruiter"} — manage internships and applications.</p>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1"></i> Logout</button>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4 d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted small mb-1">Total Internships</p>
                                <h2 className="fw-bold mb-0">{stats.internships}</h2>
                            </div>
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center" style={{ width: "52px", height: "52px" }}><i className="bi bi-briefcase fs-4"></i></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4 d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted small mb-1">Applications Received</p>
                                <h2 className="fw-bold mb-0">{stats.applications}</h2>
                            </div>
                            <div className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center" style={{ width: "52px", height: "52px" }}><i className="bi bi-people fs-4"></i></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <p className="text-muted small mb-2">Quick Actions</p>
                            <div className="d-flex flex-wrap gap-2">
                                <Link to="/admin/create-internship" className="btn btn-primary btn-sm flex-fill flex-sm-grow-0">Post Internship</Link>
                                <Link to="/" className="btn btn-outline-secondary btn-sm">View Landing</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Recent Internships</h5>
                    {internships.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                            No internships posted yet. Create one from Admin panel or contact admin.
                        </div>
                    ) : (
                        <div className="row g-3">
                            {internships.map((intern) => (
                                <div className="col-md-6 col-lg-3" key={intern._id}>
                                    <div className="border rounded-3 p-3 h-100">
                                        <h6 className="fw-bold mb-1">{intern.title || intern.role || "Internship"}</h6>
                                        <p className="text-muted small mb-2">{intern.company || intern.location || "—"}</p>
                                        <span className="badge bg-light text-dark border">{intern.duration || intern.stipend || "—"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecruiterDashboard;
