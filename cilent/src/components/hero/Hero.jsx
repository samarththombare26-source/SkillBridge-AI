import { Link } from "react-router-dom";
function Hero() {
    return (
        <section id="home" className="hero-section">
            <div className="container position-relative">
                <div className="row align-items-center g-4">
                    <div className="col-12 col-lg-6 text-center text-lg-start">
                        <span className="hero-badge"><i className="bi bi-stars"></i> AI-Powered Career Platform</span>
                        <h1 className="hero-title mt-3 mt-md-4">Build Your Career <span className="gradient-text">with AI</span></h1>
                        <p className="hero-subtitle mt-3 mx-auto mx-lg-0">Discover internships, analyze your skill gaps, build professional resumes and get mentored by industry experts — all in one platform.</p>
                        <div className="d-flex flex-column flex-sm-row flex-wrap gap-3 mt-4 justify-content-center justify-content-lg-start">
                            <Link to="/register" className="btn btn-grad btn-lg">Get Started Free <i className="bi bi-arrow-right ms-2"></i></Link>
                            <a href="#features" className="btn btn-ghost btn-lg">Explore Features</a>
                        </div>
                        <div className="row mt-4 mt-md-5 text-center text-lg-start hero-stat mx-auto mx-lg-0" style={{ maxWidth: "420px" }}>
                            <div className="col-4"><h3>10K+</h3><small>Active Students</small></div>
                            <div className="col-4"><h3>500+</h3><small>Companies</small></div>
                            <div className="col-4"><h3>95%</h3><small>Success Rate</small></div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="hero-visual mx-auto" style={{ maxWidth: "520px" }}>
                            <div className="float-chip chip-1"><span className="fc-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#059669" }}><i className="bi bi-file-earmark-check"></i></span>Resume Score <span className="text-success">92%</span></div>
                            <div className="float-chip chip-2"><span className="fc-icon" style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}><i className="bi bi-person-workspace"></i></span>Mentor Connected <i className="bi bi-check-circle-fill text-primary"></i></div>
                            <div className="mockup">
                                <div className="mockup-bar"><span className="mockup-dot" style={{ background: "#f87171" }}></span><span className="mockup-dot" style={{ background: "#fbbf24" }}></span><span className="mockup-dot" style={{ background: "#34d399" }}></span></div>
                                <div className="mockup-body">
                                    <div className="mockup-side"><span className="active"><i className="bi bi-speedometer2"></i></span><span><i className="bi bi-briefcase"></i></span><span><i className="bi bi-file-earmark-person"></i></span><span><i className="bi bi-people"></i></span><span><i className="bi bi-stars"></i></span></div>
                                    <div className="mockup-main">
                                        <div className="mockup-line w-40"></div><div className="mockup-line w-80"></div>
                                        <div className="mockup-cards"><div className="mockup-card"><div className="mc-value">24</div><div className="mc-label">Internships</div></div><div className="mockup-card"><div className="mc-value">8</div><div className="mc-label">Mentors</div></div><div className="mockup-card"><div className="mc-value">75%</div><div className="mc-label">Progress</div></div></div>
                                        <div className="mockup-chart"><span style={{ height: "40%" }}></span><span style={{ height: "65%" }}></span><span style={{ height: "45%" }}></span><span style={{ height: "85%" }}></span><span style={{ height: "60%" }}></span><span style={{ height: "95%" }}></span><span style={{ height: "72%" }}></span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Hero;
