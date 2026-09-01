import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HelpSupport() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("faq");
    const [searchQuery, setSearchQuery] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        console.log("HelpSupport page mounted");
        console.log("Current path:", window.location.pathname);
    }, []);

    const faqData = [
        {
            question: "How do I enroll in a course?",
            answer: "Browse the available courses on your dashboard, click on a course to view details, and press the 'Enroll Now' button. Once enrolled, you can access all lessons and track your progress.",
            icon: "bi-card-checklist"
        },
        {
            question: "How does the AI Career Recommendation work?",
            answer: "Our AI analyzes your profile, completed courses, skills, and career interests to suggest the best career path for you. It provides a match score, required skills, and a learning roadmap.",
            icon: "bi-lightbulb"
        },
        {
            question: "Can I change my password?",
            answer: "Yes! Click on 'Forgot Password' on the login page or go to your profile settings. Enter your registered email to receive an OTP, verify it, and set your new password.",
            icon: "bi-key"
        },
        {
            question: "How do I connect with a mentor?",
            answer: "Browse mentor profiles, select one that matches your needs, and send a mentorship request. Once the mentor accepts, you can start a real-time chat conversation.",
            icon: "bi-people"
        },
        {
            question: "What is the 80% watch time rule?",
            answer: "To earn a certificate for a course, you must watch at least 80% of each lesson video. This ensures you have properly engaged with the content before receiving certification.",
            icon: "bi-clock"
        },
        {
            question: "How do I build my resume?",
            answer: "Go to the Resume Builder page and fill in your personal details, education, skills, projects, and experience. The tool generates a professional resume that you can download and use.",
            icon: "bi-file-earmark-person"
        },
        {
            question: "How does the Resume Analyzer work?",
            answer: "Upload your resume or paste its content. Our AI analyzes it against ATS standards, checks for missing keywords, and provides a score along with improvement suggestions.",
            icon: "bi-file-earmark-check"
        },
        {
            question: "Can I save courses or internships for later?",
            answer: "Yes! Click the bookmark heart icon on any course or internship card to save it. You can access all your saved items from the 'Saved Items' page on your dashboard.",
            icon: "bi-bookmark-heart"
        },
        {
            question: "How do I contact support?",
            answer: "You can reach our support team through the chat widget on this page, email us at support@skillbridgeai.com, or use the live chat feature available on your dashboard.",
            icon: "bi-headset"
        },
        {
            question: "Is the platform mobile-friendly?",
            answer: "Yes! SkillBridgeAI is fully responsive and works seamlessly on phones, tablets, and desktops. All features are accessible from any device with a modern browser.",
            icon: "bi-phone"
        }
    ];

    const filteredFaq = faqData.filter(
        (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="help-support-page page-fade">
            {/* HEADER BANNER */}
            <div
                className="position-relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
                    padding: "3rem 1.5rem",
                    minHeight: "220px",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8 text-white">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="badge bg-white text-primary bg-opacity-25 border border-white border-opacity-25 px-3 py-2" style={{ fontSize: "0.8rem" }}>
                                    <i className="bi bi-headset me-1"></i> Help Center
                                </span>
                            </div>
                            <h1 className="fw-bold mb-2" style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}>
                                Help & <span className="text-light">Support</span>
                            </h1>
                            <p className="mb-0 opacity-75" style={{ maxWidth: "500px" }}>
                                Find answers to frequently asked questions, contact our support team, or browse our knowledge base.
                            </p>
                        </div>
                        <div className="col-md-4 text-center text-md-end d-none d-md-block">
                            <div className="bg-white bg-opacity-10 rounded-4 p-3 d-inline-block">
                                <i className="bi bi-question-circle" style={{ fontSize: "3rem", color: "#60a5fa" }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container py-4 py-md-5">
                {/* SEARCH BAR */}
                <div className="mb-4">
                    <div className="global-search-bar position-relative" style={{ maxWidth: "600px", margin: "0 auto" }}>
                        <span className="position-absolute top-50 start-0 translate-middle-y text-secondary px-3" style={{ left: "16px", zIndex: "2" }}>
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control rounded-pill ps-5 py-3 border-0 shadow-sm"
                            style={{ border: "1px solid #e2e8f0", fontSize: "0.95rem" }}
                            placeholder="Search questions, topics, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="btn btn-sm btn-outline-secondary rounded-circle position-absolute top-50 end-0 translate-middle-y"
                                style={{ right: "8px", zIndex: "2", border: "none", padding: "4px 8px" }}
                                onClick={() => setSearchQuery("")}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* TABS */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group btn-group-lg rounded-pill p-1 bg-light border" style={{ width: "fit-content" }}>
                        <button
                            className={`btn rounded-pill px-4 px-md-5 ${activeTab === "faq" ? "btn-primary" : "btn-light text-dark"}`}
                            onClick={() => setActiveTab("faq")}
                            style={{ fontWeight: "600", border: "none" }}
                        >
                            <i className="bi bi-question-circle me-2"></i>FAQ
                        </button>
                        <button
                            className={`btn rounded-pill px-4 px-md-5 ${activeTab === "support" ? "btn-primary" : "btn-light text-dark"}`}
                            onClick={() => setActiveTab("support")}
                            style={{ fontWeight: "600", border: "none" }}
                        >
                            <i className="bi bi-headset me-2"></i>Contact Support
                        </button>
                        <button
                            className={`btn rounded-pill px-4 px-md-5 ${activeTab === "guide" ? "btn-primary" : "btn-light text-dark"}`}
                            onClick={() => setActiveTab("guide")}
                            style={{ fontWeight: "600", border: "none" }}
                        >
                            <i className="bi bi-book me-2"></i>Guides
                        </button>
                    </div>
                </div>

                {/* FAQ TAB */}
                {activeTab === "faq" && (
                    <div className="row g-4">
                        <div className="col-lg-8 mx-auto">
                            {filteredFaq.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                                    <p className="text-muted">No results found for "{searchQuery}". Try different keywords.</p>
                                </div>
                            ) : (
                                <div className="accordion" id="faqAccordion">
                                    {filteredFaq.map((item, index) => (
                                        <div className="accordion-item border-0 mb-2 rounded-3 overflow-hidden" key={index}>
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button collapsed rounded-3 py-3 px-4"
                                                    style={{ fontWeight: "600", fontSize: "0.95rem" }}
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#faq${index}`}
                                                    aria-expanded="false"
                                                    aria-controls={`faq${index}`}
                                                >
                                                    <i className={`bi ${item.icon} text-primary me-3`}></i>
                                                    {item.question}
                                                </button>
                                            </h2>
                                            <div id={`faq${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                <div className="accordion-body p-4 pt-0 ps-5 text-muted" style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SUPPORT TAB */}
                {activeTab === "support" && (
                    <div className="row g-4">
                        <div className="col-lg-7 mx-auto">
                            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "60px", height: "60px" }}>
                                        <i className="bi bi-headset fs-3"></i>
                                    </div>
                                    <h4 className="fw-bold">Get in Touch</h4>
                                    <p className="text-muted mb-0">Our support team usually responds within 24 hours.</p>
                                </div>

                                {submitted && (
                                    <div className="alert alert-success rounded-3 py-3 text-center" role="alert">
                                        <i className="bi bi-check-circle-fill me-2"></i> Your ticket has been submitted successfully! We'll get back to you soon.
                                    </div>
                                )}

                                <form onSubmit={handleSubmitTicket}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-dark">Full Name</label>
                                        <input type="text" className="form-control rounded-2 py-2" placeholder="Enter your full name" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-dark">Email Address</label>
                                        <input type="email" className="form-control rounded-2 py-2" placeholder="Enter your email" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-dark">Subject</label>
                                        <select className="form-select rounded-2 py-2" required>
                                            <option value="">Select a subject</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="account">Account Problem</option>
                                            <option value="feedback">Feedback / Suggestion</option>
                                            <option value="billing">Billing / Payment</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-dark">Message</label>
                                        <textarea
                                            className="form-control rounded-2 py-2"
                                            rows="5"
                                            placeholder="Describe your issue or question in detail..."
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 rounded-3 py-3 fw-semibold">
                                        <i className="bi bi-paper-plane me-2"></i>Submit Support Ticket
                                    </button>
                                </form>
                            </div>

                            {/* Contact Info Cards */}
                            <div className="row g-3 mt-3">
                                <div className="col-6">
                                    <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100">
                                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "44px", height: "44px" }}>
                                            <i className="bi bi-envelope"></i>
                                        </div>
                                        <small className="fw-semibold text-dark">Email</small>
                                        <p className="text-muted small mb-0">support@skillbridgeai.com</p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100">
                                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "44px", height: "44px" }}>
                                            <i className="bi bi-chat-left-dots"></i>
                                        </div>
                                        <small className="fw-semibold text-dark">Live Chat</small>
                                        <p className="text-muted small mb-0">Available 24/7</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GUIDE TAB */}
                {activeTab === "guide" && (
                    <div className="row g-4">
                        <div className="col-lg-8 mx-auto">
                            <div className="row g-4">
                                {[
                                    {
                                        title: "Getting Started",
                                        desc: "Learn how to create an account, set up your profile, and navigate the platform to make the most of your learning journey.",
                                        icon: "bi-rocket-takeoff",
                                        color: "primary",
                                        steps: ["Create your account", "Set up your profile", "Explore the dashboard", "Start your first course"]
                                    },
                                    {
                                        title: "Course Learning",
                                        desc: "Follow structured lessons, track your progress, and earn certificates upon completion with our 80% watch time system.",
                                        icon: "bi-book",
                                        color: "success",
                                        steps: ["Browse available courses", "Enroll in a course", "Watch lessons", "Complete the course"]
                                    },
                                    {
                                        title: "Mentorship",
                                        desc: "Connect with experienced mentors, send requests, and get personalized career guidance through real-time chat.",
                                        icon: "bi-people",
                                        color: "warning",
                                        steps: ["Find a mentor", "Send a request", "Get accepted", "Start chatting"]
                                    },
                                    {
                                        title: "AI Features",
                                        desc: "Use our AI-powered career recommendations, skill quizzes, and resume analysis to enhance your career preparation.",
                                        icon: "bi-robot",
                                        color: "info",
                                        steps: ["Update your profile", "Get career recommendation", "Take a skill quiz", "Analyze your resume"]
                                    },
                                    {
                                        title: "Resume Building",
                                        desc: "Create a professional resume from your profile data, customize it, and download it for job and internship applications.",
                                        icon: "bi-file-earmark-person",
                                        color: "danger",
                                        steps: ["Go to Resume Builder", "Fill in your details", "Preview your resume", "Download PDF"]
                                    },
                                    {
                                        title: "Account Settings",
                                        desc: "Manage your profile, change your password, handle notifications, and customize your learning preferences.",
                                        icon: "bi-gear",
                                        color: "secondary",
                                        steps: ["Go to Profile", "Edit personal info", "Change password", "Manage notifications"]
                                    }
                                ].map((guide, index) => (
                                    <div className="col-md-6" key={index}>
                                        <div className="card border-0 shadow-sm h-100 rounded-4 p-4 position-relative overflow-hidden" style={{ borderTop: "4px solid", borderTopColor: `var(--bs-${guide.color})` }}>
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <div className={`bg-${guide.color} bg-opacity-10 text-${guide.color} rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: "50px", height: "50px" }}>
                                                    <i className={`bi ${guide.icon} fs-4`}></i>
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-0">{guide.title}</h5>
                                                </div>
                                            </div>
                                            <p className="text-muted small mb-3">{guide.desc}</p>
                                            <div className="bg-light rounded-3 p-3">
                                                <small className="text-muted fw-semibold mb-2 d-block">Quick Steps:</small>
                                                {guide.steps.map((step, i) => (
                                                    <div key={i} className="d-flex align-items-center gap-2 mb-1">
                                                        <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "22px", height: "22px", fontSize: "0.65rem" }}>{i + 1}</span>
                                                        <small className="text-dark">{step}</small>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HelpSupport;