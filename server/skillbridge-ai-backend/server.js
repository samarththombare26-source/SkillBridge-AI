const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");
const careerRoadmapRoutes = require("./routes/careerRoadmapRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const internshipApplicationRoutes = require("./routes/internshipApplicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const careerRoutes = require("./routes/careerRoutes");
const aiRoutes = require("./routes/aiRoutes");


// ==========================================
// ENVIRONMENT
// ==========================================

dotenv.config();

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// HTTP SERVER
// ==========================================

const server = http.createServer(app);

// ==========================================
// SOCKET.IO
// ==========================================

const rawClientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = [
  ...rawClientUrl.split(",").map((s) => s.trim()),
  "http://localhost:5173",
  "http://localhost:3000",
  "https://skill-bridge-ai-ten-ivory.vercel.app",
  "https://skill-bridge-ai-st.vercel.app",
].filter(Boolean);
const uniqueOrigins = [...new Set(allowedOrigins)];

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        if (uniqueOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(null, true); // allow all for now to prevent viva block - restrict later if needed
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

const io = new Server(server, {
    cors: corsOptions
});

// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on("connection", (socket) => {

    console.log(
        "Socket connected:",
        socket.id
    );

    // ======================================
    // JOIN CONVERSATION
    // ======================================

    socket.on(
        "joinConversation",
        (conversationId) => {

            socket.join(
                `conversation_${conversationId}`
            );

            console.log(
                `Socket ${socket.id} joined conversation ${conversationId}`
            );

        }
    );

    // ======================================
    // SEND MESSAGE (real-time broadcast)
    // ======================================

    socket.on("sendMessage", (message) => {

        const conversationId =
            message.conversation?._id ||
            message.conversation ||
            message.conversationId;

        if (conversationId) {
            io.to(`conversation_${conversationId}`).emit(
                "receiveMessage",
                message
            );
        } else {
            socket.broadcast.emit("receiveMessage", message);
        }

        console.log(`Message in ${conversationId} from ${socket.id}`);
    });

    // ======================================
    // TYPING INDICATOR
    // ======================================

    socket.on("typing", (conversationId) => {
        socket.to(`conversation_${conversationId}`).emit("typing", conversationId);
    });

    socket.on("stopTyping", (conversationId) => {
        socket.to(`conversation_${conversationId}`).emit("stopTyping", conversationId);
    });

    // ======================================
    // LEAVE CONVERSATION
    // ======================================

    socket.on(
        "leaveConversation",
        (conversationId) => {

            socket.leave(
                `conversation_${conversationId}`
            );

            console.log(
                `Socket ${socket.id} left conversation ${conversationId}`
            );

        }
    );

    // ======================================
    // DISCONNECT
    // ======================================

    socket.on("disconnect", () => {

        console.log(
            "Socket disconnected:",
            socket.id
        );

    });

});

// ==========================================
// MAKE IO AVAILABLE IN CONTROLLERS
// ==========================================

app.set("io", io);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors(corsOptions));

app.use(express.json());

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// ROUTES
// ==========================================

// Lessons
app.use(
    "/api/lessons",
    lessonRoutes
);

// Progress
app.use(
    "/api/progress",
    progressRoutes
);

// Career Roadmaps
app.use(
    "/api/career-roadmaps",
    careerRoadmapRoutes
);

// Internships
app.use(
    "/api/internships",
    internshipRoutes
);

// Internship Applications
app.use(
    "/api/internship-applications",
    internshipApplicationRoutes
);

// Resumes
app.use(
    "/api/resumes",
    resumeRoutes
);

// Mentor
app.use(
    "/api/mentor",
    mentorRoutes
);

// Conversations
app.use(
    "/api/conversations",
    conversationRoutes
);

// Messages
app.use(
    "/api/messages",
    messageRoutes
);

// Authentication
app.use(
    "/api",
    authRoutes
);

// Users
app.use(
    "/api",
    userRoutes
);

// Courses
app.use(
    "/api/courses",
    courseRoutes
);

// Enrollments
app.use(
    "/api/enrollments",
    enrollmentRoutes
);

// Quizzes
app.use(
    "/api/quizzes",
    quizRoutes
);

// Admin Users
app.use(
    "/api/users",
    adminRoutes
);

// Notifications
app.use(
    "/api/notifications",
    notificationRoutes
);

app.use("/api/career", careerRoutes);
app.use("/api/ai", aiRoutes);

// ==========================================
// TEST API
// ==========================================

app.get("/", (req, res) => {

    res.send(
        "SkillBridgeAI Backend Running..."
    );

});

// ==========================================
// TEMPORARY SAMPLE LESSONS
// ==========================================

app.get(
    "/api/create-sample-lessons",
    async (req, res) => {

        try {

            const Lesson =
                require("./models/Lesson");

            const courseId =
                "6a76eb854829f71a3779eb25";

            const existingLessons =
                await Lesson.countDocuments({
                    course: courseId
                });

            if (existingLessons > 0) {

                return res.json({

                    message:
                        "Lessons already exist",

                    count:
                        existingLessons

                });

            }

            const lessons =
                await Lesson.insertMany([

                    {
                        course: courseId,

                        title:
                            "HTML Basics",

                        description:
                            "Learn the fundamentals of HTML.",

                        content:
                            "Learn HTML tags, headings, paragraphs, links, images and forms.",

                        order: 1,

                        duration:
                            "45 Minutes"
                    },

                    {
                        course: courseId,

                        title:
                            "CSS Fundamentals",

                        description:
                            "Learn the fundamentals of CSS.",

                        content:
                            "Learn CSS selectors, properties, box model, Flexbox and responsive design.",

                        order: 2,

                        duration:
                            "50 Minutes"
                    },

                    {
                        course: courseId,

                        title:
                            "JavaScript Basics",

                        description:
                            "Learn the fundamentals of JavaScript.",

                        content:
                            "Learn variables, functions, arrays, objects and basic JavaScript concepts.",

                        order: 3,

                        duration:
                            "60 Minutes"
                    },

                    {
                        course: courseId,

                        title:
                            "React Introduction",

                        description:
                            "Learn the basics of React.",

                        content:
                            "Learn components, props, state, hooks and basic React application structure.",

                        order: 4,

                        duration:
                            "60 Minutes"
                    },

                    {
                        course: courseId,

                        title:
                            "Node.js Introduction",

                        description:
                            "Learn the basics of Node.js.",

                        content:
                            "Learn Node.js, Express, APIs and backend development basics.",

                        order: 5,

                        duration:
                            "60 Minutes"
                    }

                ]);

            res.json({

                message:
                    "Sample lessons created successfully",

                lessons

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Failed to create lessons",

                error:
                    error.message

            });

        }

    }
);

// ==========================================
// START SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            "Socket.IO server ready"
        );

    }
);