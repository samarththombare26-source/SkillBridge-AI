import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";

function ForgotPassword() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [demoOtp, setDemoOtp] = useState("");
    const [isSimulated, setIsSimulated] = useState(false);

    // Step 1: Send OTP (real email or simulated)
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(""); setSuccess(""); setDemoOtp(""); setIsSimulated(false);
        const val = identifier.trim();
        if (!val) { setError("Please enter your registered email or mobile number"); return; }
        if (val.includes("@") && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val)) {
            setError("Enter a valid email address"); return;
        }
        if (!val.includes("@") && !/^\d{10}$/.test(val)) {
            setError("Enter a valid 10-digit mobile number"); return;
        }
        setLoading(true);
        try {
            const res = await API.post("/forgot-password", { identifier: val });
            // Backend returns isSimulated + otp in dev mode (when SMTP placeholder)
            if (res.data.isSimulated && res.data.otp) {
                setDemoOtp(res.data.otp);
                setIsSimulated(true);
                setSuccess(`${res.data.message} | Dev OTP: ${res.data.otp} (also check server console)`);
            } else {
                setSuccess(res.data.message || "OTP sent! Check your email inbox (and spam folder). Valid for 10 minutes.");
            }
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP. If SMTP is not configured, check server/.env SMTP settings. For Gmail, use App Password at https://myaccount.google.com/apppasswords");
        } finally { setLoading(false); }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!otp.trim() || otp.length !== 6) { setError("Enter the 6-digit OTP"); return; }
        setLoading(true);
        try {
            const res = await API.post("/verify-otp", { identifier: identifier.trim(), otp: otp.trim() });
            setSuccess(res.data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally { setLoading(false); }
    };

    // Step 3: Reset Password
    const handleReset = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!newPassword || newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
        if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
        setLoading(true);
        try {
            const res = await API.post("/reset-password", {
                identifier: identifier.trim(),
                otp: otp.trim(),
                newPassword,
                confirmPassword
            });
            setSuccess(res.data.message);
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-single">
            <div className="auth-topbar">
                <Link to="/" className="auth-brand"><i className="bi bi-lightning-charge-fill"></i> SkillBridgeAI</Link>
                <div className="auth-topbar-links">
                    <Link to="/" className="auth-top-link"><i className="bi bi-house"></i> Home</Link>
                    <Link to="/login" className="auth-top-link primary"><i className="bi bi-box-arrow-in-right me-1"></i> Sign in</Link>
                </div>
            </div>

            <div className="auth-center">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h3>Forgot Password</h3>
                        <p>Reset via your registered email or mobile</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="d-flex justify-content-center gap-2 mb-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="d-flex align-items-center gap-2">
                                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${step >= s ? "bg-primary text-white" : "bg-light text-muted border"}`} style={{ width: "32px", height: "32px", fontSize: ".85rem" }}>{s}</div>
                                {s < 3 && <div className={`d-none d-sm-block ${step > s ? "bg-primary" : "bg-light border"} `} style={{ width: "40px", height: "3px", borderRadius: "2px" }}></div>}
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-center gap-4 mb-3 small text-muted" style={{ fontSize: ".75rem" }}>
                        <span className={step === 1 ? "text-primary fw-bold" : ""}>Send OTP</span>
                        <span className={step === 2 ? "text-primary fw-bold" : ""}>Verify</span>
                        <span className={step === 3 ? "text-primary fw-bold" : ""}>Reset</span>
                    </div>

                    {error && <div className="alert alert-danger py-2 small d-flex align-items-center"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}
                    {success && <div className="alert alert-success py-2 small d-flex align-items-center"><i className="bi bi-check-circle me-2"></i>{success}</div>}
                    {demoOtp && isSimulated && step === 2 && <div className="alert alert-warning py-2 small"><i className="bi bi-info-circle me-2"></i>Development mode — OTP: <strong>{demoOtp}</strong> — Configure real SMTP in <code>server/.env</code> to send actual emails. For Gmail App Password: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer">myaccount.google.com/apppasswords</a></div>}

                    {/* STEP 1: Enter Email/Mobile */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp}>
                            <div className="mb-3 auth-input-group">
                                <label className="form-label fw-semibold small">Registered Email or Mobile</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-person-badge"></i></span>
                                    <input type="text" className="form-control" placeholder="you@example.com or 9876543210" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoFocus />
                                </div>
                                <small className="text-muted">We will send a 6-digit code to your registered email / mobile</small>
                            </div>
                            <button type="submit" className="btn btn-auth-primary w-100" disabled={loading}>
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending OTP...</> : <><i className="bi bi-send me-2"></i>Send OTP</>}
                            </button>
                            <div className="text-center mt-3 small">
                                Remembered? <Link to="/login" className="text-decoration-none fw-bold">Back to Sign in</Link>
                            </div>
                        </form>
                    )}

                    {/* STEP 2: Verify OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-3 auth-input-group">
                                <label className="form-label fw-semibold small">Enter OTP sent to <span className="text-primary">{identifier}</span></label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-shield-lock"></i></span>
                                    <input type="text" className="form-control text-center" style={{ letterSpacing: "0.4em", fontWeight: 700 }} placeholder="123456" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} autoFocus />
                                </div>
                                <small className="text-muted">Code valid for 10 minutes. Check your email inbox and spam folder. For mobile, OTP is sent to your registered email.</small>
                            </div>
                            <button type="submit" className="btn btn-auth-primary w-100" disabled={loading}>
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Verifying...</> : <><i className="bi bi-check2-circle me-2"></i>Verify OTP</>}
                            </button>
                            <div className="d-flex justify-content-between mt-3 small">
                                <button type="button" className="btn btn-link btn-sm text-decoration-none p-0" onClick={() => setStep(1)}>Back</button>
                                <button type="button" className="btn btn-link btn-sm text-decoration-none p-0" onClick={handleSendOtp} disabled={loading}>Resend OTP</button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: Reset Password */}
                    {step === 3 && (
                        <form onSubmit={handleReset}>
                            <div className="mb-3 auth-input-group">
                                <label className="form-label fw-semibold small">New Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                                    <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Min 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    <button type="button" className="input-group-text bg-white" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}><i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i></button>
                                </div>
                            </div>
                            <div className="mb-3 auth-input-group">
                                <label className="form-label fw-semibold small">Confirm New Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                                    <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" id="showPassForgot" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                                <label className="form-check-label small" htmlFor="showPassForgot">Show passwords</label>
                            </div>
                            <button type="submit" className="btn btn-auth-primary w-100" disabled={loading}>
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Resetting...</> : <><i className="bi bi-arrow-repeat me-2"></i>Reset Password</>}
                            </button>
                            <div className="text-center mt-3 small">
                                <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={() => setStep(2)}>Back to OTP</button>
                            </div>
                        </form>
                    )}

                    {/* STEP 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-3">
                            <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}><i className="bi bi-check-lg fs-3"></i></div>
                            <h5 className="fw-bold">Password Reset Successful!</h5>
                            <p className="text-muted small">You can now sign in with your new password.</p>
                            <button className="btn btn-auth-primary w-100" onClick={() => navigate("/login")}><i className="bi bi-box-arrow-in-right me-2"></i>Go to Sign in</button>
                        </div>
                    )}

                    <p className="auth-footer-note mt-4">Need help? <Link to="/">Contact support</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
