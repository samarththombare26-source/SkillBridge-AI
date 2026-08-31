import { Link } from "react-router-dom";
function NotFound() {
    return (
        <div className="container py-5 text-center" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: "80px", height: "80px" }}><i className="bi bi-compass fs-2"></i></div>
            <h1 className="fw-bold" style={{ fontSize: "clamp(2rem,6vw,3rem)" }}>404</h1>
            <h5 className="text-muted mb-3">Page Not Found</h5>
            <p className="text-muted small mb-4" style={{ maxWidth: "420px" }}>The page you are looking for does not exist or has been moved. Check the URL or return to the homepage.</p>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
                <Link to="/" className="btn btn-primary"><i className="bi bi-house me-2"></i>Back to Home</Link>
                <Link to="/login" className="btn btn-outline-primary"><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</Link>
            </div>
        </div>
    );
}

export default NotFound;