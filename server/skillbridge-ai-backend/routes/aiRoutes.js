const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { analyzeResumeAI } = require("../services/aiService");

// POST /api/ai/resume-analyze  { resumeText, targetRole }
router.post("/resume-analyze", verifyToken, async (req, res) => {
    try {
        const { resumeText, targetRole } = req.body;
        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ message: "Resume text too short. Provide at least 50 characters." });
        }
        const result = await analyzeResumeAI({ resumeText, targetRole: targetRole || "Software Developer" });
        res.status(200).json({ message: result.isTrueAI ? "Analyzed by Gemini AI" : "Analyzed (fallback)", ...result });
    } catch (err) {
        res.status(500).json({ message: "Failed to analyze resume", error: err.message });
    }
});

module.exports = router;
