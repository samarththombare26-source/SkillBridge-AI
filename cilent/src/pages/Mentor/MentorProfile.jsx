import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function MentorProfile() {

    const navigate = useNavigate();

    // ======================================
    // STATE
    // ======================================

    const [mentor, setMentor] = useState(null);

    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState("view");

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [validationError, setValidationError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        expertise: "",
        experience: "",
        bio: "",
        linkedin: "",
        availability: "Available"
    });


    // ======================================
    // FETCH MENTOR PROFILE
    // ======================================

    useEffect(() => {

        fetchMentorProfile();

    }, []);


    const fillFromMentor = (mentorData) => {

        setFormData({
            name: mentorData.name || "",
            email: mentorData.email || "",
            expertise: mentorData.expertise || "",
            experience: mentorData.experience || "",
            bio: mentorData.bio || "",
            linkedin: mentorData.linkedin || "",
            availability:
                mentorData.availability || "Available"
        });

    };


    const fetchMentorProfile = async () => {

        try {

            setLoading(true);
            setError("");
            setMessage("");

            const response = await API.get(
                "/mentor/profile"
            );

            const mentorData = response.data.mentor;

            setMentor(mentorData);

            fillFromMentor(mentorData);

            setMode("view");

        } catch {

            // No profile yet -> CREATE MODE

            setMentor(null);

            const storedUser = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            setFormData((prev) => ({
                ...prev,
                name: storedUser?.name || "",
                email: storedUser?.email || ""
            }));

            setMode("create");

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // HANDLE INPUT CHANGE
    // ======================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    // ======================================
    // VALIDATION
    // ======================================

    const validateForm = () => {

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.expertise.trim() ||
            !formData.experience.trim() ||
            !formData.bio.trim()
        ) {

            return "Name, Email, Expertise, Experience and Bio are required.";

        }

        if (
            formData.linkedin &&
            !/^https?:\/\//i.test(formData.linkedin)
        ) {

            return "LinkedIn must be a valid URL starting with https://";

        }

        return "";

    };


    // ======================================
    // CREATE MENTOR PROFILE
    // ======================================

    const handleCreate = async (e) => {

        e.preventDefault();

        const validationMsg = validateForm();

        if (validationMsg) {

            setValidationError(validationMsg);

            return;

        }

        setValidationError("");

        try {

            setSaving(true);
            setError("");
            setMessage("");

            const response = await API.post(
                "/mentor",
                {
                    name: formData.name,
                    email: formData.email,
                    expertise: formData.expertise,
                    experience: formData.experience,
                    bio: formData.bio,
                    linkedin: formData.linkedin,
                    availability: formData.availability
                }
            );

            const createdMentor =
                response.data.mentor;

            setMentor(createdMentor);

            fillFromMentor(createdMentor);

            setMode("view");

            setMessage(
                response.data.message ||
                "Mentor profile created successfully!"
            );

        } catch (err) {

            console.error(
                "Create Mentor Profile Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create mentor profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // ======================================
    // START EDIT
    // ======================================

    const handleEdit = () => {

        setMode("edit");

        setMessage("");

        setError("");

    };


    // ======================================
    // CANCEL EDIT
    // ======================================

    const handleCancelEdit = () => {

        setMode("view");

        setMessage("");

        setError("");

        if (mentor) {

            fillFromMentor(mentor);

        }

    };


    // ======================================
    // UPDATE MENTOR PROFILE
    // ======================================

    const handleUpdate = async (e) => {

        e.preventDefault();

        if (
            !formData.expertise.trim() ||
            !formData.experience.trim() ||
            !formData.bio.trim()
        ) {

            setValidationError(
                "Expertise, Experience and Bio are required."
            );

            return;

        }

        setValidationError("");

        try {

            setSaving(true);

            setMessage("");

            setError("");

            const response = await API.put(
                "/mentor/profile",
                {
                    expertise: formData.expertise,
                    experience: formData.experience,
                    bio: formData.bio,
                    linkedin: formData.linkedin,
                    availability:
                        formData.availability
                }
            );

            const updatedMentor =
                response.data.mentor;

            setMentor(updatedMentor);

            fillFromMentor(updatedMentor);

            setMode("view");

            setMessage(
                response.data.message ||
                "Mentor profile updated successfully"
            );

        } catch (err) {

            console.error(
                "Update Mentor Profile Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update mentor profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // ======================================
    // DELETE MENTOR PROFILE
    // ======================================

    const handleDelete = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete your mentor profile?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeleting(true);

            setMessage("");

            setError("");

            const response = await API.delete(
                "/mentor/profile"
            );

            setMentor(null);

            const storedUser = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            setFormData((prev) => ({
                ...prev,
                name: storedUser?.name || "",
                email: storedUser?.email || "",
                expertise: "",
                experience: "",
                bio: "",
                linkedin: "",
                availability: "Available"
            }));

            setMode("create");

            setMessage(
                response.data.message ||
                "Profile deleted. You can create a new one."
            );

        } catch (err) {

            console.error(
                "Delete Mentor Profile Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete mentor profile"
            );

        } finally {

            setDeleting(false);

        }

    };


    // ======================================
    // AVAILABILITY BADGE
    // ======================================

    const availabilityBadge = (value) => {

        if (value === "Available") {

            return (
                <span className="badge text-bg-success px-3 py-2">

                    <i className="bi bi-check-circle me-1"></i>

                    Available

                </span>
            );

        }

        if (value === "Busy") {

            return (
                <span className="badge text-bg-warning px-3 py-2">

                    <i className="bi bi-clock me-1"></i>

                    Busy

                </span>
            );

        }

        return (
            <span className="badge text-bg-secondary px-3 py-2">

                <i className="bi bi-slash-circle me-1"></i>

                {value || "Not Set"}

            </span>
        );

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-muted mt-3">
                    Loading mentor profile...
                </p>

            </div>

        );

    }


    return (

        <div>

            {/* =====================================
                MESSAGES
            ===================================== */}

            {message && (

                <div
                    className="alert alert-success d-flex align-items-center py-2"
                    role="alert"
                >

                    <i className="bi bi-check-circle-fill me-2"></i>

                    {message}

                </div>

            )}

            {error && (

                <div
                    className="alert alert-danger d-flex align-items-center py-2"
                    role="alert"
                >

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    {error}

                </div>

            )}


            {/* =====================================
                CREATE MODE
            ===================================== */}

            {mode === "create" && !mentor && (

                <div className="row justify-content-center">

                    <div className="col-lg-9 col-xl-8">

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4 p-md-5">


                                {/* HEADER */}

                                <div className="text-center mb-4">

                                    <div className="icon-chip primary mx-auto mb-3" style={{ width: "64px", height: "64px", fontSize: "1.7rem" }}>

                                        <i className="bi bi-person-plus"></i>

                                    </div>

                                    <h3 className="fw-bold mb-1">

                                        Create Mentor Profile

                                    </h3>

                                    <p className="text-muted mb-0">

                                        Students will see this information when
                                        they search for mentors.

                                    </p>

                                </div>


                                {validationError && (

                                    <div
                                        className="alert alert-danger py-2 d-flex align-items-center"
                                        role="alert"
                                    >

                                        <i className="bi bi-exclamation-circle me-2"></i>

                                        {validationError}

                                    </div>

                                )}


                                <form onSubmit={handleCreate} noValidate>


                                    <div className="row">


                                        {/* NAME */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                Full Name{" "}

                                                <span className="text-danger">*</span>

                                            </label>

                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                placeholder="e.g. Rahul Sharma"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* EMAIL */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                Email{" "}

                                                <span className="text-danger">*</span>

                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="e.g. rahul@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* EXPERTISE */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                Area of Expertise{" "}

                                                <span className="text-danger">*</span>

                                            </label>

                                            <input
                                                type="text"
                                                name="expertise"
                                                className="form-control"
                                                placeholder="e.g. Full Stack Development, AI/ML"
                                                value={formData.expertise}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* EXPERIENCE */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                Experience{" "}

                                                <span className="text-danger">*</span>

                                            </label>

                                            <input
                                                type="text"
                                                name="experience"
                                                className="form-control"
                                                placeholder="e.g. 5 Years"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* BIO */}

                                        <div className="col-12 mb-3">

                                            <label className="form-label fw-semibold">

                                                About You{" "}

                                                <span className="text-danger">*</span>

                                            </label>

                                            <textarea
                                                name="bio"
                                                className="form-control"
                                                rows="4"
                                                placeholder="Describe your background, skills and how you can help students..."
                                                value={formData.bio}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* LINKEDIN */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                LinkedIn Profile

                                            </label>

                                            <input
                                                type="url"
                                                name="linkedin"
                                                className="form-control"
                                                placeholder="https://linkedin.com/in/your-profile"
                                                value={formData.linkedin}
                                                onChange={handleChange}
                                            />

                                        </div>


                                        {/* AVAILABILITY */}

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label fw-semibold">

                                                Availability

                                            </label>

                                            <select
                                                name="availability"
                                                className="form-select"
                                                value={formData.availability}
                                                onChange={handleChange}
                                            >

                                                <option value="Available">
                                                    Available
                                                </option>

                                                <option value="Busy">
                                                    Busy
                                                </option>

                                                <option value="Not Available">
                                                    Not Available
                                                </option>

                                            </select>

                                        </div>

                                    </div>


                                    {/* BUTTONS */}

                                    <div className="d-flex gap-2">

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary flex-fill"
                                            onClick={() =>
                                                navigate("/mentor")
                                            }
                                            disabled={saving}
                                        >

                                            <i className="bi bi-arrow-left me-2"></i>

                                            Back to Dashboard

                                        </button>


                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-fill"
                                            disabled={saving}
                                        >

                                            {saving ? (

                                                <>

                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                    ></span>

                                                    Creating...

                                                </>

                                            ) : (

                                                <>

                                                    <i className="bi bi-plus-circle me-2"></i>

                                                    Create Profile

                                                </>

                                            )}

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================
                VIEW MODE
            ===================================== */}

            {mode === "view" && mentor && (

                <div className="row justify-content-center">

                    <div className="col-lg-9 col-xl-8">

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4 p-md-5">


                                {/* PROFILE HERO */}

                                <div className="text-center mb-4">

                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mx-auto mb-3"
                                        style={{
                                            width: "96px",
                                            height: "96px",
                                            fontSize: "38px",
                                            background:
                                                "linear-gradient(135deg, #2563eb, #22d3ee)"
                                        }}
                                    >

                                        {mentor.name
                                            ?.charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    <h3 className="fw-bold mb-1">

                                        {mentor.name}

                                    </h3>


                                    <p className="text-muted mb-2">

                                        <i className="bi bi-envelope me-1"></i>

                                        {mentor.email}

                                    </p>


                                    {availabilityBadge(
                                        mentor.availability
                                    )}

                                </div>


                                <hr />


                                {/* INFO ROWS */}

                                <div className="row g-4 mb-2">

                                    <div className="col-md-6">

                                        <div className="d-flex align-items-start gap-3">

                                            <div className="icon-chip primary" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>

                                                <i className="bi bi-lightning-charge"></i>

                                            </div>

                                            <div>

                                                <small className="text-muted d-block">

                                                    Area of Expertise

                                                </small>

                                                <span className="fw-semibold">

                                                    {mentor.expertise ||
                                                        "Not provided"}

                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-md-6">

                                        <div className="d-flex align-items-start gap-3">

                                            <div className="icon-chip success" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>

                                                <i className="bi bi-briefcase"></i>

                                            </div>

                                            <div>

                                                <small className="text-muted d-block">

                                                    Experience

                                                </small>

                                                <span className="fw-semibold">

                                                    {mentor.experience ||
                                                        "Not provided"}

                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-12">

                                        <div className="d-flex align-items-start gap-3">

                                            <div className="icon-chip info" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>

                                                <i className="bi bi-person-lines-fill"></i>

                                            </div>

                                            <div>

                                                <small className="text-muted d-block">

                                                    About

                                                </small>

                                                <span>

                                                    {mentor.bio ||
                                                        "Not provided"}

                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-md-6">

                                        <div className="d-flex align-items-start gap-3">

                                            <div className="icon-chip danger" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>

                                                <i className="bi bi-linkedin"></i>

                                            </div>

                                            <div>

                                                <small className="text-muted d-block">

                                                    LinkedIn

                                                </small>

                                                {mentor.linkedin ? (

                                                    <a
                                                        href={mentor.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="fw-semibold text-decoration-none"
                                                    >

                                                        View Profile

                                                        <i className="bi bi-box-arrow-up-right ms-1 small"></i>

                                                    </a>

                                                ) : (

                                                    <span className="text-muted">

                                                        Not provided

                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* ACTION BUTTONS */}

                                <hr className="mt-4" />


                                <div className="d-flex gap-2 flex-wrap">

                                    <button
                                        className="btn btn-primary flex-fill"
                                        onClick={handleEdit}
                                    >

                                        <i className="bi bi-pencil me-2"></i>

                                        Edit Profile

                                    </button>


                                    <button
                                        className="btn btn-outline-danger flex-fill"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                    >

                                        <i className="bi bi-trash me-2"></i>

                                        {deleting
                                            ? "Deleting..."
                                            : "Delete Profile"}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================
                EDIT MODE
            ===================================== */}

            {mode === "edit" && mentor && (

                <div className="row justify-content-center">

                    <div className="col-lg-9 col-xl-8">

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4 p-md-5">


                                {/* HEADER */}

                                <div className="mb-4">

                                    <h3 className="fw-bold mb-1">

                                        Edit Mentor Profile

                                    </h3>

                                    <p className="text-muted mb-0">

                                        Update your professional information.

                                    </p>

                                </div>


                                {validationError && (

                                    <div
                                        className="alert alert-danger py-2 d-flex align-items-center"
                                        role="alert"
                                    >

                                        <i className="bi bi-exclamation-circle me-2"></i>

                                        {validationError}

                                    </div>

                                )}


                                <form onSubmit={handleUpdate} noValidate>


                                    <div className="row">


                                        {/* NAME (LOCKED) */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                Full Name

                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                disabled
                                            />

                                        </div>


                                        {/* EMAIL (LOCKED) */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                Email

                                            </label>

                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                disabled
                                            />

                                        </div>


                                        {/* EXPERTISE */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                Area of Expertise{" "}

                                                <span className="text-danger">*</span>

                                            </label>

                                            <input
                                                type="text"
                                                name="expertise"
                                                className="form-control"
                                                value={formData.expertise}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* EXPERIENCE */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                Experience{" "}

                                                <span className="text-danger">*</span>

                                            </label>

                                            <input
                                                type="text"
                                                name="experience"
                                                className="form-control"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* BIO */}

                                        <div className="col-12 mb-3">

                                            <label className="form-label fw-semibold">

                                                About You{" "}

                                                <span className="text-danger">*</span>

                                            </label>

                                            <textarea
                                                name="bio"
                                                className="form-control"
                                                rows="4"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* LINKEDIN */}

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">

                                                LinkedIn Profile

                                            </label>

                                            <input
                                                type="url"
                                                name="linkedin"
                                                className="form-control"
                                                placeholder="https://linkedin.com/in/your-profile"
                                                value={formData.linkedin}
                                                onChange={handleChange}
                                            />

                                        </div>


                                        {/* AVAILABILITY */}

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label fw-semibold">

                                                Availability

                                            </label>

                                            <select
                                                name="availability"
                                                className="form-select"
                                                value={formData.availability}
                                                onChange={handleChange}
                                            >

                                                <option value="Available">
                                                    Available
                                                </option>

                                                <option value="Busy">
                                                    Busy
                                                </option>

                                                <option value="Not Available">
                                                    Not Available
                                                </option>

                                            </select>

                                        </div>

                                    </div>


                                    {/* BUTTONS */}

                                    <div className="d-flex gap-2">

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary flex-fill"
                                            onClick={handleCancelEdit}
                                            disabled={saving}
                                        >

                                            Cancel

                                        </button>


                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-fill"
                                            disabled={saving}
                                        >

                                            {saving ? (

                                                <>

                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                    ></span>

                                                    Saving...

                                                </>

                                            ) : (

                                                <>

                                                    <i className="bi bi-check-lg me-2"></i>

                                                    Save Changes

                                                </>

                                            )}

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default MentorProfile;
