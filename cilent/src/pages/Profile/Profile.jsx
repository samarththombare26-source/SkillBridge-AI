import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, type: "", msg: "" });

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await API.get("/profile");
                setProfile(res.data.user);
                setName(res.data.user.name || "");
                setPhone(res.data.user.phone || "");
            } catch (e) { console.log(e); }
            finally { setLoading(false); }
        };
        getProfile();
    }, []);

    const showToast = (type, msg) => {
        setToast({ show: true, type, msg });
        setTimeout(() => setToast({ show: false, type: "", msg: "" }), 2800);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!name.trim()) { showToast("error", "Full name is required"); return; }
        if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ""))) { showToast("error", "Enter valid 10-digit phone"); return; }
        setSaving(true);
        try {
            const res = await API.put("/profile", { name: name.trim(), phone: phone.trim() });
            setProfile(res.data.user);
            showToast("success", "Profile updated successfully!");
        } catch (err) {
            showToast("error", err.response?.data?.message || "Failed to update");
        } finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: "50vh" }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted small mt-3">Loading your profile...</p>
            </div>
        );
    }

    const initials = (name || profile?.name || "S").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—";
    const roleColor = profile?.role === "student" ? "primary" : profile?.role === "mentor" ? "success" : "dark";
    const strength = (name.trim().length >= 3 ? 34 : 0) + (phone.trim().length === 10 ? 33 : 0) + (profile?.email ? 33 : 0);

    return (
        <div className="container py-3 py-md-4" style={{ maxWidth: "960px" }}>
            {/* Toast */}
            {toast.show && (
                <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"} d-flex align-items-center py-2 px-3 shadow-sm position-fixed`} style={{ top: "76px", right: "16px", zIndex: 1050, borderRadius: "0.85rem", maxWidth: "min(92vw, 380px)" }}>
                    <i className={`bi ${toast.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
                    <span className="small fw-semibold">{toast.msg}</span>
                </div>
            )}

            {/* Header card with cover */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                {/* Cover */}
                <div style={{ height: "132px", background: "linear-gradient(120deg, #2563eb 0%, #3b82f6 55%, #1e3a8a 100%)", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(600px 220px at 85% 30%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(500px 200px at 10% 80%, rgba(255,255,255,0.12), transparent 60%)" }}></div>
                    <div className="position-absolute top-0 end-0 p-3 d-none d-sm-flex gap-2">
                        <span className="badge bg-white bg-opacity-25 backdrop-blur text-white border border-white border-opacity-25 px-2 py-1" style={{ backdropFilter: "blur(6px)" }}><i className="bi bi-shield-check me-1"></i>Verified Account</span>
                    </div>
                </div>
                {/* Profile row */}
                <div className="px-3 px-md-4 pb-4" style={{ marginTop: "-56px", position: "relative", zIndex: 1 }}>
                    <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3 gap-md-4">
                        <div className="position-relative flex-shrink-0" style={{ marginTop: "0" }}>
                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow" style={{ width: "96px", height: "96px", fontSize: "2rem", background: "linear-gradient(135deg, #2563eb, #1e3a8a)", border: "4px solid white", boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}>
                                {initials}
                            </div>
                            <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: "22px", height: "22px" }} title="Online"></span>
                        </div>
                        <div className="flex-grow-1 text-center text-md-start min-width-0 w-100" style={{ paddingTop: "12px" }}>
                            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 bg-white rounded-3 px-2 py-1 d-inline-flex" style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}>
                                <h4 className="fw-bold mb-0 text-dark" style={{ lineHeight: "1.25" }}>{profile?.name || name || "Your Name"}</h4>
                                <span className={`badge bg-${roleColor} bg-opacity-10 text-${roleColor} border border-${roleColor} border-opacity-25 text-capitalize`}><i className={`bi ${profile?.role === "mentor" ? "bi-person-workspace" : profile?.role === "admin" ? "bi-shield-lock" : "bi-mortarboard"} me-1`}></i>{profile?.role || "student"}</span>
                                <span className="d-none d-md-inline text-muted">•</span>
                                <small className="text-muted"><i className="bi bi-calendar3 me-1"></i>Joined {memberSince}</small>
                            </div>
                            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mt-1 text-muted small bg-white rounded-3 px-2 py-1 d-inline-flex">
                                <span><i className="bi bi-envelope me-1"></i>{profile?.email}</span>
                                {phone && <><span className="d-none d-sm-inline">•</span><span><i className="bi bi-telephone me-1"></i>{phone}</span></>}
                            </div>
                        </div>
                        <div className="d-flex gap-2 flex-shrink-0 align-self-center align-self-md-end mb-md-1">
                            <button className="btn btn-light border rounded-pill px-3" onClick={() => document.getElementById("edit-name")?.focus()}><i className="bi bi-pencil me-1"></i>Edit</button>
                            <span className="badge bg-success bg-opacity-10 text-success border d-none d-md-inline-flex align-items-center px-3"><i className="bi bi-patch-check-fill me-1"></i>Active</span>
                        </div>
                    </div>

                    {/* Strength + quick stats */}
                    <div className="row g-3 mt-4 align-items-stretch">
                        <div className="col-12 col-md-5">
                            <div className="bg-light rounded-4 p-3 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small className="fw-bold text-muted" style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Profile Strength</small>
                                    <small className="fw-bold text-primary">{strength}%</small>
                                </div>
                                <div className="progress" style={{ height: "7px", borderRadius: "100px", background: "#e2e8f0" }}>
                                    <div className="progress-bar bg-primary" style={{ width: `${strength}%`, borderRadius: "100px" }}></div>
                                </div>
                                <small className="text-muted mt-2 d-block" style={{ fontSize: "0.78rem" }}>{strength < 100 ? "Complete phone & name to reach 100%" : "Your profile looks great!"}</small>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="border rounded-4 p-3 text-center h-100 bg-white">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "40px", height: "40px" }}><i className="bi bi-envelope-check"></i></div>
                                <div className="small fw-bold">Email Verified</div>
                                <small className="text-muted" style={{ fontSize: "0.75rem" }}>Secure login</small>
                            </div>
                        </div>
                        <div className="col-6 col-md-4">
                            <div className="border rounded-4 p-3 h-100 bg-white d-flex align-items-center gap-3">
                                <div className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "40px", height: "40px" }}><i className="bi bi-shield-lock"></i></div>
                                <div className="text-start">
                                    <div className="small fw-bold">Account Private</div>
                                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>Only you can edit</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit form */}
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-3 p-md-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h5 className="fw-bold mb-0"><i className="bi bi-person-gear text-primary me-2"></i>Personal Information</h5>
                                <span className="badge bg-light text-muted border fw-normal">Editable</span>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small" htmlFor="edit-name">Full Name <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                                        <input id="edit-name" type="text" className="form-control" placeholder="e.g. Sham Dhadge" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>This name will appear on certificates</small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                                        <input type="email" className="form-control" value={profile?.email || ""} disabled style={{ background: "#f1f5f9" }} />
                                        <span className="input-group-text bg-white text-success"><i className="bi bi-lock-fill"></i></span>
                                    </div>
                                    <small className="text-muted" style={{ fontSize: "0.75rem" }}><i className="bi bi-info-circle me-1"></i>Email cannot be changed — contact support for update</small>
                                </div>
                                <div className="row g-3">
                                    <div className="col-12 col-sm-6">
                                        <label className="form-label fw-semibold small" htmlFor="edit-phone">Phone Number</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-telephone"></i></span>
                                            <input id="edit-phone" type="tel" className="form-control" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} maxLength={10} />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <label className="form-label fw-semibold small">Role</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-person-badge"></i></span>
                                            <input type="text" className="form-control text-capitalize" value={profile?.role || ""} disabled style={{ background: "#f1f5f9" }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                                    <button type="submit" className="btn btn-primary flex-fill flex-sm-grow-0 px-4 py-2 fw-bold" disabled={saving} style={{ borderRadius: "0.85rem" }}>
                                        {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-check2-circle me-2"></i>Save Changes</>}
                                    </button>
                                    <button type="button" className="btn btn-light border px-4" onClick={() => { setName(profile?.name || ""); setPhone(profile?.phone || ""); showToast("success", "Changes discarded"); }} style={{ borderRadius: "0.85rem" }}>Reset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 mb-3">
                        <div className="card-body p-3 p-md-4">
                            <h6 className="fw-bold mb-3"><i className="bi bi-info-circle text-primary me-2"></i>Account Details</h6>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                                    <div><small className="text-muted d-block" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>User ID</small><small className="fw-monospace fw-semibold" style={{ fontSize: "0.82rem" }}>{profile?._id?.slice(-8).toUpperCase() || "—"}</small></div>
                                    <i className="bi bi-fingerprint text-muted fs-5"></i>
                                </div>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "36px", height: "36px" }}><i className="bi bi-calendar-check"></i></div>
                                    <div><small className="text-muted">Member since</small><div className="fw-semibold small">{memberSince}</div></div>
                                </div>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "36px", height: "36px" }}><i className="bi bi-shield-check"></i></div>
                                    <div><small className="text-muted">Security</small><div className="fw-semibold small">Password protected</div><a href="/forgot-password" className="small text-decoration-none">Reset password →</a></div>
                                </div>
                                <hr className="my-1" />
                                <div className="d-flex gap-2">
                                    <a href="/" className="btn btn-outline-primary btn-sm flex-fill rounded-pill"><i className="bi bi-house me-1"></i>Home</a>
                                    <a href="/student" className="btn btn-primary btn-sm flex-fill rounded-pill"><i className="bi bi-speedometer2 me-1"></i>Dashboard</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="alert alert-light border d-flex gap-3 align-items-start py-3" style={{ borderRadius: "1rem" }}>
                        <i className="bi bi-lightbulb text-warning fs-5 flex-shrink-0"></i>
                        <small className="text-muted" style={{ lineHeight: 1.5 }}><strong className="text-dark">Tip:</strong> Keep your phone updated to receive internship alerts and mentor messages instantly.</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Profile;
