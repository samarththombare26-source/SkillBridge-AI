import { useState } from "react";
import API from "../../api/axiosInstance";

function CreateInternship() {

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: "",
        skills: "",
        location: "",
        duration: "",
        stipend: "",
        type: "Internship",
        deadline: ""
    });


    // ======================================
    // HANDLE CHANGE
    // ======================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ======================================
    // CREATE INTERNSHIP
    // ======================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = {

                title: formData.title,

                company: formData.company,

                description: formData.description,

                skills: formData.skills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean),

                location: formData.location,

                duration: formData.duration,

                stipend: formData.stipend,

                type: formData.type,

                deadline: formData.deadline

            };


            console.log(
                "INTERNSHIP DATA:",
                data
            );


            const response = await API.post(
                "/internships",
                data
            );


            alert(
                response.data.message
            );


            // Reset form

            setFormData({
                title: "",
                company: "",
                description: "",
                skills: "",
                location: "",
                duration: "",
                stipend: "",
                type: "Internship",
                deadline: ""
            });


        } catch (error) {

            console.log(
                "Create Internship Error:",
                error.response?.data ||
                error.message
            );


            alert(
                error.response?.data?.message ||
                "Failed to create internship"
            );

        }

    };


    return (

        <div className="container py-4 py-md-5">

            <div className="card shadow">

                <div className="card-body p-3 p-md-4 p-lg-5">

                    <h2 className="mb-4">
                        Create Internship
                    </h2>


                    <form onSubmit={handleSubmit}>


                        {/* TITLE */}

                        <div className="mb-3">

                            <label className="form-label">
                                Internship Title
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Frontend Developer Intern"
                                required
                            />

                        </div>


                        {/* COMPANY */}

                        <div className="mb-3">

                            <label className="form-label">
                                Company
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Dezycode"
                                required
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="mb-3">

                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the internship..."
                                rows="4"
                                required
                            />

                        </div>


                        {/* SKILLS */}

                        <div className="mb-3">

                            <label className="form-label">
                                Required Skills
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, JavaScript, HTML, CSS"
                                required
                            />

                            <small className="text-muted">
                                Separate skills using commas.
                            </small>

                        </div>


                        {/* LOCATION */}

                        <div className="mb-3">

                            <label className="form-label">
                                Location
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Pune / Remote"
                                required
                            />

                        </div>


                        {/* DURATION */}

                        <div className="mb-3">

                            <label className="form-label">
                                Duration
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="3 Months"
                                required
                            />

                        </div>


                        {/* STIPEND */}

                        <div className="mb-3">

                            <label className="form-label">
                                Stipend
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="stipend"
                                value={formData.stipend}
                                onChange={handleChange}
                                placeholder="₹10,000 / month"
                            />

                        </div>


                        {/* TYPE */}

                        <div className="mb-3">

                            <label className="form-label">
                                Internship Type
                            </label>

                            <select
                                className="form-select"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >

                                <option value="Internship">
                                    Internship
                                </option>

                                <option value="Part Time">
                                    Part Time
                                </option>

                                <option value="Full Time">
                                    Full Time
                                </option>

                            </select>

                        </div>


                        {/* DEADLINE */}

                        <div className="mb-4">

                            <label className="form-label">
                                Application Deadline
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Create Internship
                        </button>


                    </form>

                </div>

            </div>

        </div>

    );

}

export default CreateInternship;