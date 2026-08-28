import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { isAuthenticated, getRole, getDashboardPath } from "../../utils/auth";
import Logo from "../../components/Logo";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated()) return <Navigate to={getDashboardPath(getRole())} replace />;

  const validate = () => {
    let newErrors = {};
    const val = identifier.trim();
    if (!val) newErrors.identifier = "Email is required";
    else if (val.includes("@")) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val)) newErrors.identifier = "Enter a valid email";
    } else {
      if (!/^\d{10}$/.test(val)) newErrors.identifier = "Enter a valid 10-digit mobile number";
    }
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must contain at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = identifier.includes("@")
        ? { email: identifier.trim(), password }
        : { phone: identifier.trim(), password, identifier: identifier.trim() };
      payload.identifier = identifier.trim();
      const response = await API.post("/login", payload);
      localStorage.setItem("token", response.data.token);
      if (!response.data.token) { alert("Login failed: Token was not received from server."); return; }
      if (response.data.user) localStorage.setItem("user", JSON.stringify(response.data.user));
      setIdentifier(""); setPassword(""); setErrors({});
      const role = response.data.user?.role?.toLowerCase();
      const intendedPage = location.state?.from;
      if (intendedPage) navigate(intendedPage, { replace: true });
      else navigate(getDashboardPath(role), { replace: true });
    } catch (error) {
      if (error.response) alert(error.response.data.message || "Invalid credentials");
      else alert("Server Error. Please try again.");
    } finally { setLoading(false); }
  };

  const fillDemo = (role) => {
    if (role === "student") { setIdentifier("student@demo.com"); setPassword("demo123"); }
    if (role === "mentor") { setIdentifier("mentor@demo.com"); setPassword("demo123"); }
    if (role === "admin") { setIdentifier("admin@demo.com"); setPassword("demo123"); }
  };

  return (
    <div className="auth-single">
      <div className="auth-topbar">
        <Logo showTagline />
        <div className="auth-topbar-links">
          <Link to="/" className="auth-top-link"><i className="bi bi-house"></i> Home</Link>
          <Link to="/register" className="auth-top-link primary"><i className="bi bi-person-plus me-1"></i> Create account</Link>
        </div>
      </div>

      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-card-header">
            <h3>Sign in</h3>
            <p>Use your SkillBridgeAI account to continue</p>
          </div>

          <div className="mb-3">
            <small className="text-muted fw-semibold" style={{ fontSize:".78rem", letterSpacing:".04em", textTransform:"uppercase" }}>Quick Demo Fill</small>
            <div className="demo-btns mt-2">
              <button type="button" className="btn btn-outline-primary" onClick={()=>fillDemo("student")} style={{ borderColor:"#2563eb", color:"#2563eb", fontSize:"0.82rem" }}><i className="bi bi-mortarboard me-1"></i> Student Demo</button>
              <button type="button" className="btn btn-outline-success" onClick={()=>fillDemo("mentor")} style={{ fontSize:"0.82rem" }}><i className="bi bi-person-workspace me-1"></i> Mentor Demo</button>
              <button type="button" className="btn btn-outline-dark" onClick={()=>fillDemo("admin")} style={{ fontSize:"0.82rem" }}><i className="bi bi-shield-lock me-1"></i> Admin Demo</button>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3 auth-input-group">
              <label className="form-label fw-semibold small">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input type="text" className="form-control" placeholder="you@example.com" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} />
              </div>
              {errors.identifier && <small className="text-danger">{errors.identifier}</small>}
            </div>

            <div className="mb-2 auth-input-group">
              <label className="form-label fw-semibold small">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input type={showPassword?"text":"password"} className="form-control" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button type="button" className="input-group-text bg-white" onClick={()=>setShowPassword(!showPassword)} style={{ cursor:"pointer" }}>
                  <i className={`bi ${showPassword?"bi-eye-slash":"bi-eye"}`}></i>
                </button>
              </div>
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="showPass" checked={showPassword} onChange={()=>setShowPassword(!showPassword)} />
                <label className="form-check-label small" htmlFor="showPass">Show password</label>
              </div>
              <Link to="/forgot-password" className="small text-decoration-none fw-semibold">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-auth-primary w-100" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : <>Sign in <i className="bi bi-arrow-right ms-1"></i></>}
            </button>

            <div className="auth-divider"><span>or</span></div>
            <button type="button" className="btn btn-auth-ghost w-100" onClick={()=> navigate("/")}><i className="bi bi-eye me-2"></i>Continue as Guest - Explore Landing</button>

            <p className="text-center small mt-3 mb-0">Don't have an account? <Link to="/register" className="fw-bold text-decoration-none">Create one</Link> <span className="text-muted"> | </span> <Link to="/#features" className="text-decoration-none">See features</Link></p>
          </form>
          <p className="auth-footer-note">Secure login <span className="mx-1">|</span> Role-based access <span className="mx-1">|</span> <Link to="/">Back to home</Link></p>
        </div>
      </div>
    </div>
  );
}
export default Login;
