import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function Certificates() {

    const navigate = useNavigate();
    const printRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);
    const [selectedCert, setSelectedCert] = useState(null);


    useEffect(() => {

        fetchCertificates();

    }, []);


    const fetchCertificates = async () => {

        try {

            const response = await API.get(
                "/enrollments/my-enrollments"
            );

            const enrollments =
                response.data.enrollments || [];

            if (enrollments.length === 0) {

                setCertificates([]);
                setLoading(false);
                return;

            }

            const results = await Promise.allSettled(
                enrollments.map((enrollment) =>
                    API.get(
                        `/progress/${enrollment.course?._id}`
                    ).then((res) => ({
                        enrollment,
                        progress: res.data.progress
                    }))
                )
            );

            const completed = results
                .filter(
                    (result) =>
                        result.status === "fulfilled" &&
                        result.value.progress?.completed
                )
                .map((result) => ({
                    course: result.value.enrollment.course,
                    enrollment: result.value.enrollment,
                    progress: result.value.progress,
                    issuedAt:
                        result.value.enrollment.updatedAt ||
                        new Date().toISOString()
                }));

            setCertificates(completed);

        } catch (error) {

            console.log("Certificates Error:", error);

        } finally {

            setLoading(false);

        }

    };


    const handlePrint = () => {

        window.print();

    };


    const handleDownload = (cert) => {

        setSelectedCert(cert);

        setTimeout(() => {

            window.print();

        }, 300);

    };


    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <p className="text-muted mt-3">
                    Loading certificates...
                </p>

            </div>

        );

    }


    return (

        <div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #certificate-print, #certificate-print * { visibility: visible; }
                    #certificate-print {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 40px;
                        background: white;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>

            {/* ==============================
                HEADER
            ============================== */}

            <div className="mb-4 no-print">

                <h4 className="fw-bold mb-1">
                    My Certificates
                </h4>

                <p className="text-muted mb-0">

                    Your achievements for completed courses. Click view to see and print your certificate.

                </p>

            </div>


            {/* ==============================
                EMPTY STATE
            ============================== */}

            {certificates.length === 0 ? (

                <div className="card border-0 shadow-sm rounded-4 no-print">

                    <div className="card-body text-center py-5">

                        <div
                            className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{
                                width: "72px",
                                height: "72px"
                            }}
                        >

                            <i className="bi bi-award fs-2"></i>

                        </div>

                        <h5 className="fw-bold">
                            No certificates yet
                        </h5>

                        <p className="text-muted mb-4">

                            Complete a course with 100% progress to earn your certificate.

                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/student")}
                        >

                            Back to Dashboard

                            <i className="bi bi-arrow-right ms-2"></i>

                        </button>

                    </div>

                </div>

            ) : (

                <>

                    <div className="row g-4 no-print">

                        {certificates.map((cert, index) => (

                                <div
                                className="col-12 col-sm-6 col-xl-4"
                                key={index}
                            >

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4 text-center">

                                        <div
                                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{
                                                width: "64px",
                                                height: "64px"
                                            }}
                                        >

                                            <i className="bi bi-patch-check fs-3"></i>

                                        </div>

                                        <h5 className="fw-bold mb-1">
                                            {cert.course?.title}
                                        </h5>

                                        <p className="text-muted small mb-2">
                                            {cert.course?.category} •{" "}
                                            {cert.course?.level}
                                        </p>

                                        <span className="badge bg-success bg-opacity-10 text-success mb-3">

                                            <i className="bi bi-check-circle me-1"></i>

                                            Completed 100%

                                        </span>

                                        <p className="small text-muted mb-3">

                                            Issued on{" "}

                                            {new Date(
                                                cert.issuedAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}

                                        </p>

                                        <div className="d-flex gap-2 flex-wrap">

                                            <button
                                                className="btn btn-primary flex-fill"
                                                onClick={() =>
                                                    setSelectedCert(cert)
                                                }
                                            >

                                                <i className="bi bi-eye me-2"></i>

                                                View

                                            </button>

                                            <button
                                                className="btn btn-outline-primary flex-fill"
                                                onClick={() =>
                                                    handleDownload(cert)
                                                }
                                            >

                                                <i className="bi bi-download me-2"></i>

                                                Print

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* ==============================
                        CERTIFICATE PREVIEW MODAL
                    ============================== */}

                    {selectedCert && (

                        <div
                            className="modal d-block no-print"
                            style={{
                                backgroundColor:
                                    "rgba(0,0,0,0.6)",
                                backdropFilter: "blur(4px)"
                            }}
                            onClick={() =>
                                setSelectedCert(null)
                            }
                        >

                            <div
                                className="modal-dialog modal-lg modal-dialog-centered"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                <div className="modal-content border-0 rounded-4 overflow-hidden">

                                    <div className="modal-header border-0 pb-0">

                                        <h5 className="fw-bold mb-0">

                                            Certificate Preview

                                        </h5>

                                        <button
                                            className="btn-close"
                                            onClick={() =>
                                                setSelectedCert(null)
                                            }
                                        ></button>

                                    </div>

                                    <div className="modal-body p-4">

                                        <div
                                            id="certificate-print"
                                            ref={printRef}
                                            className="border rounded-4 p-4 p-md-5 text-center"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                                                borderColor: "#e2e8f0",
                                                borderWidth: "2px",
                                                borderStyle: "solid"
                                            }}
                                        >

                                            <div className="mb-3">

                                                <i className="bi bi-award text-primary fs-1"></i>

                                            </div>

                                            <h6 className="text-primary fw-bold text-uppercase small letter-spacing-1 mb-2">

                                                SkillBridgeAI

                                            </h6>

                                            <h2 className="fw-bold mb-2">

                                                Certificate of Completion

                                            </h2>

                                            <p className="text-muted mb-4">

                                                This is to certify that

                                            </p>

                                            <h3 className="fw-bold text-primary mb-2">

                                                {JSON.parse(
                                                    localStorage.getItem(
                                                        "user"
                                                    ) || "{}"
                                                )?.name || "Student"}

                                            </h3>

                                            <p className="text-muted mb-3">

                                                has successfully completed the course

                                            </p>

                                            <h4 className="fw-bold mb-3">

                                                {selectedCert.course?.title}

                                            </h4>

                                            <p className="text-muted small mb-4">

                                                {selectedCert.course?.category} •{" "}

                                                {selectedCert.course?.level} •{" "}

                                                {selectedCert.course?.duration}

                                            </p>

                                            <div className="d-flex justify-content-center gap-4 mt-4 pt-4 border-top">

                                                <div className="text-center">

                                                    <p className="small text-muted mb-1">
                                                        Date

                                                    </p>

                                                    <p className="fw-semibold small mb-0">

                                                        {new Date(
                                                            selectedCert.issuedAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )}

                                                    </p>

                                                </div>

                                                <div className="text-center">

                                                    <p className="small text-muted mb-1">
                                                        Certificate ID

                                                    </p>

                                                    <p className="fw-semibold small mb-0">

                                                        SB-
                                                        {selectedCert.course?._id?.slice(
                                                            -6
                                                        ).toUpperCase()}

                                                    </p>

                                                </div>

                                            </div>

                                            <div className="mt-4">

                                                <span className="badge bg-primary px-3 py-2">

                                                    <i className="bi bi-patch-check me-1"></i>

                                                    Verified by SkillBridgeAI

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="modal-footer border-0 pt-0">

                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setSelectedCert(null)
                                            }
                                        >
                                            Close
                                        </button>

                                        <button
                                            className="btn btn-primary"
                                            onClick={handlePrint}
                                        >

                                            <i className="bi bi-printer me-2"></i>

                                            Print Certificate

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </>

            )}

        </div>

    );

}

export default Certificates;
