import API from "../../api/axiosInstance";
import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated, getRole, getDashboardPath } from "../../utils/auth";
import Logo from "../../components/Logo";

function Register() {
  const [formData, setFormData] = useState({ fullName:"", email:"", mobile:"", role:"student", password:"", confirmPassword:"" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();
  if (isAuthenticated()) return <Navigate to={getDashboardPath(getRole())} replace />;

  const handleChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); setErrors({ ...errors, [name]: "" }); };
  const checkPasswordStrength = (password) => {
    if (password.length < 8) setPasswordStrength("Weak");
    else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && /[a-z]/.test(password)) setPasswordStrength("Strong");
    else if (/[A-Z]/.test(password) && /[0-9]/.test(password)) setPasswordStrength("Medium");
    else setPasswordStrength("Weak");
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    else if (formData.fullName.length < 3) newErrors.fullName = "Minimum 3 characters required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile Number is required";
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Minimum 8 characters required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors); return Object.keys(newErrors).length === 0;
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try { setLoading(true); await API.post("/register", formData); setSuccessMessage("Account created! Redirecting to sign in..."); setTimeout(()=> navigate("/login"), 1600); }
    catch (error) { alert(error.response?.data?.message || "Registration Failed"); } finally { setLoading(false); }
  };

  return (
    <div className="auth-single">
      <div className="auth-topbar">
        <Logo showTagline />
        <div className="auth-topbar-links">
          <Link to="/" className="auth-top-link"><i className="bi bi-house"></i> Home</Link>
          <Link to="/login" className="auth-top-link primary"><i className="bi bi-box-arrow-in-right me-1"></i> Sign in</Link>
        </div>
      </div>

      <div className="auth-center">
        <div className="auth-card register-card">
          <div className="auth-card-header">
            <h3>Create account</h3>
            <p>Start your AI-powered career journey</p>
          </div>
          {successMessage && <div className="alert alert-success py-2 small d-flex align-items-center"><i className="bi bi-check-circle-fill me-2"></i>{successMessage}</div>}

          <form onSubmit={handleRegister}>
            <div className="row">
              <div className="col-md-6 mb-3 auth-input-group">
                <label className="form-label fw-semibold small">Full Name</label>
                <div className="input-group"><span className="input-group-text"><i className="bi bi-person"></i></span><input type="text" name="fullName" className={`form-control ${errors.fullName?"is-invalid":""}`} placeholder="Rahul Sharma" value={formData.fullName} onChange={handleChange} /></div>
                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
              </div>
              <div className="col-md-6 mb-3 auth-input-group">
                <label className="form-label fw-semibold small">Mobile</label>
                <div className="input-group"><span className="input-group-text"><i className="bi bi-telephone"></i></span><input type="tel" name="mobile" className={`form-control ${errors.mobile?"is-invalid":""}`} placeholder="9876543210" value={formData.mobile} onChange={handleChange} /></div>
                {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
              </div>
            </div>

            <div className="mb-3 auth-input-group">
              <label className="form-label fw-semibold small">Email Address</label>
              <div className="input-group"><span className="input-group-text"><i className="bi bi-envelope"></i></span><input type="email" name="email" className={`form-control ${errors.email?"is-invalid":""}`} placeholder="you@example.com" value={formData.email} onChange={handleChange} /></div>
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            <div className="mb-3 auth-input-group">
              <label className="form-label fw-semibold small">Choose your role</label>
              <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                <option value="student">Student - Find internships & mentors</option>
                <option value="mentor">Mentor - Guide students</option>
                <option value="recruiter">Recruiter - Post internships</option>
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3 auth-input-group">
                <label className="form-label fw-semibold small">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input type={showPassword?"text":"password"} name="password" className={`form-control ${errors.password?"is-invalid":""}`} placeholder="Min 8 characters" value={formData.password} onChange={(e)=>{handleChange(e); checkPasswordStrength(e.target.value)}} />
                </div>
                {errors.password && <small className="text-danger">{errors.password}</small>}
                {passwordStrength && <span className={`password-strength ${passwordStrength}`} style={{ fontSize:"0.75rem" }}>Strength: {passwordStrength}</span>}
              </div>
              <div className="col-md-6 mb-3 auth-input-group">
                <label className="form-label fw-semibold small">Confirm Password</label>
                <div className="input-group"><span className="input-group-text"><i className="bi bi-lock-fill"></i></span><input type={showPassword?"text":"password"} name="confirmPassword" className={`form-control ${errors.confirmPassword?"is-invalid":""}`} placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} /></div>
                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
              </div>
            </div>

            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="showPassReg" checked={showPassword} onChange={()=>setShowPassword(!showPassword)} />
              <label className="form-check-label small" htmlFor="showPassReg">Show passwords</label>
            </div>

            <button type="submit" className="btn btn-auth-primary w-100" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span> Creating account...</> : <>Create account <i className="bi bi-arrow-right ms-1"></i></>}
            </button>

            <div className="auth-divider"><span>or</span></div>
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-auth-ghost flex-fill text-center text-decoration-none"><i className="bi bi-box-arrow-in-right me-1"></i> Sign in</Link>
              <Link to="/" className="btn btn-auth-ghost flex-fill text-center text-decoration-none"><i className="bi bi-eye me-1"></i> Explore as guest</Link>
            </div>
            <p className="auth-footer-note">By creating an account you agree to Terms & Privacy <span className="mx-1">|</span> <Link to="/#features">Learn more</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Register;
