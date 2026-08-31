import { useNavigate } from "react-router-dom";
import { FaRobot, FaFileAlt, FaRoad, FaBriefcase, FaChalkboardTeacher, FaBuilding } from "react-icons/fa";
function Features() {
    const navigate = useNavigate();
    const features = [
        { icon: <FaRobot />, title: "AI Career Recommendation", description: "Answer a few questions and our AI analyzes your skills to suggest the perfect career path.", route: "/student/career-recommendation", bg: "bg-primary bg-opacity-10 text-primary", link: "Try AI Analysis" },
        { icon: <FaFileAlt />, title: "Resume Builder", description: "Create professional, ATS-friendly resumes in minutes with guided sections and live preview.", route: "/student/resume-builder", bg: "bg-primary bg-opacity-10 text-primary", link: "Build Resume" },
        { icon: <FaRoad />, title: "Career Roadmaps", description: "Follow structured, step-by-step learning roadmaps designed by industry experts.", route: "/career-roadmaps", bg: "bg-primary bg-opacity-10 text-primary", link: "View Roadmaps" },
        { icon: <FaBriefcase />, title: "Internship Portal", description: "Browse curated internships, check stipends and deadlines, and apply with one click.", route: "/student/internships", bg: "bg-primary bg-opacity-10 text-primary", link: "Find Internships" },
        { icon: <FaChalkboardTeacher />, title: "Mentor Support", description: "Connect with experienced mentors, request guidance and chat in real-time.", route: "/student/mentors", bg: "bg-primary bg-opacity-10 text-primary", link: "Meet Mentors" },
        { icon: <FaBuilding />, title: "For Recruiters", description: "Companies can post internships, manage applicants and discover talented students.", route: "/recruiter", bg: "bg-primary bg-opacity-10 text-primary", link: "Recruiter Portal" }
    ];
    return (
        <section id="features" className="features-section py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="section-tag"><i className="bi bi-grid-3x3-gap me-1"></i> Features</span>
                    <h2 className="section-title display-6 mt-3">Everything You Need to <span className="gradient-text">Get Hired</span></h2>
                    <p className="section-sub mt-2">Six powerful tools working together to make you industry-ready.</p>
                </div>
                <div className="row g-3 g-md-4">
                    {features.map((f, i) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={i}>
                            <div className="feature-card" role="button" onClick={() => navigate(f.route)} style={{ cursor: "pointer" }}>
                                <div className={`feature-icon ${f.bg}`} style={{ width: "60px", height: "60px", fontSize: "1.4rem" }}>{f.icon}</div>
                                <h5 className="fw-bold">{f.title}</h5>
                                <p className="text-muted small">{f.description}</p>
                                <span className="feature-link text-primary fw-semibold small">{f.link} <i className="bi bi-arrow-right ms-1"></i></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default Features;
