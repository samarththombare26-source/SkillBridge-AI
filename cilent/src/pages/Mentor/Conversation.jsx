import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../../api/axiosInstance";
const socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000");
function Conversation() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = user?._id || user?.id;
    const fetchMessages = async () => {
        try { setLoading(true); setError(""); const res = await API.get(`/conversations/${conversationId}/messages`); setMessages(res.data.messages || res.data || []); } catch (err) { setError(err.response?.data?.message || "Failed to load messages"); } finally { setLoading(false); }
    };
    const sendMessage = async (e) => {
        e.preventDefault(); if (!message.trim()) return;
        try {
            setSending(true);
            const res = await API.post("/conversations/message", { conversationId, message: message.trim() });
            const newMessage = res.data.message || res.data;
            setMessages((prev) => [...prev, newMessage]); setMessage("");
            socket.emit("sendMessage", newMessage); socket.emit("stopTyping", conversationId);
        } catch (err) { setError(err.response?.data?.message || "Failed to send message"); } finally { setSending(false); }
    };
    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit("typing", conversationId);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => socket.emit("stopTyping", conversationId), 1500);
    };
    useEffect(() => {
        fetchMessages();
        socket.emit("joinConversation", conversationId);
        const receiveMessage = (newMessage) => { if (newMessage.conversation === conversationId || newMessage.conversation?._id === conversationId) { setMessages((prev) => prev.some((m) => m._id === newMessage._id) ? prev : [...prev, newMessage]); } };
        const onTyping = (id) => { if (id === conversationId) setTyping(true); };
        const onStopTyping = (id) => { if (id === conversationId) setTyping(false); };
        socket.on("receiveMessage", receiveMessage); socket.on("typing", onTyping); socket.on("stopTyping", onStopTyping);
        return () => { socket.off("receiveMessage", receiveMessage); socket.off("typing", onTyping); socket.off("stopTyping", onStopTyping); };
    }, [conversationId]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
    const isMyMessage = (msg) => { const senderId = msg.sender?._id || msg.sender?.id || msg.sender; return senderId?.toString() === currentUserId?.toString(); };
    const formatTime = (date) => date ? new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
    const formatDate = (date) => { const d = new Date(date); const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1); if (d.toDateString() === today.toDateString()) return "Today"; if (d.toDateString() === yesterday.toDateString()) return "Yesterday"; return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }); };
    let lastDate = "";
    return (
        <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", minHeight: "560px" }}>
            <div className="card border-0 shadow-sm rounded-4 mb-3 flex-shrink-0">
                <div className="card-body py-3 px-3 px-md-4 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <button className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "40px", height: "40px" }} onClick={() => navigate(-1)}><i className="bi bi-arrow-left"></i></button>
                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "46px", height: "46px" }}><i className="bi bi-mortarboard fs-5"></i></div>
                        <div>
                            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">Student <span className="d-none d-sm-inline text-muted fw-normal small">• Conversation</span></h6>
                            <small className="d-flex align-items-center gap-1" style={{ fontSize: "0.78rem" }}><span className="bg-success rounded-circle d-inline-block" style={{ width: "8px", height: "8px" }}></span><span className="text-success fw-semibold">Online</span><span className="text-muted d-none d-sm-inline">• Student active now</span></small>
                        </div>
                    </div>
                    <div className="d-flex gap-1">
                        <button className="btn btn-light border rounded-circle d-none d-md-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }} title="Voice call"><i className="bi bi-telephone"></i></button>
                        <button className="btn btn-light border rounded-circle d-none d-md-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }} title="Video call"><i className="bi bi-camera-video"></i></button>
                        <button className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }} title="More"><i className="bi bi-three-dots-vertical"></i></button>
                    </div>
                </div>
            </div>
            <div className="card border-0 shadow-sm rounded-4 flex-grow-1 d-flex flex-column overflow-hidden" style={{ minHeight: 0 }}>
                <div className="flex-grow-1 overflow-auto p-3 p-md-4" style={{ background: "#eef1f6", backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)", backgroundSize: "22px 22px" }}>
                    {loading && <div className="text-center py-5"><div className="spinner-border text-success" role="status"></div><p className="text-muted small mt-2">Loading conversation...</p></div>}
                    {!loading && error && <div className="alert alert-danger py-2 small">{error}</div>}
                    {!loading && !error && messages.length === 0 && (
                        <div className="text-center py-5">
                            <div className="bg-white border rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "72px", height: "72px" }}><i className="bi bi-chat-heart text-success fs-3"></i></div>
                            <h6 className="fw-bold">No messages yet</h6><p className="text-muted small mb-0">Start a conversation with your student.</p>
                        </div>
                    )}
                    <div className="d-flex flex-column gap-1">
                        {messages.map((msg, index) => {
                            const mine = isMyMessage(msg);
                            const msgDate = formatDate(msg.createdAt);
                            const showDate = msgDate !== lastDate;
                            if (showDate) lastDate = msgDate;
                            return (
                                <div key={msg._id || index}>
                                    {showDate && <div className="text-center my-3"><span className="bg-white border rounded-pill px-3 py-1 small text-muted shadow-sm" style={{ fontSize: "0.72rem" }}>{msgDate}</span></div>}
                                    <div className={`d-flex ${mine ? "justify-content-end" : "justify-content-start"} mb-1`}>
                                        {!mine && <div className="bg-success bg-opacity-10 text-success border rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2 align-self-end" style={{ width: "28px", height: "28px", fontSize: "0.7rem", fontWeight: 700 }}>S</div>}
                                        <div className={`position-relative px-3 py-2 shadow-sm ${mine ? "bg-success text-white" : "bg-white border"}`} style={{ maxWidth: "72%", borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px" }}>
                                            <div style={{ fontSize: "0.92rem", lineHeight: 1.45, wordBreak: "break-word" }}>{msg.message}</div>
                                            <div className={`d-flex align-items-center gap-1 mt-1 ${mine ? "justify-content-end" : "justify-content-start"}`} style={{ fontSize: "0.68rem", opacity: mine ? 0.85 : 0.65 }}>
                                                <span>{formatTime(msg.createdAt)}</span>{mine && <i className="bi bi-check2-all" style={{ fontSize: "0.85rem" }}></i>}
                                            </div>
                                        </div>
                                        {mine && <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ms-2 align-self-end" style={{ width: "28px", height: "28px", fontSize: "0.7rem", fontWeight: 700 }}>You</div>}
                                    </div>
                                </div>
                            );
                        })}
                        {typing && <div className="d-flex justify-content-start"><div className="bg-white border rounded-4 px-3 py-2 shadow-sm d-flex align-items-center gap-2"><span className="bg-success rounded-circle" style={{ width: "6px", height: "6px" }}></span><small className="text-muted fst-italic">Student is typing</small><span className="d-flex gap-1 ms-1"><span className="bg-secondary rounded-circle" style={{ width: "4px", height: "4px", animation: "bounce 1s infinite" }}></span><span className="bg-secondary rounded-circle" style={{ width: "4px", height: "4px", animation: "bounce 1s infinite 0.2s" }}></span><span className="bg-secondary rounded-circle" style={{ width: "4px", height: "4px", animation: "bounce 1s infinite 0.4s" }}></span></span></div></div>}
                        <div ref={messagesEndRef}></div>
                    </div>
                </div>
                <div className="bg-white border-top p-2 p-md-3 flex-shrink-0">
                    <form onSubmit={sendMessage} className="d-flex align-items-end gap-2">
                        <button type="button" className="btn btn-light border rounded-circle d-none d-md-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px" }} title="Attach"><i className="bi bi-paperclip"></i></button>
                        <div className="flex-grow-1 position-relative">
                            <input type="text" className="form-control rounded-pill ps-4 pe-5" placeholder="Type a message..." value={message} onChange={handleTyping} disabled={sending} style={{ height: "44px", background: "#f8fafc", borderColor: "#e2e8f0", paddingRight: "44px" }} />
                            <button type="button" className="btn btn-light border-0 position-absolute top-50 end-0 translate-middle-y me-1 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "transparent" }} title="Emoji"><i className="bi bi-emoji-smile text-muted"></i></button>
                        </div>
                        <button type="submit" className="btn btn-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px" }} disabled={sending || !message.trim()}>{sending ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-send-fill"></i>}</button>
                    </form>
                    <div className="text-center mt-2 d-none d-md-block"><small className="text-muted" style={{ fontSize: "0.7rem" }}><i className="bi bi-shield-check me-1"></i>End-to-end encrypted • Messages are private</small></div>
                </div>
            </div>
            <style>{`@keyframes bounce { 0%,80%,100% { transform: translateY(0); opacity: 0.5; } 40% { transform: translateY(-4px); opacity: 1; } }`}</style>
        </div>
    );
}
export default Conversation;
