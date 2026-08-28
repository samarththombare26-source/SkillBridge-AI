import { useState } from "react";
import API from "../../api/axiosInstance";

function SkillQuiz() {

    const [topic, setTopic] = useState("JavaScript");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [isTrueAI, setIsTrueAI] = useState(false);
    const [error, setError] = useState("");

    const generate = async (e) => {
        e?.preventDefault();
        setError(""); setResult(null); setAnswers({}); setLoading(true);
        try {
            const res = await API.post("/quizzes/generate", { topic, skills: [topic], difficulty, count: 5 });
            setQuestions(res.data.questions || []);
            setIsTrueAI(res.data.isTrueAI || false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate quiz");
        } finally { setLoading(false); }
    };

    const submit = async () => {
        if (Object.keys(answers).length !== questions.length) {
            setError(`Answer all ${questions.length} questions`);
            return;
        }
        setError("");
        try {
            const orderedAnswers = questions.map((_, i) => answers[i]);
            const res = await API.post("/quizzes/evaluate", { questions, answers: orderedAnswers });
            setResult(res.data);
        } catch {
            setError("Failed to evaluate");
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold mb-1"><i className="bi bi-patch-question text-primary me-2"></i>AI Skill Quiz</h4>
                <p className="text-muted mb-0">Gemini generates a personalized quiz — test your skills and get instant AI feedback.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                    <form onSubmit={generate} className="row g-3 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label fw-semibold small">Topic / Skill</label>
                            <input className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. React, Python, DSA" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold small">Difficulty</label>
                            <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Generating with AI...</> : <><i className="bi bi-stars me-2"></i>Generate Quiz</>}
                            </button>
                        </div>
                    </form>
                    {isTrueAI && questions.length > 0 && <div className="mt-2"><span className="badge bg-primary"><i className="bi bi-stars me-1"></i>Gemini AI</span></div>}
                </div>
            </div>

            {error && <div className="alert alert-danger py-2 small"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}

            {questions.length > 0 && !result && (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">Questions</h5>
                        {questions.map((q, idx) => (
                            <div key={idx} className="border rounded-3 p-3 mb-3">
                                <p className="fw-semibold mb-2">{idx + 1}. {q.question}</p>
                                <div className="d-flex flex-column gap-2">
                                    {q.options.map((opt) => (
                                        <label key={opt} className={`border rounded-3 p-2 d-flex align-items-center gap-2 ${answers[idx] === opt ? "bg-primary bg-opacity-10 border-primary" : "bg-light"}`} style={{ cursor: "pointer" }}>
                                            <input type="radio" name={`q-${idx}`} checked={answers[idx] === opt} onChange={() => setAnswers({ ...answers, [idx]: opt })} />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                                {q.explanation && <small className="text-muted mt-2 d-block"><i className="bi bi-info-circle me-1"></i>{q.explanation}</small>}
                            </div>
                        ))}
                        <button className="btn btn-success w-100" onClick={submit}><i className="bi bi-check-circle me-2"></i>Submit Answers</button>
                    </div>
                </div>
            )}

            {result && (
                <div className="card border-0 shadow-sm rounded-4 mt-4">
                    <div className="card-body p-4 text-center">
                        <div className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 ${result.percentage >= 50 ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`} style={{ width: "80px", height: "80px" }}>
                            <span className="fw-bold fs-3">{result.percentage}%</span>
                        </div>
                        <h4 className="fw-bold">{result.percentage >= 80 ? "Excellent!" : result.percentage >= 50 ? "Good Job!" : "Keep Practicing!"}</h4>
                        <p className="text-muted">You scored <strong>{result.score}/{result.total}</strong> — Level: <span className="badge bg-primary">{result.level}</span></p>
                        <div className="row g-3 text-start mt-3">
                            {result.results.map((r) => (
                                <div key={r.index} className={`border rounded-3 p-3 ${r.isCorrect ? "border-success bg-success bg-opacity-10" : "border-danger bg-danger bg-opacity-10"}`}>
                                    <p className="fw-semibold mb-1">{r.index + 1}. {r.question}</p>
                                    <p className="small mb-1">Your answer: <span className={r.isCorrect ? "text-success fw-bold" : "text-danger fw-bold"}>{r.selected || "—"}</span> {r.isCorrect ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}</p>
                                    {!r.isCorrect && <p className="small text-muted mb-1">Correct: <strong>{r.correctAnswer}</strong></p>}
                                    <small className="text-muted">{r.explanation}</small>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-outline-primary mt-4" onClick={() => { setQuestions([]); setResult(null); setAnswers({}); }}>Try Another Quiz</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SkillQuiz;
