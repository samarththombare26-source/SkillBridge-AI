import { useState } from "react";
function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { setError("Please fill name, email and message."); return; } setError(""); setSent(true); };
    return (
        <section id="contact" className="contact-section py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="section-tag"><i className="bi bi-envelope me-1"></i> Contact Us</span>
                    <h2 className="section-title display-6 mt-3">Get In <span className="gradient-text">Touch</span></h2>
                    <p className="section-sub">We'd love to hear from you. Reach out anytime.</p>
                </div>
                <div className="row g-4">
                    <div className="col-lg-5">
                        <div className="d-flex flex-column gap-3">
                            <div className="contact-info-box"><div className="ci-icon"><i className="bi bi-geo-alt"></i></div><div><h6 className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>Address</h6><p className="text-muted small mb-0">Pune, Maharashtra, India</p></div></div>
                            <div className="contact-info-box"><div className="ci-icon"><i className="bi bi-envelope"></i></div><div><h6 className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>Email</h6><p className="text-muted small mb-0">support@skillbridgeai.com</p></div></div>
                            <div className="contact-info-box"><div className="ci-icon"><i className="bi bi-telephone"></i></div><div><h6 className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>Phone</h6><p className="text-muted small mb-0">+91 98765 43210</p></div></div>
                            <div className="contact-info-box"><div className="ci-icon"><i className="bi bi-clock"></i></div><div><h6 className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>Working Hours</h6><p className="text-muted small mb-0">Mon – Sat : 9:00 AM – 6:00 PM</p></div></div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="contact-form-card">
                            {sent ? (
                                <div className="text-center py-4">
                                    <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}><i className="bi bi-check-lg fs-3"></i></div>
                                    <h5 className="fw-bold">Message Sent!</h5><p className="text-muted small">Thanks {form.name.split(" ")[0]}, we will get back within 24 hours.</p>
                                    <button className="btn btn-outline-primary" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>Send Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3"><input type="text" name="name" className="form-control" placeholder="Your Name *" value={form.name} onChange={handleChange} /></div>
                                        <div className="col-md-6 mb-3"><input type="email" name="email" className="form-control" placeholder="Your Email *" value={form.email} onChange={handleChange} /></div>
                                    </div>
                                    <div className="mb-3"><input type="text" name="subject" className="form-control" placeholder="Subject" value={form.subject} onChange={handleChange} /></div>
                                    <div className="mb-3"><textarea name="message" className="form-control" rows="4" placeholder="Write your message... *" value={form.message} onChange={handleChange}></textarea></div>
                                    {error && <div className="alert alert-danger py-2 small">{error}</div>}
                                    <button type="submit" className="btn btn-primary"><i className="bi bi-send me-2"></i>Send Message</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Contact;
