import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function ResumePreview() {

    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getResume();
    }, []);

    const getResume = async () => {

        try {

            const response = await API.get(
                "/resumes/my-resume"
            );

            console.log(
                "FULL RESUME DATA:",
                response.data.resume
            );

            setResume(response.data.resume);

        } catch (error) {

            console.log(
                "Resume Preview Error:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div className="container py-5 text-center">

                <h4>
                    Loading Resume...
                </h4>

            </div>
        );

    }


    if (!resume) {

        return (
            <div className="container py-5">

                <div className="alert alert-warning text-center">

                    <h4>
                        No Resume Found
                    </h4>

                    <p>
                        Please create your resume first.
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/student/resume-builder")
                        }
                    >
                        Create Resume
                    </button>

                </div>

            </div>
        );

    }


    const {
        personalInfo,
        careerObjective,
        education,
        skills,
        projects,
        experience,
        certifications,
        softSkills
    } = resume;


    return (

        <div className="bg-light min-vh-100 py-4">


            {/* ================================
                ACTION BUTTONS
            ================================= */}

            <div className="container mb-4">

                <div className="d-flex justify-content-between">

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate(
                                "/student/resume-builder"
                            )
                        }
                    >
                        <i className="bi bi-arrow-left me-2"></i> Edit Resume
                    </button>


                    <button
                        className="btn btn-primary"
                        onClick={() => window.print()}
                    >
                        🖨 Print / Save PDF
                    </button>

                </div>

            </div>


            {/* ================================
                RESUME
            ================================= */}

            <div
                className="container"
                id="resume-preview"
            >

                <div className="bg-white shadow p-5">


                    {/* ================================
                        HEADER
                    ================================= */}

                    <div className="text-center border-bottom pb-3 mb-4">

                        <h1 className="fw-bold mb-2">

                            {personalInfo?.fullName}

                        </h1>


                        <div className="text-muted small">

                            {personalInfo?.email}

                            {personalInfo?.phone && (
                                <>
                                    {" | "}
                                    {personalInfo.phone}
                                </>
                            )}

                            {personalInfo?.address && (
                                <>
                                    {" | "}
                                    {personalInfo.address}
                                </>
                            )}

                        </div>


                        <div className="text-muted small mt-1">

                            {personalInfo?.linkedin}

                            {personalInfo?.github && (
                                <>
                                    {" | "}
                                    {personalInfo.github}
                                </>
                            )}

                        </div>

                    </div>


                    {/* ================================
                        CAREER OBJECTIVE
                    ================================= */}

                    {careerObjective && (

                        <div className="mb-4">

                            <h5 className="fw-bold border-bottom pb-2">
                                CAREER OBJECTIVE
                            </h5>

                            <p className="mb-0">
                                {careerObjective}
                            </p>

                        </div>

                    )}


                    {/* ================================
                        EDUCATION
                    ================================= */}

                    {education?.length > 0 && (

                        <div className="mb-4">

                            <h5 className="fw-bold border-bottom pb-2">
                                EDUCATION
                            </h5>


                            {education.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="mb-3"
                                    >

                                        <div className="d-flex justify-content-between">

                                            <strong>
                                                {item.degree}
                                            </strong>

                                            <span className="text-muted">
                                                {item.year}
                                            </span>

                                        </div>

                                        <div className="fst-italic">
                                            {item.institute}
                                        </div>

                                        {item.percentage && (

                                            <small className="text-muted">
                                                {item.percentage}
                                            </small>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* ================================
                        TECHNICAL SKILLS
                    ================================= */}

                    {skills?.length > 0 && (

                        <div className="mb-4">

                            <h5 className="fw-bold border-bottom pb-2">
                                TECHNICAL SKILLS
                            </h5>

                            <div className="d-flex flex-wrap gap-2">

                                {skills.map(
                                    (skill, index) => (

                                        <span
                                            key={index}
                                            className="badge text-bg-light border"
                                        >
                                            {typeof skill === "string"
                                                ? skill
                                                : skill.name}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* ================================
                        PROJECTS
                    ================================= */}

                    {projects?.length > 0 && (

                        <div className="mb-4">

                            <h5 className="fw-bold border-bottom pb-2">
                                PROJECTS
                            </h5>


                            {projects.map(
                                (project, index) => (

                                    <div
                                        key={index}
                                        className="mb-3"
                                    >

                                        <strong>
                                            {project.title}
                                        </strong>


                                        {project.technologies && (

                                            <div className="small text-muted">

                                                <strong>
                                                    Technologies:
                                                </strong>{" "}

                                                {project.technologies}

                                            </div>

                                        )}


                                        {project.description && (

                                            <p className="mb-0 mt-1">

                                                {project.description}

                                            </p>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* ================================
                        EXPERIENCE
                    ================================= */}

                    {experience?.length > 0 && (

                        <div className="mb-4">

                            <h5 className="fw-bold border-bottom pb-2">
                                EXPERIENCE
                            </h5>


                            {experience.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="mb-3"
                                    >

                                        <div className="d-flex justify-content-between">

                                            <strong>
                                                {item.role}
                                            </strong>

                                            <span className="text-muted">
                                                {item.duration}
                                            </span>

                                        </div>


                                        <div className="fst-italic">
                                            {item.company}
                                        </div>


                                        {item.description && (

                                            <p className="mb-0 mt-1">
                                                {item.description}
                                            </p>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* ================================
                        CERTIFICATIONS
                    ================================= */}

                    {certifications?.length > 0 && (

                        <div className="mb-4">

                            <h5 className="fw-bold border-bottom pb-2">
                                CERTIFICATIONS
                            </h5>


                            {certifications.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="mb-2"
                                    >

                                        <strong>
                                            {item.name}
                                        </strong>

                                        {item.organization && (
                                            <>
                                                {" — "}
                                                {item.organization}
                                            </>
                                        )}

                                        {item.year && (
                                            <>
                                                {" | "}
                                                {item.year}
                                            </>
                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* ================================
                        SOFT SKILLS
                    ================================= */}

                    {softSkills?.length > 0 && (

                        <div className="mb-2">

                            <h5 className="fw-bold border-bottom pb-2">
                                SOFT SKILLS
                            </h5>


                            <div className="d-flex flex-wrap gap-2">

                                {softSkills.map(
                                    (skill, index) => (

                                        <span
                                            key={index}
                                            className="badge text-bg-light border"
                                        >

                                            {typeof skill === "string"
                                                ? skill
                                                : skill.name}

                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default ResumePreview;