import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function AdminDashboardCards() {

    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        fetchStats();

    }, []);


    // ==========================================
    // FETCH ALL PLATFORM STATISTICS
    // ==========================================

    const fetchStats = async () => {

        try {

            setLoading(true);

            // Fetch everything in parallel.
            // allSettled = one failing endpoint
            // doesn't break the other cards.

            const [
                coursesRes,
                lessonsRes,
                usersRes,
                internshipsRes,
                roadmapsRes
            ] = await Promise.allSettled([

                API.get("/courses"),

                API.get("/lessons"),

                API.get("/users/users"),

                API.get("/internships"),

                API.get("/career-roadmaps")

            ]);


            const count = (result, key) => {

                if (result.status !== "fulfilled") {

                    return 0;

                }

                const list = result.value.data[key];

                return Array.isArray(list)
                    ? list.length
                    : 0;

            };


            const users = count(usersRes, "users");


            const usersList =
                usersRes.status === "fulfilled"
                    ? usersRes.value.data.users || []
                    : [];


            const students = usersList.filter(
                (u) =>
                    u.role?.toLowerCase() === "student"
            ).length;


            const mentors = usersList.filter(
                (u) =>
                    u.role?.toLowerCase() === "mentor"
            ).length;


            setStats({

                courses: count(coursesRes, "courses"),

                lessons: count(lessonsRes, "lessons"),

                users: users,

                students: students,

                mentors: mentors,

                internships: count(
                    internshipsRes,
                    "internships"
                ),

                roadmaps: count(
                    roadmapsRes,
                    "roadmaps"
                )

            });

        } catch (error) {

            console.log(
                "Stats Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {

        return (

            <div className="row g-4 mb-4">

                {[1, 2, 3, 4].map((n) => (

                    <div
                        className="col-sm-6 col-xl-3"
                        key={n}
                    >

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4 text-center py-5">

                                <div
                                    className="spinner-border spinner-border-sm text-primary"
                                    role="status"
                                />

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        );

    }


    const cards = [

        {
            title: "Total Courses",
            value: stats?.courses ?? 0,
            icon: "bi-book",
            color: "primary",
            description: "Available courses"
        },

        {
            title: "Total Lessons",
            value: stats?.lessons ?? 0,
            icon: "bi-journal-text",
            color: "success",
            description: "Learning resources"
        },

        {
            title: "Registered Users",
            value: stats?.users ?? 0,
            icon: "bi-people",
            color: "dark",
            description: `${stats?.students ?? 0} students · ${stats?.mentors ?? 0} mentors`
        },

        {
            title: "Internships",
            value: stats?.internships ?? 0,
            icon: "bi-briefcase",
            color: "warning",
            description: "Available opportunities"
        },

        {
            title: "Career Roadmaps",
            value: stats?.roadmaps ?? 0,
            icon: "bi-signpost-split",
            color: "info",
            description: "Learning paths created"
        }

    ];


    return (

        <div className="row g-4 mb-4">

            {cards.map((card, index) => (

                <div
                    className="col-sm-6 col-xl-3"
                    key={index}
                >

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted mb-2">
                                        {card.title}
                                    </p>

                                    <h2 className="fw-bold mb-1">
                                        {card.value}
                                    </h2>

                                    <small className="text-muted">
                                        {card.description}
                                    </small>

                                </div>


                                <div
                                    className={`bg-${card.color} bg-opacity-10 text-${card.color} rounded-3 d-flex align-items-center justify-content-center`}
                                    style={{
                                        width: "50px",
                                        height: "50px"
                                    }}
                                >

                                    <i
                                        className={`bi ${card.icon} fs-4`}
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

export default AdminDashboardCards;
