
import { useState } from "react";
import API from "../../api/axiosInstance";

function CreateCourse() {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        instructor: "SkillBridgeAI",
        duration: "",
        level: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post(
                "/courses",
                formData
            );

            alert(response.data.message);

            setFormData({
                title: "",
                description: "",
                category: "",
                instructor: "SkillBridgeAI",
                duration: "",
                level: ""
            });

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to create course"
            );

        }

    };

    return (

        <div className="container py-4 py-md-5">

            <div className="card shadow">

                <div className="card-body p-3 p-md-4 p-lg-5">

                    <h2 className="mb-4">
                        Create New Course
                    </h2>

                    <form onSubmit={handleSubmit}>

                        {/* Title */}

                        <div className="mb-3">

                            <label className="form-label">
                                Course Title
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter course title"
                                required
                            />

                        </div>


                        {/* Description */}

                        <div className="mb-3">

                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter course description"
                                rows="4"
                                required
                            />

                        </div>


                        {/* Category */}

                        <div className="mb-3">

                            <label className="form-label">
                                Category
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Example: Web Development"
                                required
                            />

                        </div>


                        {/* Instructor */}

                        <div className="mb-3">

                            <label className="form-label">
                                Instructor
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="instructor"
                                value={formData.instructor}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="row g-3">

                            {/* Duration */}

                            <div className="col-md-6">

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
                                        placeholder="Example: 8 Weeks"
                                        required
                                    />

                                </div>

                            </div>


                            {/* Level */}

                            <div className="col-md-6">

                                <div className="mb-3">

                                    <label className="form-label">
                                        Level
                                    </label>

                                    <select
                                        className="form-select"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select Level
                                        </option>

                                        <option value="Beginner">
                                            Beginner
                                        </option>

                                        <option value="Intermediate">
                                            Intermediate
                                        </option>

                                        <option value="Advanced">
                                            Advanced
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Create Course
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default CreateCourse;

