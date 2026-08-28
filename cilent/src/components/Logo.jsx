import { Link } from "react-router-dom";

function Logo({ size = "md", showTagline = false, to = "/" }) {
  const isSmall = size === "sm";
  const iconSize = isSmall ? 32 : 40;
  const textSize = isSmall ? "1.15rem" : "1.4rem";

  return (
    <Link to={to} className="d-flex align-items-center gap-2 text-decoration-none">
      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: isSmall ? "8px" : "10px",
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
        }}
      >
        <svg width={isSmall ? 18 : 22} height={isSmall ? 18 : 22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 18 L6 10 L12 18 L18 10 L22 18" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
          <path d="M6 10 L6 18" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M18 10 L18 18" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M2 18 L22 18" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="12" cy="7" r="2.2" fill="white" />
          <circle cx="12" cy="7" r="1" fill="#2563eb" />
          <path d="M12 5 L13.2 3.8 L12 2.5 L10.8 3.8 Z" fill="white" opacity="0.9" />
        </svg>
      </div>
      <div className="lh-1">
        <div className="d-flex align-items-baseline gap-0" style={{ fontWeight: 800, fontSize: textSize, letterSpacing: "-0.02em", lineHeight: 1 }}>
          <span style={{ color: "#0f172a" }}>SkillBridge</span>
          <span style={{ background: "linear-gradient(90deg, #2563eb, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
        </div>
        {showTagline && <small className="text-muted" style={{ fontSize: isSmall ? "0.62rem" : "0.68rem", letterSpacing: "0.06em", fontWeight: 600, textTransform: "uppercase" }}>AI Career Platform</small>}
      </div>
    </Link>
  );
}

export default Logo;
