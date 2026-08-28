import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function MyStudents() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [connectingId, setConnectingId] = useState(null);


    useEffect(() => {

        fetchMyStudents();

    }, []);


    const fetchMyStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                "/mentor/my-students"
            );

            setStudents(
                response.data.students || []
            );

        } catch (err) {

            console.error(
                "My Students Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load your students"
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================
    // OPEN CHAT WITH STUDENT
    // ======================================

    const handleContact = async (student) => {

        try {

            setConnectingId(student._id);

            const response = await API.post(
                "/conversations",
                {
                    studentId: student._id
                }
            );

            navigate(
                `/mentor/conversation/${response.data.conversation._id}`
            );

        } catch (err) {

            console.error(
                "Create Conversation Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to contact student"
            );

        } finally {

            setConnectingId(null);

        }

    };


    // ======================================
    // SEARCH FILTER
    // ======================================

    const filteredStudents = students.filter(
        (student) => {

            const q = search.trim().toLowerCase();

            if (!q) return true;

            return (
                student.name?.toLowerCase().includes(q) ||
                student.email?.toLowerCase().includes(q)
            );

        }
    );


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
                    Loading your students...
                </p>

            </div>

        );

    }


    return (

        <div>


            {/* HEADER */}

            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">

                <div>

                    <h4 className="fw-bold mb-1">
                        My Students
                    </h4>

                    <p className="text-muted mb-0">

                        Students whose mentorship requests you have accepted.

                    </p>

                </div>


                <span className="badge text-bg-primary px-3 py-2">

                    {students.length} Connected

                </span>

            </div>


            {/* SEARCH */}

            {students.length > 0 && (

                <div className="mb-4" style={{ maxWidth: "420px" }}>

                    <div className="input-group">

                        <span className="input-group-text bg-white">

                            <i className="bi bi-search text-muted"></i>

                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search students by name or email..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>

            )}


            {/* ERROR */}

            {error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* EMPTY - NO STUDENTS AT ALL */}

            {!error &&
                students.length === 0 && (

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center py-5">

                            <div className="fs-1 mb-3">
                                <i className="bi bi-mortarboard"></i>
                            </div>

                            <h4 className="fw-bold">
                                No Connected Students
                            </h4>

                            <p className="text-muted mb-0">

                                When you accept mentorship requests,
                                students will appear here.

                            </p>

                        </div>

                    </div>

                )}


            {/* EMPTY - NO SEARCH RESULTS */}

            {!error &&
                students.length > 0 &&
                filteredStudents.length === 0 && (

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center py-5">

                            <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>

                            <h5 className="fw-bold">

                                No results for "{search}"

                            </h5>

                            <p className="text-muted mb-0">

                                Try a different name or email.

                            </p>

                        </div>

                    </div>

                )}


            {/* STUDENT CARDS */}

            {!error &&
                filteredStudents.length > 0 && (

                    <div className="row g-4">

                        {filteredStudents.map((student) => (

                            <div
                                className="col-md-6 col-lg-4"
                                key={student._id}
                            >

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4 text-center">


                                        {/* AVATAR */}

                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3 text-white"
                                            style={{
                                                width: "75px",
                                                height: "75px",
                                                fontSize: "30px",
                                                background:
                                                    "linear-gradient(135deg, #2563eb, #22d3ee)"
                                            }}
                                        >

                                            {student.name
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>


                                        {/* NAME */}

                                        <h5 className="fw-bold mb-1">

                                            {student.name}

                                        </h5>


                                        {/* EMAIL */}

                                        <p className="text-muted small mb-3">

                                            <i className="bi bi-envelope me-1"></i>

                                            {student.email}

                                        </p>


                                        {/* BADGE */}

                                        <span className="badge text-bg-success mb-3">

                                            <i className="bi bi-check-circle me-1"></i>

                                            Connected

                                        </span>


                                        {/* CONTACT */}

                                        <button
                                            className="btn btn-primary w-100"
                                            disabled={
                                                connectingId === student._id
                                            }
                                            onClick={() =>
                                                handleContact(student)
                                            }
                                        >

                                            {connectingId === student._id ? (

                                                <>

                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                    ></span>

                                                    Opening Chat...

                                                </>

                                            ) : (

                                                <>

                                                    <i className="bi bi-chat-dots me-2"></i>

                                                    Message

                                                </>

                                            )}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>

    );

}

export default MyStudents;
