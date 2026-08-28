import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function CareerRecommendation() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        skills: "",
        interests: "",
        education: "",
        experience: "",
        careerGoal: ""
    });

    const [recommendations, setRecommendations] = useState([]);

    const [details, setDetails] = useState([]);

    const [isTrueAI, setIsTrueAI] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ==========================================
    // GENERATE RECOMMENDATION
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setRecommendations([]);
        setDetails([]);
        setIsTrueAI(false);


        if (
            !formData.skills.trim() ||
            !formData.interests.trim() ||
            !formData.education.trim()
        ) {

            setError(
                "Please fill in Skills, Interests and Education."
            );

            return;

        }


        try {

            setLoading(true);


            const response = await API.post(
                "/career/recommend",
                {
                    skills: formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),

                    interests: formData.interests
                        .split(",")
                        .map((interest) => interest.trim())
                        .filter(Boolean),

                    education: formData.education,

                    experience: formData.experience,

                    careerGoal: formData.careerGoal
                }
            );


            setRecommendations(
                response.data.recommendations || []
            );

            setDetails(
                response.data.details || []
            );

            setIsTrueAI(
                response.data.isTrueAI || false
            );


            setSuccess(
                response.data.message ||
                "Career recommendations generated successfully!"
            );


        } catch (error) {

            console.log(
                "Career Recommendation Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to generate career recommendations."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="container-fluid bg-light min-vh-100 py-4">

            <div className="container">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h3 className="fw-bold mb-1">

                            <i className="bi bi-stars text-primary me-2"></i>

                            AI Career Recommendation

                        </h3>

                        <p className="text-muted mb-0">

                            Discover career paths based on your
                            skills, interests and goals.

                        </p>

                    </div>


                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/student")}
                    >

                        <i className="bi bi-arrow-left me-2"></i>

                        Dashboard

                    </button>

                </div>


                <div className="row g-4">


                    {/* ==========================================
                        FORM
                    ========================================== */}

                    <div className="col-lg-7">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">

                                    <i className="bi bi-person-lines-fill text-primary me-2"></i>

                                    Tell us about yourself

                                </h5>


                                {error && (

                                    <div className="alert alert-danger">

                                        <i className="bi bi-exclamation-circle me-2"></i>

                                        {error}

                                    </div>

                                )}


                                {success && (

                                    <div className="alert alert-success">

                                        <i className="bi bi-check-circle me-2"></i>

                                        {success}

                                    </div>

                                )}


                                <form onSubmit={handleSubmit}>


                                    {/* Skills */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">

                                            Skills

                                        </label>

                                        <input
                                            type="text"
                                            name="skills"
                                            className="form-control"
                                            placeholder="e.g. JavaScript, React, Node.js"
                                            value={formData.skills}
                                            onChange={handleChange}
                                        />

                                        <small className="text-muted">

                                            Separate multiple skills with commas.

                                        </small>

                                    </div>


                                    {/* Interests */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">

                                            Interests

                                        </label>

                                        <input
                                            type="text"
                                            name="interests"
                                            className="form-control"
                                            placeholder="e.g. Web Development, AI, Data Science"
                                            value={formData.interests}
                                            onChange={handleChange}
                                        />

                                        <small className="text-muted">

                                            Tell us what technology areas
                                            interest you.

                                        </small>

                                    </div>


                                    {/* Education */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">

                                            Education

                                        </label>

                                        <input
                                            type="text"
                                            name="education"
                                            className="form-control"
                                            placeholder="e.g. Diploma in Information Technology"
                                            value={formData.education}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    {/* Experience */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">

                                            Experience

                                        </label>

                                        <textarea
                                            name="experience"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describe your projects, internships or experience..."
                                            value={formData.experience}
                                            onChange={handleChange}
                                        ></textarea>

                                    </div>


                                    {/* Career Goal */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">

                                            Career Goal

                                        </label>

                                        <textarea
                                            name="careerGoal"
                                            className="form-control"
                                            rows="3"
                                            placeholder="e.g. I want to become a full-stack developer..."
                                            value={formData.careerGoal}
                                            onChange={handleChange}
                                        ></textarea>

                                    </div>


                                    {/* Submit */}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-semibold"
                                        disabled={loading}
                                    >

                                        {loading ? (

                                            <>

                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Analyzing Your Profile...

                                            </>

                                        ) : (

                                            <>

                                                <i className="bi bi-stars me-2"></i>

                                                Get AI Career Recommendations

                                            </>

                                        )}

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        INFORMATION CARD
                    ========================================== */}

                    <div className="col-lg-5">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body p-4">

                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center mb-4"
                                    style={{
                                        width: "60px",
                                        height: "60px"
                                    }}
                                >

                                    <i className="bi bi-robot fs-3"></i>

                                </div>


                                <h5 className="fw-bold">

                                    How it works

                                </h5>


                                <p className="text-muted">

                                    Our career recommendation system
                                    analyzes your information and suggests
                                    suitable technology careers.

                                </p>


                                <div className="mb-3">

                                    <div className="d-flex">

                                        <i className="bi bi-1-circle-fill text-primary fs-4 me-3"></i>

                                        <div>

                                            <strong>Enter your skills</strong>

                                            <p className="text-muted small mb-0">

                                                Tell us what technologies
                                                you already know.

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="mb-3">

                                    <div className="d-flex">

                                        <i className="bi bi-2-circle-fill text-primary fs-4 me-3"></i>

                                        <div>

                                            <strong>Share your interests</strong>

                                            <p className="text-muted small mb-0">

                                                Tell us which technology
                                                fields interest you.

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="mb-3">

                                    <div className="d-flex">

                                        <i className="bi bi-3-circle-fill text-primary fs-4 me-3"></i>

                                        <div>

                                            <strong>Set your career goal</strong>

                                            <p className="text-muted small mb-0">

                                                Tell us what you want to
                                                achieve.

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div>

                                    <div className="d-flex">

                                        <i className="bi bi-4-circle-fill text-primary fs-4 me-3"></i>

                                        <div>

                                            <strong>Get recommendations</strong>

                                            <p className="text-muted small mb-0">

                                                Receive career paths that
                                                match your profile.

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    RESULTS
                ========================================== */}

                {recommendations.length > 0 && (

                    <div className="card border-0 shadow-sm mt-4">

                        <div className="card-body p-4">

                            <div className="mb-4 d-flex justify-content-between align-items-start">

                                <div>

                                    <h5 className="fw-bold mb-1">

                                        <i className="bi bi-graph-up-arrow text-success me-2"></i>

                                        Recommended Career Paths

                                    </h5>

                                    <p className="text-muted mb-0">

                                        Based on the information you provided.

                                    </p>

                                </div>

                                {isTrueAI && (

                                    <span className="badge bg-primary d-flex align-items-center gap-1 px-3 py-2">

                                        <i className="bi bi-stars"></i>

                                        Gemini AI

                                    </span>

                                )}

                                {!isTrueAI && recommendations.length > 0 && (

                                    <span className="badge bg-secondary px-3 py-2">
                                        Fallback Mode
                                    </span>

                                )}

                            </div>


                            <div className="row g-3">

                                {(details.length > 0 ? details : recommendations.map((r) => ({ title: r }))).map(
                                    (item, index) => {

                                        const career = item.title || item;
                                        const detail = details[index];

                                        return (

                                        <div
                                            className="col-md-6 col-xl-4"
                                            key={index}
                                        >

                                            <div className="border rounded-3 p-4 h-100 position-relative">

                                                <div
                                                    className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mb-3"
                                                    style={{
                                                        width: "48px",
                                                        height: "48px"
                                                    }}
                                                >

                                                    <i className="bi bi-briefcase fs-5"></i>

                                                </div>


                                                <h6 className="fw-bold">

                                                    {career}

                                                </h6>

                                                {detail?.reason ? (

                                                    <p className="text-muted small mb-2">
                                                        {detail.reason}
                                                    </p>

                                                ) : (

                                                    <p className="text-muted small mb-2">

                                                        This career path matches
                                                        your current skills and
                                                        interests.

                                                    </p>

                                                )}

                                                {detail?.salaryRangeINR && (

                                                    <div className="mb-2">

                                                        <span className="badge bg-light text-dark border">

                                                            <i className="bi bi-currency-rupee me-1"></i>

                                                            {detail.salaryRangeINR}

                                                        </span>

                                                    </div>

                                                )}

                                                {detail?.skillsToLearn && detail.skillsToLearn.length > 0 && (

                                                    <div className="mb-2">

                                                        <small className="fw-semibold">Skills to learn:</small>

                                                        <div className="d-flex flex-wrap gap-1 mt-1">

                                                            {detail.skillsToLearn.map((s, si) => (

                                                                <span key={si} className="badge bg-primary bg-opacity-10 text-primary border">

                                                                    {s}

                                                                </span>

                                                            ))}

                                                        </div>

                                                    </div>

                                                )}

                                                {detail?.roadmap && detail.roadmap.length > 0 && (

                                                    <div className="mt-2">

                                                        <small className="fw-semibold">Roadmap:</small>

                                                        <ol className="small text-muted mb-0 ps-3">

                                                            {detail.roadmap.map((step, si) => (

                                                                <li key={si}>{step}</li>

                                                            ))}

                                                        </ol>

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

export default CareerRecommendation;