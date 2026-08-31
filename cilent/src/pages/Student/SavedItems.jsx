import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSaved } from "../../utils/bookmark";

function SavedItems() {

    const [internships, setInternships] = useState([]);
    const [courses, setCourses] = useState([]);

    const load = () => {
        setInternships(getSaved("internships"));
        setCourses(getSaved("courses"));
    };

    useEffect(() => {
        load();
        window.addEventListener("sb-bookmarks-updated", load);
        return () => window.removeEventListener("sb-bookmarks-updated", load);
    }, []);

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold mb-1"><i className="bi bi-bookmark-heart text-primary me-2"></i>Saved Items</h4>
                <p className="text-muted mb-0">Your bookmarked internships and courses.</p>
            </div>

            <div className="row g-3 g-md-4">
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-3 p-md-4">
                            <h5 className="fw-bold"><i className="bi bi-briefcase me-2 text-warning"></i>Saved Internships ({internships.length})</h5>
                            {internships.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <i className="bi bi-bookmark fs-1 d-block mb-2"></i>
                                    No saved internships yet. <Link to="/student/internships">Browse</Link>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-2 mt-3">
                                    {internships.map((it) => (
                                        <div key={it._id} className="border rounded-3 p-3 d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-semibold">{it.title || it.role}</div>
                                                <small className="text-muted">{it.company || it.location || ""}</small>
                                            </div>
                                            <Link to={`/student/internship/${it._id}`} className="btn btn-sm btn-outline-primary">View</Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-3 p-md-4">
                            <h5 className="fw-bold"><i className="bi bi-book me-2 text-primary"></i>Saved Courses ({courses.length})</h5>
                            {courses.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <i className="bi bi-bookmark fs-1 d-block mb-2"></i>
                                    No saved courses yet. <Link to="/student">Explore</Link>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-2 mt-3">
                                    {courses.map((c) => (
                                        <div key={c._id} className="border rounded-3 p-3 d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-semibold">{c.title}</div>
                                                <small className="text-muted">{c.category} • {c.level}</small>
                                            </div>
                                            <Link to={`/student/course/${c._id}`} className="btn btn-sm btn-outline-primary">Learn</Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SavedItems;
