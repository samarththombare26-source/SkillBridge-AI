import { useState } from "react";
import API from "../../api/axiosInstance";

function CreateCareerRoadmap() {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        skills: "",
        level: "Beginner"
    });

    const [steps, setSteps] = useState([
        {
            title: "",
            description: "",
            duration: ""
        }
    ]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    const handleStepChange = (index, field, value) => {

        const updatedSteps = [...steps];

        updatedSteps[index][field] = value;

        setSteps(updatedSteps);

    };


    const addStep = () => {

        setSteps([
            ...steps,
            {
                title: "",
                description: "",
                duration: ""
            }
        ]);

    };


    const removeStep = (index) => {

        const updatedSteps =
            steps.filter((_, i) => i !== index);

        setSteps(updatedSteps);

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = {

                title: formData.title,

                description: formData.description,

                category: formData.category,

                skills: formData.skills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean),

                steps: steps,

                resources: [],

                level: formData.level

            };


            console.log(
                "ROADMAP DATA:",
                data
            );


            const response =
                await API.post(
                    "/career-roadmaps",
                    data
                );


            alert(
                response.data.message
            );


            setFormData({
                title: "",
                description: "",
                category: "",
                skills: "",
                level: "Beginner"
            });


            setSteps([
                {
                    title: "",
                    description: "",
                    duration: ""
                }
            ]);


        } catch (error) {

            console.log(
                "Create Roadmap Error:",
                error.response?.data ||
                error.message
            );


            alert(
                error.response?.data?.message ||
                "Failed to create roadmap"
            );

        }

    };


    return (

        <div className="container py-4 py-md-5">

            <div className="card shadow">

                <div className="card-body p-3 p-md-4 p-lg-5">

                    <h2 className="mb-4">
                        Create Career Roadmap
                    </h2>


                    <form onSubmit={handleSubmit}>

                        {/* TITLE */}

                        <div className="mb-3">

                            <label className="form-label">
                                Roadmap Title
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Frontend Developer"
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
                                placeholder="Complete roadmap to become a frontend developer"
                                rows="3"
                                required
                            />

                        </div>


                        {/* CATEGORY */}

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
                                placeholder="Web Development"
                                required
                            />

                        </div>


                        {/* SKILLS */}

                        <div className="mb-3">

                            <label className="form-label">
                                Skills
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="HTML, CSS, JavaScript, React"
                                required
                            />

                            <small className="text-muted">
                                Separate skills using commas.
                            </small>

                        </div>


                        {/* LEVEL */}

                        <div className="mb-4">

                            <label className="form-label">
                                Level
                            </label>

                            <select
                                className="form-select"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                            >

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


                        {/* STEPS */}

                        <h4 className="mb-3">
                            Roadmap Steps
                        </h4>


                        {steps.map((step, index) => (

                            <div
                                className="card mb-3"
                                key={index}
                            >

                                <div className="card-body">

                                    <h5>
                                        Step {index + 1}
                                    </h5>


                                    <div className="mb-3">

                                        <label className="form-label">
                                            Step Title
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={step.title}
                                            onChange={(e) =>
                                                handleStepChange(
                                                    index,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Learn HTML"
                                            required
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label className="form-label">
                                            Description
                                        </label>

                                        <textarea
                                            className="form-control"
                                            value={step.description}
                                            onChange={(e) =>
                                                handleStepChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Learn HTML tags, forms and semantic elements"
                                            rows="2"
                                            required
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label className="form-label">
                                            Duration
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={step.duration}
                                            onChange={(e) =>
                                                handleStepChange(
                                                    index,
                                                    "duration",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="2 Weeks"
                                            required
                                        />

                                    </div>


                                    {steps.length > 1 && (

                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() =>
                                                removeStep(index)
                                            }
                                        >
                                            Remove Step
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}


                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={addStep}
                        >
                            + Add Step
                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Create Roadmap
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default CreateCareerRoadmap;