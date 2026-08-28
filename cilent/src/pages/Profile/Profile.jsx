import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function Profile() {

    const [profile, setProfile] = useState(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Get Profile
    useEffect(() => {

        const getProfile = async () => {

            try {

                const response = await API.get("/profile");

                setProfile(response.data.user);

                setName(response.data.user.name);
                setPhone(response.data.user.phone);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        getProfile();

    }, []);


    // Update Profile
    const handleUpdate = async (e) => {

        e.preventDefault();

        setSaving(true);

        try {

            const response = await API.put("/profile", {
                name,
                phone
            });

            setProfile(response.data.user);

            alert("Profile updated successfully!");

        } catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data.message);

            } else {

                alert("Server Error");

            }

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (

            <div className="text-center mt-5">

                <div className="spinner-border text-primary"></div>

                <p className="mt-2">
                    Loading Profile...
                </p>

            </div>

        );

    }


    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-7">

                    <div className="card shadow border-0 rounded-4">

                        <div className="card-body p-5">

                            <div className="text-center mb-4">

                                <i className="bi bi-person-circle text-primary"
                                    style={{ fontSize: "80px" }}>
                                </i>

                                <h2 className="fw-bold mt-3">
                                    My Profile
                                </h2>

                                <p className="text-muted">
                                    Manage your SkillBridgeAI profile
                                </p>

                            </div>


                            <form onSubmit={handleUpdate}>

                                {/* Name */}

                                <div className="mb-3">

                                    <label className="form-label fw-bold">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />

                                </div>


                                {/* Email */}

                                <div className="mb-3">

                                    <label className="form-label fw-bold">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={profile?.email || ""}
                                        disabled
                                    />

                                    <small className="text-muted">
                                        Email cannot be changed.
                                    </small>

                                </div>


                                {/* Phone */}

                                <div className="mb-3">

                                    <label className="form-label fw-bold">
                                        Phone Number
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                    />

                                </div>


                                {/* Role */}

                                <div className="mb-4">

                                    <label className="form-label fw-bold">
                                        Role
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={profile?.role || ""}
                                        disabled
                                    />

                                </div>


                                {/* Update Button */}

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-bold"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Updating...
                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-save me-2"></i>
                                            Update Profile
                                        </>

                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Profile;