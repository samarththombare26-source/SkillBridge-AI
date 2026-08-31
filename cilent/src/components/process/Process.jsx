import { Link } from "react-router-dom";
import { FaUserPlus, FaUserEdit, FaRobot, FaRoad, FaBriefcase, FaCheckCircle } from "react-icons/fa";
function Process() {
    const steps = [
        { icon: <FaUserPlus />, title: "Create Account", description: "Sign up free and tell us who you are." },
        { icon: <FaUserEdit />, title: "Complete Profile", description: "Add your education, skills and interests." },
        { icon: <FaRobot />, title: "AI Analysis", description: "AI finds your strengths and skill gaps." },
        { icon: <FaRoad />, title: "Get Roadmap", description: "Receive your personalized learning path." },
        { icon: <FaBriefcase />, title: "Apply to Internships", description: "Apply to roles matching your profile." },
        { icon: <FaCheckCircle />, title: "Get Hired", description: "Start your professional career journey." }
    ];
    return (
        <section id="process" className="process-section py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="section-tag"><i className="bi bi-diagram-3 me-1"></i> How It Works</span>
                    <h2 className="section-title display-6 mt-3">Your Career Journey in <span className="gradient-text">6 Steps</span></h2>
                    <p className="section-sub">From sign-up to your first offer letter — we guide you all the way.</p>
                </div>
                <div className="row g-3 g-md-4">
                    {steps.map((s, i) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={i}>
                            <div className="process-card">
                                <div className="process-number">{i + 1}</div>
                                <div className="process-icon">{s.icon}</div>
                                <h6 className="fw-bold">{s.title}</h6>
                                <p className="text-muted small mb-0">{s.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4"><Link to="/register" className="btn btn-grad btn-lg">Begin Step 1 — It's Free <i className="bi bi-arrow-right ms-2"></i></Link></div>
            </div>
        </section>
    );
}
export default Process;
