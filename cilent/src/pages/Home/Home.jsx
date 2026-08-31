import { useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/hero/Hero";
import Features from "../../components/features/Features";
import About from "../../components/about/About";
import Process from "../../components/process/Process";
import Testimonials from "../../testimonials/Testimonials";
import Contact from "../../components/contact/Contact";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";
function Home() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
        }, { threshold: 0.12 });
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
    return (
        <div className="landing">
            <Navbar />
            <Hero />
            <Features />
            <About />
            <Process />
            <section className="py-5">
                <div className="container">
                    <div className="cta-banner">
                        <div className="row align-items-center g-3">
                            <div className="col-12 col-lg-8">
                                <h2 className="fw-bold">Ready to launch your career?</h2>
                                <p className="mb-0 opacity-75">Join 10,000+ students using SkillBridgeAI to learn faster and get hired.</p>
                            </div>
                            <div className="col-12 col-lg-4 text-lg-end mt-3 mt-lg-0 d-flex flex-wrap gap-2 justify-content-lg-end">
                                <Link to="/register" className="btn btn-light text-primary fw-bold flex-fill flex-sm-grow-0">Create Free Account</Link>
                                <a href="#features" className="btn btn-outline-light flex-fill flex-sm-grow-0">See Features</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Testimonials />
            <Contact />
            <Footer />
        </div>
    );
}
export default Home;
