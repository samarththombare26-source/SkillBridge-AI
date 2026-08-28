import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function DashboardCards() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        courses: 0,
        progress: 0,
        certificates: 0,
        aiScore: 92
    });


    useEffect(() => {

        fetchStats();

    }, []);


    const fetchStats = async () => {

        try {

            const [coursesRes, enrollmentsRes] = await Promise.allSettled([
                API.get("/courses"),
                API.get("/enrollments/my-enrollments")
            ]);


            const courses =
                coursesRes.status === "fulfilled"
                    ? (coursesRes.value.data.courses?.length || 0)
                    : 0;

            const enrollments =
                enrollmentsRes.status === "fulfilled"
                    ? (enrollmentsRes.value.data.enrollments || [])
                    : [];


            let totalProgress = 0;
            let completedCount = 0;

            if (enrollments.length > 0) {

                const progressResults = await Promise.allSettled(
                    enrollments.map((enrollment) =>
                        API.get(`/progress/${enrollment.course?._id}`)
                    )
                );

                let sum = 0;
                let valid = 0;

                progressResults.forEach((result) => {

                    if (result.status === "fulfilled") {

                        const progress =
                            result.value.data.progress;

                        sum += progress?.percentage || 0;
                        valid++;

                        if (progress?.completed) {

                            completedCount++;

                        }

                    }

                });

                totalProgress =
                    valid > 0
                        ? Math.round(sum / valid)
                        : 0;

            }

            // AI Score - mock based on progress for now
            const aiScore =
                totalProgress > 0
                    ? Math.min(98, 72 + Math.round(totalProgress * 0.28))
                    : 92;


            setStats({
                courses,
                progress: totalProgress,
                certificates: completedCount,
                aiScore
            });

        } catch (error) {

            console.log("DashboardCards Error:", error);

        } finally {

            setLoading(false);

        }

    };


    const cards = [

        {
            title: "Courses",
            value: loading ? "..." : stats.courses,
            description: loading
                ? "Loading..."
                : `${stats.courses} available courses`,
            icon: "bi-book",
            color: "primary",
            onClick: null
        },

        {
            title: "Progress",
            value: loading ? "..." : `${stats.progress}%`,
            description: loading
                ? "Loading..."
                : stats.progress === 0
                    ? "Start learning to track progress"
                    : "Overall learning progress",
            icon: "bi-graph-up-arrow",
            color: "success",
            onClick: null
        },

        {
            title: "Certificates",
            value: loading ? "..." : stats.certificates,
            description: loading
                ? "Loading..."
                : stats.certificates === 0
                    ? "No certificates yet"
                    : `${stats.certificates} certificates earned`,
            icon: "bi-award",
            color: "warning",
            onClick: () => navigate("/student/certificates")
        },

        {
            title: "AI Score",
            value: loading ? "..." : `${stats.aiScore}%`,
            description: "Your AI assessment score",
            icon: "bi-cpu",
            color: "info",
            onClick: () => navigate("/student/career-recommendation")
        }

    ];


    return (

        <div className="row g-4 mb-4">

            {cards.map((card, index) => (

                <div
                    className="col-12 col-sm-6 col-xl-3"
                    key={index}
                >

                    <div
                        className={`app-card shadow-sm h-100 ${
                            card.onClick ? "cursor-pointer" : ""
                        }`}
                        onClick={card.onClick || undefined}
                        role={card.onClick ? "button" : undefined}
                        tabIndex={card.onClick ? 0 : undefined}
                        onKeyDown={
                            card.onClick
                                ? (e) => {
                                      if (
                                          e.key === "Enter" ||
                                          e.key === " "
                                      ) {
                                          card.onClick();
                                      }
                                  }
                                : undefined
                        }
                        style={
                            card.onClick
                                ? { cursor: "pointer" }
                                : undefined
                        }
                    >

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2 small fw-semibold">
                                        {card.title}
                                    </p>

                                    <h2 className="fw-bold mb-1">
                                        {card.value}
                                    </h2>

                                    <small className="text-muted">
                                        {card.description}
                                    </small>

                                    {card.onClick && !loading && (

                                        <div className="mt-2">

                                            <small className="text-primary fw-semibold">

                                                View

                                                <i className="bi bi-arrow-right ms-1"></i>

                                            </small>

                                        </div>

                                    )}

                                </div>


                                <div className={`icon-chip ${card.color}`}>

                                    <i
                                        className={`bi ${card.icon}`}
                                    ></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

}

export default DashboardCards;
