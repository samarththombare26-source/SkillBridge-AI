import { Link } from "react-router-dom";
function About() {
    return (
        <section id="about" className="about-section py-5">
            <div className="container">
                <div className="row align-items-center g-4">
                    <div className="col-lg-6">
                        <span className="section-tag"><i className="bi bi-people me-1"></i> About Us</span>
                        <h2 className="section-title display-6 mt-3">Why Choose <span className="gradient-text">SkillBridgeAI?</span></h2>
                        <p className="section-sub">SkillBridgeAI is not just an internship portal. It is a complete AI-powered career development platform that guides you from learning to earning.</p>
                        <div className="d-flex flex-column gap-2 mt-4">
                            <div className="about-check"><i className="bi bi-check-circle-fill"></i> AI-powered skill gap analysis & career matching</div>
                            <div className="about-check"><i className="bi bi-check-circle-fill"></i> Personalized roadmaps with structured lessons</div>
                            <div className="about-check"><i className="bi bi-check-circle-fill"></i> ATS-friendly resume builder with live preview</div>
                            <div className="about-check"><i className="bi bi-check-circle-fill"></i> Real mentors & verified internship listings</div>
                        </div>
                        <Link to="/register" className="btn btn-grad btn-lg mt-4">Start Free Today <i className="bi bi-arrow-right ms-2"></i></Link>
                    </div>
                    <div className="col-lg-6">
                        <div className="stat-band">
                            <div className="row g-4 text-center">
                                <div className="col-4"><h2>10K+</h2><p>Students</p></div>
                                <div className="col-4"><h2>500+</h2><p>Companies</p></div>
                                <div className="col-4"><h2>95%</h2><p>Success</p></div>
                                <div className="col-4"><h2>120+</h2><p>Mentors</p></div>
                                <div className="col-4"><h2>50+</h2><p>Roadmaps</p></div>
                                <div className="col-4"><h2>24/7</h2><p>AI Support</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default About;
