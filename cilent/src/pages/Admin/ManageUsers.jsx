import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function ManageUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        role: ""
    });


    useEffect(() => {

        getUsers();

    }, []);


    const getUsers = async () => {

        try {

        console.log("GET USERS FUNCTION STARTED");

        const response = await API.get("/users");

        console.log("USERS API RESPONSE:", response.data);

        setUsers(response.data.users || []);

    }catch (error) {

            console.log(
                "Users Error:",
                error.response?.data || error.message
            );

        } finally {

            setLoading(false);

        }

    };


    const handleEdit = (user) => {

        setEditingUser(user);

        setFormData({
            name: user.name || "",
            phone: user.phone || "",
            role: user.role || "Student"
        });

    };


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            await API.put(
                `/users/${editingUser._id}`,
                formData
            );

            alert("User updated successfully");

            setEditingUser(null);

            getUsers();

        } catch (error) {

            console.log(
                "Update Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to update user"
            );

        }

    };


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await API.delete(`/users/${id}`);

            alert("User deleted successfully");

            getUsers();

        } catch (error) {

            console.log(
                "Delete Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );

        }

    };


    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Manage Users
                </h2>

                <span className="badge bg-primary fs-6">
                    Total Users: {users.length}
                </span>

            </div>


            {loading ? (

                <p>Loading users...</p>

            ) : users.length === 0 ? (

                <div className="alert alert-info">
                    No users found.
                </div>

            ) : (

                <div className="card shadow-sm">

                    <div className="table-responsive">

                        <table className="table table-hover mb-0">

                            <thead className="table-dark">

                                <tr>

                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.map((user, index) => (

                                    <tr key={user._id}>

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {user.name}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.phone || "Not provided"}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    user.role?.toLowerCase() === "admin"
                                                        ? "badge bg-danger"
                                                        : user.role?.toLowerCase() === "recruiter"
                                                        ? "badge bg-warning text-dark"
                                                        : "badge bg-primary"
                                                }
                                            >
                                                {user.role}
                                            </span>

                                        </td>


                                        <td>

                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit
                                            </button>


                                            {user.role?.toLowerCase() !== "admin" && (

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    Delete
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}


            {editingUser && (

                <div className="card shadow mt-4">

                    <div className="card-header">

                        <h5 className="mb-0">
                            Edit User
                        </h5>

                    </div>


                    <div className="card-body">

                        <form onSubmit={handleUpdate}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="mb-3">

                                <label className="form-label">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="mb-3">

                                <label className="form-label">
                                    Role
                                </label>

                                <select
                                    name="role"
                                    className="form-select"
                                    value={formData.role}
                                    onChange={handleChange}
                                >

                                    <option value="Student">
                                        Student
                                    </option>

                                    <option value="Recruiter">
                                        Recruiter
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>

                                </select>

                            </div>


                            <button
                                type="submit"
                                className="btn btn-success me-2"
                            >
                                Save Changes
                            </button>


                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}

export default ManageUsers;