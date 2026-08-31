import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

function GlobalSearch() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState({ courses: [], internships: [], mentors: [] });
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults({ courses: [], internships: [], mentors: [] });
            return;
        }
        const id = setTimeout(async () => {
            setLoading(true);
            try {
                const [c, i, m] = await Promise.allSettled([
                    API.get("/courses"),
                    API.get("/internships"),
                    API.get("/mentor")
                ]);
                const q = query.toLowerCase();
                const courses = c.status === "fulfilled" ? (c.value.data.courses || []).filter((x) => (x.title + x.category + (x.description || "")).toLowerCase().includes(q)).slice(0, 3) : [];
                const internships = i.status === "fulfilled" ? (i.value.data.internships || []).filter((x) => (x.title + (x.company || "") + (x.location || "")).toLowerCase().includes(q)).slice(0, 3) : [];
                const mentors = m.status === "fulfilled" ? (m.value.data.mentors || []).filter((x) => (x.name + (x.expertise || "")).toLowerCase().includes(q)).slice(0, 3) : [];
                setResults({ courses, internships, mentors });
                setOpen(true);
            } catch {}
            setLoading(false);
        }, 280);
        return () => clearTimeout(id);
    }, [query]);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
                setOpen(true);
            }
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const hasResults = results.courses.length + results.internships.length + results.mentors.length > 0;
    const totalCount = results.courses.length + results.internships.length + results.mentors.length;
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <div className="global-search-wrap position-relative w-100 mx-auto" style={{ maxWidth: "420px", minWidth: 0 }}>
            <div
                className="global-search-bar d-flex align-items-center bg-white border rounded-pill px-2 px-sm-3 py-1 shadow-sm overflow-hidden"
                style={{
                    height: "42px",
                    minWidth: 0,
                    maxWidth: "100%",
                    borderColor: focused ? "#2563eb" : "#e2e8f0",
                    boxShadow: focused ? "0 0 0 4px rgba(37,99,235,0.12), 0 4px 12px rgba(15,23,42,0.06)" : "0 1px 3px rgba(15,23,42,0.04)",
                    transition: "all 0.2s ease",
                    gap: "8px"
                }}
            >
                <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "28px", height: "28px", background: focused ? "#2563eb" : "#f1f5f9", color: focused ? "white" : "#64748b", transition: "all 0.2s" }}>
                    <i className="bi bi-search" style={{ fontSize: "0.9rem" }}></i>
                </div>
                <input
                    ref={inputRef}
                    id="global-search-input"
                    type="text"
                    className="border-0 flex-grow-1 bg-transparent text-truncate"
                    placeholder="Search..."
                    title="Search courses, internships, mentors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { setFocused(true); if (query.length >= 2) setOpen(true); }}
                    onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 180); }}
                    style={{ outline: "none", fontSize: "0.9rem", fontWeight: 500, color: "#0f172a", minWidth: 0, width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                />
                <div className="d-flex align-items-center gap-1 flex-shrink-0">
                    {loading ? (
                        <span className="spinner-border spinner-border-sm text-primary" style={{ width: "16px", height: "16px" }}></span>
                    ) : query ? (
                        <button className="btn btn-sm btn-light rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }} onMouseDown={(e) => { e.preventDefault(); setQuery(""); setOpen(false); }} title="Clear">
                            <i className="bi bi-x" style={{ fontSize: "1rem" }}></i>
                        </button>
                    ) : null}
                    <span className="d-none d-md-inline-flex align-items-center gap-1 bg-light border rounded-3 px-2 py-1" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", letterSpacing: "0.02em" }}>
                        <span className="bg-white border rounded px-1" style={{ fontSize: "0.65rem", lineHeight: 1 }}>⌘</span>K
                    </span>
                </div>
            </div>

            {open && (
                <div className="card border-0 shadow-lg position-absolute start-0 end-0 mt-2 overflow-hidden" style={{ zIndex: 1050, borderRadius: "1rem", border: "1px solid #eef1f6" }}>
                    <div className="card-body p-0" style={{ maxHeight: isMobile ? "320px" : "440px", overflowY: "auto" }}>
                        {query.length < 2 ? (
                            <div className="p-4 text-center">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "40px", height: "40px" }}><i className="bi bi-stars"></i></div>
                                <p className="fw-semibold mb-1" style={{ fontSize: "0.9rem" }}>Search anything</p>
                                <p className="text-muted small mb-2">Try "React", "Python", "Pune" or mentor name</p>
                                <div className="d-flex flex-wrap gap-1 justify-content-center">
                                    {["React", "Internship", "Mentor", "Python"].map((t) => (
                                        <button key={t} className="btn btn-sm btn-light border rounded-pill px-2 py-1" style={{ fontSize: "0.75rem" }} onMouseDown={() => setQuery(t)}>{t}</button>
                                    ))}
                                </div>
                            </div>
                        ) : !hasResults && !loading ? (
                            <div className="text-center py-4">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: "48px", height: "48px" }}><i className="bi bi-search text-muted fs-5"></i></div>
                                <p className="fw-semibold mb-1">No results for “{query}”</p>
                                <p className="text-muted small mb-0">Try a different keyword</p>
                            </div>
                        ) : (
                            <>
                                {totalCount > 0 && (
                                    <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-light border-bottom">
                                        <small className="text-muted fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>{totalCount} results</small>
                                        <small className="text-muted" style={{ fontSize: "0.7rem" }}>Press <span className="badge bg-white text-dark border">Esc</span> to close</small>
                                    </div>
                                )}
                                {results.courses.length > 0 && (
                                    <div className="p-2">
                                        <div className="d-flex align-items-center gap-2 px-2 py-1">
                                            <span className="bg-primary bg-opacity-10 text-primary rounded-2 d-inline-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px" }}><i className="bi bi-book" style={{ fontSize: "0.75rem" }}></i></span>
                                            <small className="text-muted fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Courses • {results.courses.length}</small>
                                        </div>
                                        {results.courses.map((c) => (
                                            <button key={c._id} className="btn w-100 text-start d-flex align-items-center gap-2 gap-sm-3 p-2 mt-1 border-0 rounded-3" style={{ background: "white", minWidth: 0 }} onMouseDown={() => { navigate(`/student/course/${c._id}`); setOpen(false); setQuery(""); }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                                                <span className="bg-primary bg-opacity-10 text-primary rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px" }}><i className="bi bi-book" style={{ fontSize: "0.85rem" }}></i></span>
                                                <span className="flex-grow-1 text-start" style={{ minWidth: 0, overflow: "hidden" }}>
                                                    <span className="d-block fw-semibold text-truncate" style={{ fontSize: "0.88rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</span>
                                                    <small className="text-muted text-truncate d-block" style={{ fontSize: "0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.category} • {c.level || "All levels"}</small>
                                                </span>
                                                <i className="bi bi-arrow-right text-muted small flex-shrink-0"></i>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {results.internships.length > 0 && (
                                    <div className="p-2 border-top">
                                        <div className="d-flex align-items-center gap-2 px-2 py-1">
                                            <span className="bg-warning bg-opacity-10 text-warning rounded-2 d-inline-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px" }}><i className="bi bi-briefcase" style={{ fontSize: "0.75rem" }}></i></span>
                                            <small className="text-muted fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Internships • {results.internships.length}</small>
                                        </div>
                                        {results.internships.map((it) => (
                                            <button key={it._id} className="btn w-100 text-start d-flex align-items-center gap-2 gap-sm-3 p-2 mt-1 border-0 rounded-3" style={{ background: "white", minWidth: 0 }} onMouseDown={() => { navigate(`/student/internship/${it._id}`); setOpen(false); setQuery(""); }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                                                <span className="bg-warning bg-opacity-10 text-warning rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px" }}><i className="bi bi-briefcase" style={{ fontSize: "0.85rem" }}></i></span>
                                                <span className="flex-grow-1 text-start" style={{ minWidth: 0, overflow: "hidden" }}>
                                                    <span className="d-block fw-semibold text-truncate" style={{ fontSize: "0.88rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title || it.role}</span>
                                                    <small className="text-muted text-truncate d-block" style={{ fontSize: "0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.company || ""} {it.location ? `• ${it.location}` : ""}</small>
                                                </span>
                                                <i className="bi bi-arrow-right text-muted small flex-shrink-0"></i>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {results.mentors.length > 0 && (
                                    <div className="p-2 border-top">
                                        <div className="d-flex align-items-center gap-2 px-2 py-1">
                                            <span className="bg-success bg-opacity-10 text-success rounded-2 d-inline-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px" }}><i className="bi bi-person-workspace" style={{ fontSize: "0.75rem" }}></i></span>
                                            <small className="text-muted fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Mentors • {results.mentors.length}</small>
                                        </div>
                                        {results.mentors.map((m) => (
                                            <button key={m._id} className="btn w-100 text-start d-flex align-items-center gap-2 gap-sm-3 p-2 mt-1 border-0 rounded-3" style={{ background: "white", minWidth: 0 }} onMouseDown={() => { navigate(`/student/mentor/${m._id}`); setOpen(false); setQuery(""); }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                                                <span className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "32px", height: "32px", minWidth: "32px", fontWeight: 700, fontSize: "0.85rem" }}>{m.name?.charAt(0) || "M"}</span>
                                                <span className="flex-grow-1 text-start" style={{ minWidth: 0, overflow: "hidden" }}>
                                                    <span className="d-block fw-semibold text-truncate" style={{ fontSize: "0.88rem", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
                                                    <small className="text-muted text-truncate d-block" style={{ fontSize: "0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.expertise}</small>
                                                </span>
                                                <i className="bi bi-arrow-right text-muted small flex-shrink-0"></i>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="px-3 py-2 bg-light border-top d-flex align-items-center justify-content-between">
                                    <small className="text-muted" style={{ fontSize: "0.7rem" }}><i className="bi bi-lightbulb me-1"></i>Tip: Use <span className="badge bg-white text-dark border">↑↓</span> to navigate</small>
                                    <button className="btn btn-sm btn-white border" style={{ fontSize: "0.7rem" }} onMouseDown={() => setOpen(false)}>Close</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default GlobalSearch;
