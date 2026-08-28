/**
 * SkillBridgeAI - True AI Service (Google Gemini)
 * Uses native fetch (Node 18+), no extra dependencies
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

function getGeminiKey() {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
}

// Fallback keyword logic (kept for when no API key)
function fallbackRecommendations(skills, interests) {
    const recommendations = [];
    const skillText = skills.join(" ").toLowerCase();
    const interestText = interests.join(" ").toLowerCase();

    if (skillText.includes("html") || skillText.includes("css") || skillText.includes("javascript") || skillText.includes("react") || skillText.includes("node")) {
        recommendations.push("Full Stack Web Developer", "Frontend Developer", "Backend Developer");
    }
    if (skillText.includes("python") || skillText.includes("machine learning") || skillText.includes("data") || interestText.includes("ai") || interestText.includes("data")) {
        recommendations.push("Data Analyst", "Machine Learning Engineer", "AI Engineer");
    }
    if (skillText.includes("java") || skillText.includes("spring")) {
        recommendations.push("Java Developer", "Backend Developer");
    }
    if (skillText.includes("security") || skillText.includes("cyber") || interestText.includes("security")) {
        recommendations.push("Cyber Security Analyst", "Security Engineer");
    }
    if (skillText.includes("network") || interestText.includes("networking")) {
        recommendations.push("Network Engineer");
    }
    if (recommendations.length === 0) {
        recommendations.push("Software Developer", "IT Support Specialist", "Technology Consultant");
    }
    return [...new Set(recommendations)];
}

async function generateWithGemini({ skills, interests, education, experience, careerGoal }) {
    const apiKey = getGeminiKey();

    if (!apiKey || apiKey.includes("your_") || apiKey.trim() === "") {
        console.log("GEMINI_API_KEY not configured - using fallback recommendations");
        return {
            recommendations: fallbackRecommendations(skills, interests),
            source: "fallback",
            isTrueAI: false
        };
    }

    const prompt = `You are an expert career counselor for SkillBridgeAI, an AI career platform for Indian students.

Student Profile:
- Skills: ${skills.join(", ")}
- Interests: ${interests.join(", ")}
- Education: ${education}
- Experience: ${experience || "Fresher / No experience"}
- Career Goal: ${careerGoal || "Not specified"}

Task: Recommend 3 to 5 most suitable career roles for this student. Consider current Indian job market (2025-2026), salary, and growth.

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "recommendations": ["Role 1", "Role 2", "Role 3"],
  "details": [
    {
      "title": "Role 1",
      "reason": "1 sentence why this fits the student's skills/interests",
      "skillsToLearn": ["skill1", "skill2"],
      "salaryRangeINR": "e.g. 4-8 LPA",
      "roadmap": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}

Rules:
- recommendations array must have 3-5 role titles (short, e.g. "Frontend Developer")
- details must match each recommendation title
- Keep reason under 25 words, skillsToLearn 2-4 items, roadmap 3 steps
- Be specific to the student's input, not generic
`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1200
                }
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("Gemini API error:", res.status, errText);
            throw new Error(`Gemini API ${res.status}: ${errText.slice(0, 200)}`);
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!text) throw new Error("Empty response from Gemini");

        // Extract JSON (handle markdown code block)
        let jsonStr = text.trim();
        const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/) || jsonStr.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) jsonStr = jsonMatch[1];

        // Find outermost JSON object
        const firstBrace = jsonStr.indexOf("{");
        const lastBrace = jsonStr.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(jsonStr);

        if (!parsed.recommendations || !Array.isArray(parsed.recommendations) || parsed.recommendations.length === 0) {
            throw new Error("Invalid recommendations format from AI");
        }

        console.log(`Gemini AI generated ${parsed.recommendations.length} recommendations (true AI)`);

        return {
            recommendations: parsed.recommendations.slice(0, 5),
            details: parsed.details || [],
            source: "gemini",
            isTrueAI: true,
            raw: parsed
        };

    } catch (err) {
        console.error("Gemini generation failed, falling back:", err.message);
        // Fallback so user still gets results
        return {
            recommendations: fallbackRecommendations(skills, interests),
            source: "fallback",
            isTrueAI: false,
            error: err.message
        };
    }
}

async function generateSkillQuiz({ topic, skills, difficulty = "Intermediate", count = 5 }) {
    const apiKey = getGeminiKey();
    if (!apiKey || apiKey.includes("your_") || apiKey.trim() === "") {
        // Fallback mock quiz
        const mock = [
            { question: `What is the primary use of ${topic || skills?.[0] || "JavaScript"}?`, options: ["Styling", "Logic & Interactivity", "Database", "Deployment"], correctAnswer: "Logic & Interactivity", explanation: "Core language for web interactivity." },
            { question: `Which method adds an element to an array?`, options: ["push()", "pop()", "shift()", "slice()"], correctAnswer: "push()", explanation: "push() appends to array." },
            { question: `What does API stand for?`, options: ["Application Programming Interface", "Automated Program Interaction", "Application Process Integration", "Advanced Programming Instruction"], correctAnswer: "Application Programming Interface", explanation: "API is Application Programming Interface." },
            { question: `Which is NOT a JavaScript framework?`, options: ["React", "Vue", "Django", "Angular"], correctAnswer: "Django", explanation: "Django is Python." },
            { question: `What is the time complexity of binary search?`, options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctAnswer: "O(log n)", explanation: "Binary search is logarithmic." }
        ];
        return { questions: mock.slice(0, count), source: "fallback", isTrueAI: false };
    }

    const prompt = `You are a quiz generator for SkillBridgeAI.
Topic: ${topic || skills?.join(", ") || "General Programming"}
Skills: ${skills?.join(", ") || topic}
Difficulty: ${difficulty}
Generate exactly ${count} multiple-choice questions.

Return ONLY valid JSON (no markdown) in this format:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "One sentence why correct"
    }
  ]
}
Rules: 4 options each, exactly 1 correctAnswer must match one of the options verbatim, explanation under 20 words, questions specific to topic/difficulty, no duplicates.`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 2000 } })
        });
        if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text().then(t=>t.slice(0,200))}`);
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        let jsonStr = text.trim();
        const m = jsonStr.match(/```json\s*([\s\S]*?)\s*```/) || jsonStr.match(/```\s*([\s\S]*?)\s*```/);
        if (m) jsonStr = m[1];
        const first = jsonStr.indexOf("{");
        const last = jsonStr.lastIndexOf("}");
        if (first !== -1) jsonStr = jsonStr.slice(first, last+1);
        const parsed = JSON.parse(jsonStr);
        if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error("Invalid quiz format");
        console.log(`Gemini generated ${parsed.questions.length} quiz questions (true AI)`);
        return { questions: parsed.questions.slice(0, count), source: "gemini", isTrueAI: true };
    } catch (err) {
        console.error("Gemini quiz failed, fallback:", err.message);
        return { questions: (await generateSkillQuiz({ topic: topic || "General", skills: [], difficulty, count: count })).questions || [], source: "fallback", isTrueAI: false, error: err.message };
    }
}

async function analyzeResumeAI({ resumeText, targetRole = "Software Developer" }) {
    const apiKey = getGeminiKey();
    if (!apiKey || apiKey.includes("your_") || apiKey.trim() === "") {
        // Fallback mock analysis
        const score = Math.min(92, 58 + Math.floor(resumeText.length / 40));
        return {
            score, atsScore: score, level: score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work",
            strengths: ["Clear formatting", "Relevant skills listed"],
            weaknesses: ["Add more quantifiable achievements", "Include keywords for ATS"],
            missingKeywords: ["Teamwork", "Communication"],
            suggestions: ["Add metrics: e.g. 'Improved performance by 30%'", "Add 2-3 relevant projects with tech stack"],
            source: "fallback", isTrueAI: false
        };
    }
    const prompt = `You are an ATS resume analyzer for SkillBridgeAI.
Target Role: ${targetRole}
Resume Text:
"""
${resumeText.slice(0, 4000)}
"""
Task: Analyze like a real ATS + hiring manager for Indian job market 2025.
Return ONLY valid JSON (no markdown) in this format:
{
  "score": 78,
  "atsScore": 78,
  "level": "Good",
  "strengths": ["2-3 strengths"],
  "weaknesses": ["2-3 weaknesses"],
  "missingKeywords": ["3-5 important keywords missing for this role"],
  "suggestions": ["3-4 specific actionable improvements"]
}
Rules: score 0-100, level: Excellent >=80, Good >=60 else Needs Work. Be specific to resume content and target role. No extra text.`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6, maxOutputTokens: 1000 } })
        });
        if (!res.ok) throw new Error(`Gemini ${res.status}`);
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        let jsonStr = text.trim();
        const m = jsonStr.match(/```json\s*([\s\S]*?)\s*```/) || jsonStr.match(/```\s*([\s\S]*?)\s*```/);
        if (m) jsonStr = m[1];
        const first = jsonStr.indexOf("{"); const last = jsonStr.lastIndexOf("}");
        if (first !== -1) jsonStr = jsonStr.slice(first, last + 1);
        const parsed = JSON.parse(jsonStr);
        console.log(`Gemini resume analysis score ${parsed.score} (true AI)`);
        return { ...parsed, source: "gemini", isTrueAI: true };
    } catch (err) {
        console.error("Gemini resume analyze failed, fallback:", err.message);
        return { score: 72, atsScore: 72, level: "Good", strengths: ["Relevant skills"], weaknesses: ["Add metrics"], missingKeywords: ["Communication"], suggestions: ["Add projects"], source: "fallback", isTrueAI: false, error: err.message };
    }
}

module.exports = {
    generateWithGemini,
    fallbackRecommendations,
    getGeminiKey,
    generateSkillQuiz,
    analyzeResumeAI
};
