function MentorDashboardCards({ mentor }) {

    const cards = [

        {
            title: "Mentorship Status",
            value: mentor ? "Active" : "Not Set",
            description: "Your mentor profile status",
            icon: "bi-person-check",
            color: "success"
        },

        {
            title: "Availability",
            value: mentor?.availability || "Not Set",
            description: "Current availability",
            icon: "bi-calendar-check",
            color: "primary"
        },

        {
            title: "Expertise",
            value: mentor?.expertise || "Not Set",
            description: "Your primary expertise",
            icon: "bi-lightbulb",
            color: "warning"
        },

        {
            title: "Experience",
            value: mentor?.experience
                ? `${mentor.experience} Years`
                : "Not Set",
            description: "Professional experience",
            icon: "bi-briefcase",
            color: "info"
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
                        className="card border-0 shadow-sm h-100"
                        style={{
                            borderRadius: "14px"
                        }}
                    >

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>

                                    <p className="text-muted small fw-semibold mb-2">
                                        {card.title}
                                    </p>

                                    <h5 className="fw-bold mb-1">
                                        {card.value}
                                    </h5>

                                    <small className="text-muted">
                                        {card.description}
                                    </small>

                                </div>


                                <div
                                    className={`bg-${card.color} bg-opacity-10 text-${card.color} rounded-3 d-flex align-items-center justify-content-center`}
                                    style={{
                                        width: "48px",
                                        height: "48px"
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

export default MentorDashboardCards;