import { useState } from "react";
import API from "../../api/axiosInstance";

function ResumeAnalyzer() {

    const [resumeText, setResumeText] = useState("");
    const [targetRole, setTargetRole] = useState("Software Developer");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadFromBuilder = async () => {
        try {
            const res = await API.get("/resumes/my-resume");
            const r = res.data.resume || res.data;
            if (!r) { setError("No saved resume found. Build one first."); return; }
            const text = [
                `Name: ${r.personalInfo?.fullName || ""}`,
                `Email: ${r.personalInfo?.email || ""}`,
                `Phone: ${r.personalInfo?.phone || ""}`,
                `Objective: ${r.objective || ""}`,
                `Education: ${(r.education || []).map(e => `${e.degree} at ${e.institution} (${e.year})`).join(" | ")}`,
                `Experience: ${(r.experience || []).map(e => `${e.role} at ${e.company}: ${e.description}`).join(" | ")}`,
                `Skills: ${(r.skills || []).join(", ")}`,
                `Projects: ${(r.projects || []).map(p => `${p.title}: ${p.description}`).join(" | ")}`
            ].filter(Boolean).join("\n");
            setResumeText(text);
            setError("");
        } catch {
            setError("No saved resume. Paste your resume text manually below.");
        }
    };

    const analyze = async (e) => {
        e.preventDefault();
        setError(""); setResult(null);
        if (resumeText.trim().length < 50) { setError("Paste at least 50 characters of your resume."); return; }
        setLoading(true);
        try {
            const res = await API.post("/ai/resume-analyze", { resumeText, targetRole });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to analyze resume");
        } finally { setLoading(false); }
    };

    const scoreColor = (s) => s >= 80 ? "success" : s >= 60 ? "warning" : "danger";
    const scoreBg = (s) => s >= 80 ? "bg-success" : s >= 60 ? "bg-warning" : "bg-danger";

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold mb-1"><i className="bi bi-file-earmark-check text-primary me-2"></i>AI Resume Analyzer</h4>
                <p className="text-muted mb-0">Get ATS score, missing keywords and actionable fixes — powered by Gemini AI.</p>
            </div>

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0">Your Resume</h6>
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={loadFromBuilder}><i className="bi bi-download me-1"></i>Load from Builder</button>
                            </div>
                            {error && <div className="alert alert-danger py-2 small">{error}</div>}
                            <form onSubmit={analyze}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Target Role</label>
                                    <select className="form-select" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                                        <option>Software Developer</option>
                                        <option>Frontend Developer</option>
                                        <option>Backend Developer</option>
                                        <option>Data Analyst</option>
                                        <option>Machine Learning Engineer</option>
                                        <option>UI/UX Designer</option>
                                        <option>Cyber Security Analyst</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Paste Resume Text</label>
                                    <textarea className="form-control" rows="12" placeholder="Paste your full resume text here... Include education, skills, experience, projects." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
                                    <small className="text-muted">{resumeText.length} characters • min 50</small>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Analyzing with Gemini AI...</> : <><i className="bi bi-stars me-2"></i>Analyze Resume</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    {!result ? (
                        <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
                            <div className="card-body p-4 text-center d-flex flex-column justify-content-center h-100">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "64px", height: "64px" }}><i className="bi bi-graph-up-arrow fs-3"></i></div>
                                <h6 className="fw-bold">How scoring works</h6>
                                <ul className="text-muted small text-start mx-auto" style={{ maxWidth: "320px" }}>
                                    <li>ATS score 0-100 based on keywords & formatting</li>
                                    <li>Strengths & weaknesses specific to {targetRole}</li>
                                    <li>Missing keywords to add for better ranking</li>
                                    <li>Actionable fixes to improve instantly</li>
                                </ul>
                                <span className="badge bg-primary bg-opacity-10 text-primary border mt-2"><i className="bi bi-shield-check me-1"></i>Powered by Gemini AI</span>
                            </div>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <div className={`d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold ${scoreBg(result.score)}`} style={{ width: "96px", height: "96px", fontSize: "2rem" }}>{result.score}</div>
                                    <div className="mt-2"><span className={`badge bg-${scoreColor(result.score)}`}>{result.level}</span> {result.isTrueAI && <span className="badge bg-primary ms-1"><i className="bi bi-stars me-1"></i>Gemini AI</span>}</div>
                                    <p className="text-muted small mt-2 mb-0">ATS Score for {targetRole}</p>
                                    <div className="progress mt-2" style={{ height: "8px" }}><div className={`progress-bar bg-${scoreColor(result.score)}`} style={{ width: `${result.score}%` }}></div></div>
                                </div>

                                <div className="mb-3">
                                    <h6 className="fw-bold small text-success"><i className="bi bi-check-circle me-1"></i>Strengths</h6>
                                    <ul className="small text-muted mb-0">{(result.strengths || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
                                </div>
                                <div className="mb-3">
                                    <h6 className="fw-bold small text-danger"><i className="bi bi-exclamation-triangle me-1"></i>Weaknesses</h6>
                                    <ul className="small text-muted mb-0">{(result.weaknesses || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
                                </div>
                                {result.missingKeywords?.length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="fw-bold small"><i className="bi bi-key me-1"></i>Missing Keywords</h6>
                                        <div className="d-flex flex-wrap gap-1">{result.missingKeywords.map((k, i) => <span key={i} className="badge bg-warning bg-opacity-10 text-warning border">{k}</span>)}</div>
                                    </div>
                                )}
                                <div>
                                    <h6 className="fw-bold small text-primary"><i className="bi bi-lightbulb me-1"></i>Suggestions</h6>
                                    <ul className="small text-muted mb-0">{(result.suggestions || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ResumeAnalyzer;
