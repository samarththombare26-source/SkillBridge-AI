import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
function Footer() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const handleSubscribe = (e) => { e.preventDefault(); if (!email.trim()) return; setSubscribed(true); setEmail(""); };
    const goTo = (path) => navigate(path);
    return (
        <footer className="landing-footer">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <h5 className="footer-logo">SkillBridgeAI</h5>
                        <p className="small">An AI-powered platform that helps students build careers through internships, resume building, mentor guidance and roadmaps.</p>
                        <div className="d-flex gap-2 mt-3">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn"><FaFacebookF /></a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn"><FaInstagram /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn"><FaLinkedinIn /></a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn"><FaGithub /></a>
                        </div>
                    </div>
                    <div className="col-6 col-lg-2">
                        <h6>Quick Links</h6>
                        <div className="d-flex flex-column gap-1">
                            <Link to="/" className="footer-link">Home</Link>
                            <a href="#features" className="footer-link">Features</a>
                            <a href="#about" className="footer-link">About</a>
                            <a href="#process" className="footer-link">How It Works</a>
                            <a href="#contact" className="footer-link">Contact</a>
                        </div>
                    </div>
                    <div className="col-6 col-lg-2">
                        <h6>Features</h6>
                        <div className="d-flex flex-column gap-1">
                            <button className="footer-service" onClick={() => goTo("/student/career-recommendation")}>AI Career Match</button>
                            <button className="footer-service" onClick={() => goTo("/student/resume-builder")}>Resume Builder</button>
                            <button className="footer-service" onClick={() => goTo("/career-roadmaps")}>Career Roadmaps</button>
                            <button className="footer-service" onClick={() => goTo("/student/internships")}>Internships</button>
                            <button className="footer-service" onClick={() => goTo("/student/mentors")}>Mentor Support</button>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <h6>Stay Updated</h6>
                        <p className="small">Get new internships and career tips.</p>
                        {subscribed ? (
                            <div className="alert alert-success py-2 small"><i className="bi bi-check-circle me-1"></i> Subscribed! Welcome.</div>
                        ) : (
                            <form className="newsletter-box" onSubmit={handleSubscribe}>
                                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <button type="submit">Subscribe</button>
                            </form>
                        )}
                        <div className="small mt-3">
                            <div><i className="bi bi-telephone me-2"></i>+91 98765 43210</div>
                            <div><i className="bi bi-envelope me-2"></i>support@skillbridgeai.com</div>
                            <div><i className="bi bi-geo-alt me-2"></i>Pune, Maharashtra</div>
                        </div>
                    </div>
                </div>
                <hr className="border-secondary mt-4" />
                <div className="d-flex justify-content-between align-items-center py-3">
                    <small>© 2026 SkillBridgeAI | All Rights Reserved</small>
                    <a href="#home" className="top-btn"><i className="bi bi-arrow-up"></i></a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
