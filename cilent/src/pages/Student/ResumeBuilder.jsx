import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function ResumeBuilder() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({

        personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            linkedin: "",
            github: ""
        },

        careerObjective: "",

        education: [
            {
                degree: "",
                institute: "",
                year: "",
                percentage: ""
            }
        ],

        skills: [],

        projects: [
            {
                title: "",
                description: "",
                technologies: ""
            }
        ],

        experience: [
            {
                company: "",
                role: "",
                duration: "",
                description: ""
            }
        ],

        certifications: [
            {
                name: "",
                organization: "",
                year: ""
            }
        ]

    });


    // ======================================
    // GET EXISTING RESUME
    // ======================================

    useEffect(() => {

        getResume();

    }, []);


    const getResume = async () => {

        try {

            const response = await API.get(
                "/resumes/my-resume"
            );

            if (response.data.resume) {

                setFormData(response.data.resume);

            }

        } catch (error) {

            if (error.response?.status !== 404) {

                console.log(
                    "Resume Error:",
                    error.response?.data ||
                    error.message
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // PERSONAL INFO CHANGE
    // ======================================

    const handlePersonalChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData({

            ...formData,

            personalInfo: {

                ...formData.personalInfo,

                [name]: value

            }

        });

    };


    // ======================================
    // NORMAL FIELD CHANGE
    // ======================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData({

            ...formData,

            [name]: value

        });

    };


    // ======================================
    // EDUCATION CHANGE
    // ======================================

    const handleEducationChange = (
        index,
        field,
        value
    ) => {

        const updatedEducation = [
            ...formData.education
        ];


        updatedEducation[index] = {

            ...updatedEducation[index],

            [field]: value

        };


        setFormData({

            ...formData,

            education: updatedEducation

        });

    };


    // ======================================
    // ADD EDUCATION
    // ======================================

    const addEducation = () => {

        setFormData({

            ...formData,

            education: [

                ...formData.education,

                {
                    degree: "",
                    institute: "",
                    year: "",
                    percentage: ""
                }

            ]

        });

    };


    // ======================================
    // REMOVE EDUCATION
    // ======================================

    const removeEducation = (index) => {

        const updatedEducation =
            formData.education.filter(
                (_, i) => i !== index
            );


        setFormData({

            ...formData,

            education: updatedEducation

        });

    };


    // ======================================
    // SKILLS CHANGE
    // ======================================

    const handleSkillsChange = (e) => {

        const skills = e.target.value
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill !== "");


        setFormData({

            ...formData,

            skills: skills

        });

    };


    // ======================================
    // PROJECT CHANGE
    // ======================================

    const handleProjectChange = (
        index,
        field,
        value
    ) => {

        const updatedProjects = [
            ...formData.projects
        ];


        updatedProjects[index] = {

            ...updatedProjects[index],

            [field]: value

        };


        setFormData({

            ...formData,

            projects: updatedProjects

        });

    };


    // ======================================
    // ADD PROJECT
    // ======================================

    const addProject = () => {

        setFormData({

            ...formData,

            projects: [

                ...formData.projects,

                {
                    title: "",
                    description: "",
                    technologies: ""
                }

            ]

        });

    };


    // ======================================
    // REMOVE PROJECT
    // ======================================

    const removeProject = (index) => {

        const updatedProjects =
            formData.projects.filter(
                (_, i) => i !== index
            );


        setFormData({

            ...formData,

            projects: updatedProjects

        });

    };


    // ======================================
    // EXPERIENCE CHANGE
    // ======================================

    const handleExperienceChange = (
        index,
        field,
        value
    ) => {

        const updatedExperience = [
            ...formData.experience
        ];


        updatedExperience[index] = {

            ...updatedExperience[index],

            [field]: value

        };


        setFormData({

            ...formData,

            experience: updatedExperience

        });

    };


    // ======================================
    // ADD EXPERIENCE
    // ======================================

    const addExperience = () => {

        setFormData({

            ...formData,

            experience: [

                ...formData.experience,

                {
                    company: "",
                    role: "",
                    duration: "",
                    description: ""
                }

            ]

        });

    };


    // ======================================
    // REMOVE EXPERIENCE
    // ======================================

    const removeExperience = (index) => {

        const updatedExperience =
            formData.experience.filter(
                (_, i) => i !== index
            );


        setFormData({

            ...formData,

            experience: updatedExperience

        });

    };


    // ======================================
    // CERTIFICATION CHANGE
    // ======================================

    const handleCertificationChange = (
        index,
        field,
        value
    ) => {

        const updatedCertifications = [
            ...formData.certifications
        ];


        updatedCertifications[index] = {

            ...updatedCertifications[index],

            [field]: value

        };


        setFormData({

            ...formData,

            certifications:
                updatedCertifications

        });

    };


    // ======================================
    // ADD CERTIFICATION
    // ======================================

    const addCertification = () => {

        setFormData({

            ...formData,

            certifications: [

                ...formData.certifications,

                {
                    name: "",
                    organization: "",
                    year: ""
                }

            ]

        });

    };


    // ======================================
    // REMOVE CERTIFICATION
    // ======================================

    const removeCertification = (index) => {

        const updatedCertifications =
            formData.certifications.filter(
                (_, i) => i !== index
            );


        setFormData({

            ...formData,

            certifications:
                updatedCertifications

        });

    };


    // ======================================
    // SAVE RESUME
    // ======================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);


        try {

            const response = await API.post(
                "/resumes",
                formData
            );


            alert(
                response.data.message
            );


        } catch (error) {

            console.log(
                "Save Resume Error:",
                error.response?.data ||
                error.message
            );


            alert(
                error.response?.data?.message ||
                "Failed to save resume"
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (

            <div className="container mt-5">

                <h4>
                    Loading Resume Builder...
                </h4>

            </div>

        );

    }


    return (

        <div className="container">

            <h1 className="mb-2">
                Resume Builder
            </h1>

            <p className="text-muted mb-4">
                Create a professional resume for
                internships and job opportunities.
            </p>


            <form onSubmit={handleSubmit}>


                {/* ======================================
                    PERSONAL INFORMATION
                ====================================== */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h3 className="mb-4">
                            Personal Information
                        </h3>


                        <div className="row">


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="fullName"
                                    value={
                                        formData.personalInfo.fullName
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                    required
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={
                                        formData.personalInfo.email
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                    required
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={
                                        formData.personalInfo.phone
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    value={
                                        formData.personalInfo.address
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    LinkedIn
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="linkedin"
                                    value={
                                        formData.personalInfo.linkedin
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                    placeholder="LinkedIn profile URL"
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    GitHub
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="github"
                                    value={
                                        formData.personalInfo.github
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                    placeholder="GitHub profile URL"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    CAREER OBJECTIVE
                ====================================== */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h3 className="mb-4">
                            Career Objective
                        </h3>

                        <textarea
                            className="form-control"
                            rows="4"
                            name="careerObjective"
                            value={
                                formData.careerObjective
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Write your career objective..."
                        />

                    </div>

                </div>


                {/* ======================================
                    EDUCATION
                ====================================== */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h3 className="mb-0">
                                Education
                            </h3>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={addEducation}
                            >
                                + Add Education
                            </button>

                        </div>


                        {formData.education.map(
                            (education, index) => (

                                <div
                                    className="border rounded p-3 mb-3"
                                    key={index}
                                >

                                    <div className="row">


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Degree / Course
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    education.degree
                                                }
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "degree",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Institute
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    education.institute
                                                }
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "institute",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Year
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    education.year
                                                }
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "year",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Percentage / CGPA
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    education.percentage
                                                }
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "percentage",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>


                                    {formData.education.length > 1 && (

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                removeEducation(index)
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ======================================
                    SKILLS
                ====================================== */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h3 className="mb-4">
                            Skills
                        </h3>

                        <input
                            type="text"
                            className="form-control"
                            value={
                                formData.skills.join(", ")
                            }
                            onChange={
                                handleSkillsChange
                            }
                            placeholder="Example: HTML, CSS, JavaScript, React, Node.js"
                        />

                        <small className="text-muted">
                            Separate skills using commas.
                        </small>

                    </div>

                </div>


                {/* ======================================
                    PROJECTS
                ====================================== */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h3 className="mb-0">
                                Projects
                            </h3>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={addProject}
                            >
                                + Add Project
                            </button>

                        </div>


                        {formData.projects.map(
                            (project, index) => (

                                <div
                                    className="border rounded p-3 mb-3"
                                    key={index}
                                >

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Project Title
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                project.title
                                            }
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    index,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label className="form-label">
                                            Technologies
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                project.technologies
                                            }
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    index,
                                                    "technologies",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="React, Node.js, MongoDB"
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label className="form-label">
                                            Description
                                        </label>

                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={
                                                project.description
                                            }
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    {formData.projects.length > 1 && (

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                removeProject(index)
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ======================================
                    EXPERIENCE
                ====================================== */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h3 className="mb-0">
                                Experience
                            </h3>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={addExperience}
                            >
                                + Add Experience
                            </button>

                        </div>


                        {formData.experience.map(
                            (experience, index) => (

                                <div
                                    className="border rounded p-3 mb-3"
                                    key={index}
                                >

                                    <div className="row">


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Company
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    experience.company
                                                }
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "company",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Role
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    experience.role
                                                }
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "role",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="col-md-12 mb-3">

                                            <label className="form-label">
                                                Duration
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    experience.duration
                                                }
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "duration",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Example: 3 Months"
                                            />

                                        </div>


                                        <div className="col-md-12 mb-3">

                                            <label className="form-label">
                                                Description
                                            </label>

                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={
                                                    experience.description
                                                }
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>


                                    {formData.experience.length > 1 && (

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                removeExperience(index)
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ======================================
                    CERTIFICATIONS
                ====================================== */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h3 className="mb-0">
                                Certifications
                            </h3>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={addCertification}
                            >
                                + Add Certification
                            </button>

                        </div>


                        {formData.certifications.map(
                            (certification, index) => (

                                <div
                                    className="border rounded p-3 mb-3"
                                    key={index}
                                >

                                    <div className="row">


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Certification Name
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    certification.name
                                                }
                                                onChange={(e) =>
                                                    handleCertificationChange(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Organization
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    certification.organization
                                                }
                                                onChange={(e) =>
                                                    handleCertificationChange(
                                                        index,
                                                        "organization",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Year
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    certification.year
                                                }
                                                onChange={(e) =>
                                                    handleCertificationChange(
                                                        index,
                                                        "year",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>


                                    {formData.certifications.length > 1 && (

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                removeCertification(index)
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ======================================
                    SAVE BUTTON
                ====================================== */}

                <div className="text-center mb-5">

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg px-5"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : " Save Resume"
                        }

                    </button>

                    <button
                        type="button"
                        className="btn btn-success btn-lg px-5 ms-2"
                        onClick={() =>
                            navigate("/student/resume-preview")
                        }
                    >
                         Preview Resume
                    </button>

                </div>


            </form>

        </div>

    );

}

export default ResumeBuilder;