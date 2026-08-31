import { FaStar, FaQuoteLeft } from "react-icons/fa";
function Testimonials() {
    const testimonials = [
        { name: "Rahul Patil", role: "IT Student", image: "https://randomuser.me/api/portraits/men/32.jpg", review: "SkillBridgeAI helped me improve my resume and land my first internship within two months." },
        { name: "Sneha Kulkarni", role: "Computer Engineering Student", image: "https://randomuser.me/api/portraits/women/44.jpg", review: "The AI career roadmap clearly showed what skills I needed to learn. It saved me a lot of time." },
        { name: "Akash Sharma", role: "Software Intern", image: "https://randomuser.me/api/portraits/men/65.jpg", review: "The internship recommendations matched my skills perfectly. I highly recommend SkillBridgeAI." }
    ];
    return (
        <section id="testimonials" className="testimonials-section py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="section-tag"><i className="bi bi-chat-heart me-1"></i> Testimonials</span>
                    <h2 className="section-title display-6 mt-3">Loved by <span className="gradient-text">Students</span></h2>
                    <p className="section-sub">Hear from students who started their careers with SkillBridgeAI.</p>
                </div>
                <div className="row g-4">
                    {testimonials.map((t, i) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={i}>
                            <div className="testimonial-card">
                                <FaQuoteLeft className="quote-icon" />
                                <div className="stars"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                <p className="review">"{t.review}"</p>
                                <div className="user"><img src={t.image} alt={t.name} /><div><h5>{t.name}</h5><small>{t.role}</small></div></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default Testimonials;
