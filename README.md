SkillBridgeAI — AI-Powered Career Intelligence Platform
Industrial Training Project (DezyKode IT Solutions, Kharadi, Pune)
Duration: 02/06/2026 – 22/08/2026 | Government Polytechnic Awasari (Kh), Dept. of Information Technology (MSBTE K-Scheme, 315004)
Live Demo: https://ai-ten-ivory.vercel.app (Vercel) | Backend: Render | Mentor: Mr. Ranjeet Hinge / Mr. Pranav Shelke

React Vite Node Express MongoDB Socket.IO

A role-based, AI-augmented SaaS platform that helps students become industry-ready through personalized career guidance, skill-gap analysis, ATS-friendly resume building, internship discovery & application, real-time mentor chat, and curated career roadmaps — in one integrated product.

Students, Recruiters, Mentors and Admins collaborate in a single ecosystem, instead of juggling 4-5 disconnected portals.

Table of Contents
Problem Statement
Solution Overview
Key Features
Technology Stack
Architecture
Project Structure
Screenshots
Getting Started
Environment Variables
Running Locally
API Documentation
Database Design
Authentication & Roles
Examples
Deployment
Troubleshooting & QA
Roadmap
Contributing
References
Acknowledgement
Problem Statement
docs/Problem_Statement.md:1

Students face fragmented career preparation:

No personalized guidance, generic roadmaps
Skill mismatch vs industry expectations, no gap analysis
Poor resume quality, low ATS scores
Difficulty discovering relevant internships, no tracking
Lack of accessible mentor support
Using multiple websites for resume, courses, internships, chat
No centralized platform for Students / Recruiters / Mentors / Admins
SkillBridgeAI solves this by converging AI career intelligence + resume + internships + mentoring + roadmaps into one responsive product (320px → 1440px).

Solution Overview
docs/Project_Overview.md:5

SkillBridgeAI is an AI-powered Career Intelligence Platform that helps students become industry-ready by providing personalized career guidance, AI-based skill gap analysis, internship opportunities, mentor support, resume building, and career roadmaps through a single integrated platform.

Core philosophy:
Role-based access + AI augmentation + real-time collaboration. Unlike standalone job boards, SkillBridgeAI couples Gemini-powered recommendations, ATS analyzer, Socket.io chat, and admin governance so a student can go from skill assessment → roadmap → course → resume → internship → mentor without leaving the app.

Training context: Built during 12-week implant training at DezyKode (Akurdi/Kharadi, Pune) under full-stack MERN track, mirroring Agile sprints (UI → Backend → DB → Testing).

Key Features
docs/Features.md:1 | cilent/src/App.jsx:1

Student (/student/*)
Register / Login (JWT, bcrypt) – role student
Dashboard – progress cards, saved internships, mentor connections 02_Student_Dashboard_Rohit_Suryawanshi.png
Resume Builder + ATS Analyzer (/student/resume-builder, /resume-analyze, /resume-preview) – personal info, education, skills, projects
AI Career Recommendation (/student/career-recommendation) – Gemini prompt → role / skills / roadmap
Skill Quiz & Certificates (/student/skill-quiz, /certificates)
Internships: Search grid (/student/internships), Detail (/student/internship/:id), My Applications (/my-applications) with pending/selected/rejected
Mentors: Find (/student/mentors), Details, Send Request (/mentor/:id/request), My Mentors, My Requests
Real-time Chat (/student/conversation/:id) – Socket.io joinConversation, sendMessage, typing
Courses & Lessons: Enroll, track progress (/student/course/:courseId), Career Roadmaps (/career-roadmaps)
Saved Items, Help & Support
Mentor (/mentor/*)
Dashboard – assigned students, pending requests 05_Mentor_Dashboard_Rahul_Sharma.png
Requests (/mentor/requests) – accept / reject
My Students (/mentor/my-students) – Rohit Connected example
Profile, Conversation (Socket.io)
Recruiter (/recruiter)
Post internship (title, company, stipend, duration, skills, openings)
View applicants per internship, shortlist
Admin (/admin/*)
Dashboard analytics (users, courses, internships) 06_Admin_Dashboard_Samarth_Thombare.png
Manage Users (table, role change, delete) 16_Admin_Manage_Users_Table.png
Manage Courses / Lessons (cards, CRUD) 17-18
Create Course / Lesson / Career Roadmap / Internship / Quiz
Governance, notifications
Cross-cutting: ProtectedRoute by role, responsive Bootstrap layout (Hero, Features, dashboards), global search, notification bell, JWT in axiosInstance.

Technology Stack
Layer	Tech	Version	Purpose
Frontend	React + React DOM	19.2.7	SPA, components, hooks
Build	Vite	8.1.1	HMR, build (~1.6s)
Routing	React Router DOM	7.18.1	ProtectedRole routing cilent/src/App.jsx:1
UI	Bootstrap 5.3.8 + bootstrap-icons + react-icons	—	Responsive grid, cards
HTTP	Axios 1.18.1	—	cilent/src/api/axiosInstance.js with JWT interceptor
Realtime	socket.io-client 4.8.3	—	Chat, typing indicators
Lint	Oxlint 1.71	—	npm run lint
Backend	Node.js 20 + Express 5.2.1	—	REST APIs, middleware
DB	MongoDB + Mongoose 9.9.1 + MySQL2 3.23 (dual)	—	Users, Internships, etc. server/skillbridge-ai-backend/models/*
Auth	jsonwebtoken 9.0.3 + bcrypt/bcryptjs 6.0	—	Hash, JWT 7d expiry
Realtime	Socket.IO 4.8.3	—	server.js:56
Email	Nodemailer 9.0.5 + Gmail SMTP	—	Forgot-password OTP
Config	dotenv 17.4.2 + cors 2.8.6	—	Env, CORS CLIENT_URL
Dev	Nodemon 3.1.14	—	npm run dev
Deploy	Vercel (frontend), Render (backend)	—	vercel.json:2
Version control: Git / GitHub (DezyKode org), IDE: VS Code, API test: Postman, DB tools: MongoDB Compass/Atlas.

Architecture
[ Browser – React 19 + Vite + Bootstrap ]
        ↕ Axios (JWT)  ↕ Socket.io-client
[ Express 5 – REST + Socket.IO server.js:2 ]
        ↕ Mongoose 9 / mysql2
[ MongoDB Atlas – Users, Internships, Courses, Lessons, Conversations, Messages, Resumes, Quizzes, CareerRoadmaps ]
        ↕ Gemini API (GEMINI_API_KEY) – AI career & ATS
        ↕ Nodemailer (SMTP) – OTP

Flow example – Internship apply (Internships.jsx → InternshipDetails.jsx → MyApplications.jsx):

Student browses /api/internships (GET) → grid
Applies POST /api/internship-applications {internshipId} with Bearer token
Backend creates InternshipApplication (status: pending), recruiter sees applicants GET /api/internship-applications?internshipId=...
Realtime chat server.js:68-159:

Client socket.emit('joinConversation', id) → server socket.join('conversation_'+id)
sendMessage → io.to('conversation_'+id).emit('receiveMessage', msg)
Typing indicators typing / stopTyping broadcast
Project Structure
SkillBridgeAI_new/
├── cilent/                     # Frontend (note: folder named 'cilent')
│   ├── src/
│   │   ├── api/axiosInstance.js
│   │   ├── assets/ (hero.png, icons, videos)
│   │   ├── components/ (about, hero, features, navbar, footer, Dashboard, MentorDashboard, forms, cards)
│   │   ├── layouts/ (MainLayout, StudentLayout, MentorLayout, AdminLayout)
│   │   ├── pages/ (Home, Login, Register, ForgotPassword, Profile, Student/*, Mentor/*, Admin/*, Recruiter)
│   │   ├── routes/ ProtectedRoute.jsx
│   │   ├── context/, hooks/, services/, utils/, styles/
│   │   ├── App.jsx             # All routes, role guards
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── server/skillbridge-ai-backend/
│   ├── config/db.js            # mongoose.connect(MONGO_URI)
│   ├── controllers/ (auth, user, internship, mentor, message, resume, quiz, ...)
│   ├── routes/ (authRoutes, internshipRoutes, mentorRoutes, ... 17 files)
│   ├── models/ (User, Internship, InternshipApplication, Conversation, Message, Course, Lesson, Resume, CareerRoadmap, ...)
│   ├── middleware/authMiddleware, adminMiddleware
│   ├── services/, validators/, utils/
│   ├── seed.js
│   ├── server.js               # Express + Socket.IO, all /api routes
│   └── package.json
├── docs/
│   ├── Project_Overview.md
│   ├── Problem_Statement.md
│   ├── Features.md
│   ├── Pictures/ 01-18 screenshots
│   ├── images/ (duplicate)
│   └── Industrial_Training_Report_SkillBridgeAI_Dezycode.docx
├── Industrial_Training_Report_SkillBridgeAI_Dezycode_K-Scheme.docx  # Full report (760 paras, 11 images)
├── vercel.json                 # buildCommand: cd cilent && npm run build
└── README.md

See cilent/src/pages/Student/ (16 student routes), server/skillbridge-ai-backend/models/ (15 models), server/.../routes/ (17 route files) for complete inventory.

Screenshots
docs/Pictures/ (18) – responsive 320–1440px, Bootstrap cards:

#	Screen	File	Description
1	Landing Hero	01_Landing_Page_Hero_Build_Your_Career_with_AI.png	Hero + Features + CTA
2	Student Dashboard	02_Student_Dashboard_Rohit_Suryawanshi.png	Progress, internships, mentors
3	Create Account	03_Create_Account_Rahul_Sharma.png	Register with role
4	Sign In	04_Sign_In_Quick_Demo_Fill.png	Login + demo fill
5	Mentor Dashboard	05_Mentor_Dashboard_Rahul_Sharma.png	Assigned students
6	Admin Dashboard	06_Admin_Dashboard_Samarth_Thombare.png	Analytics
7	Resume Builder	07_Resume_Builder_Personal_Information.png	Personal info
8	Internship Detail	08_Internship_Detail_Machine_Learning_Intern.png	ML intern apply
9	Opportunities Grid	09_Internship_Opportunities_Grid.png	Filtered cards
10	My Applications	10_My_Internship_Applications_Pending.png	Pending status
11-12	Chat	11-12_Mentor_Conversation_Chat_Interface*.png	Socket.io chat
13	Certificate	13_Certificate_Preview_Machine_Learning_Fundamentals.png	After quiz
14	AI Recommendation	14_AI_Career_Recommendation_Form.png	Gemini form
15	My Students	15_My_Students_Rohit_Connected.png	Mentor view
16-18	Admin Manage	16-18_Admin_Manage_*	Users / Lessons / Courses tables
All figures captioned in Chapter 8 of the industrial report (Figure 8.1–8.10).

Getting Started
Prerequisites
Node.js 18+ and npm
MongoDB (local mongodb://127.0.0.1:27017 or Atlas SRV URI)
Git
Clone
git clone https://github.com/your-org/SkillBridgeAI_new.git
Set-Location SkillBridgeAI_new

Environment Variables
Create server/skillbridge-ai-backend/.env (see server/skillbridge-ai-backend/.env:1):

MONGO_URI=mongodb://127.0.0.1:27017/skillbridgeai
PORT=5000
JWT_SECRET=skillbridgeai_secret_key_2026
GEMINI_API_KEY=your_gemini_api_key_here   # https://aistudio.google.com/app/apikey
GEMINI_MODEL=gemini-1.5-flash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=thombaresamarth06@gmail.com
SMTP_PASS=djby hstw nzar jiyl  # Gmail App Password (no spaces)
FROM_EMAIL=thombaresamarth06@gmail.com
CLIENT_URL=http://localhost:5173

Create cilent/.env (cilent/.env.example:1):

VITE_API_URL=http://localhost:5000/api

For production set CLIENT_URL to deployed frontend (e.g., https://ai-ten-ivory.vercel.app) and VITE_API_URL to Render backend.

Running Locally
Backend

Set-Location server\skillbridge-ai-backend
npm install
npm run dev   # nodemon server.js → http://localhost:5000 , Socket.IO ready
# health: GET http://localhost:5000/ → "SkillBridgeAI Backend Running..."

Frontend

Set-Location ..\..\cilent
npm install
npm run dev   # Vite → http://localhost:5173
npm run build # production dist → cilent/dist
npm run preview

Seed sample lessons (optional): GET http://localhost:5000/api/create-sample-lessons

API Documentation
Base: http://localhost:5000/api – all routes in server.js:192-289. Auth via Authorization: Bearer <JWT>.

Method	Endpoint	Auth	Description
POST	/api/register	—	Register (student/recruiter)
POST	/api/login	—	Login → JWT
POST	/api/forgot-password	—	Send OTP via Nodemailer
GET/PUT	/api/users/me, /api/profile	JWT	Profile CRUD
GET	/api/courses, /api/lessons, /api/enrollments	JWT	Courses, lessons, enrollments
GET/POST	/api/internships	JWT (POST=recruiter)	List / create
GET	/api/internships/:id	JWT	Detail
POST	/api/internship-applications	student	Apply
GET	/api/internship-applications?internshipId=	recruiter	Applicants
GET/POST	/api/mentor, /api/mentor/requests, /my-students	JWT	Mentor discovery & requests
GET/POST	/api/conversations, /api/messages	JWT	Chat threads
POST	/api/resumes, /api/career, /api/ai	JWT	Resume, career maps, Gemini
GET	/api/career-roadmaps, /api/quizzes, /api/progress, /api/notifications	JWT	Learning
GET	/api/users (adminRoutes)	admin	Manage users
GET	/	—	Health
Example cURL is in Examples.

Database Design
server/skillbridge-ai-backend/models/ – Mongoose schemas (also MySQL2 for legacy):

User – name, email (unique), password (bcrypt), role enum[student, mentor, recruiter, admin], avatar, bio
Internship – title, company, location, stipend, duration, skills[], openings, postedBy (User), applicants[]
InternshipApplication – student (User), internship (Internship), status[pending, selected, rejected], appliedAt
Course / Lesson / Enrollment / Progress / Quiz – course catalog, ordered lessons, video/content, enrollment mapping, progress %
Mentor / MentorRequest – mentor profile, student request status
Conversation / Message – participants[User], messages with conversation ref, text, timestamps, read flag
Resume / CareerRecommendation / CareerRoadmap / Notification – builder data, Gemini output, roadmap steps, notification type
MySQL2 (mysql2:3.23) is retained for industrial training compliance (MSBTE MySQL module) alongside MongoDB.

Authentication & Roles
Password hashed with bcrypt (server.js:authRoutes), JWT signed with JWT_SECRET (7d).
authMiddleware verifies Bearer token, attaches req.user.
ProtectedRoute.jsx – allow={[student]} guard; redirects to /login if unauthenticated / wrong role.
Admin middleware checks user.role === 'admin'.
Forgot password: OTP via SMTP_HOST=smtp.gmail.com (App Password), verified before reset.
Examples
1. Register (Student)
Invoke-RestMethod -Uri http://localhost:5000/api/register -Method POST -ContentType "application/json" -Body '{
  "name":"Rahul Sharma","email":"rahul@example.com","password":"Test@123","role":"student"
}'
# → { token, user: { _id, name, email, role } }

2. Login & Call Protected API (Axios)
// cilent/src/api/axiosInstance.js
import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

// Login.jsx
const { data } = await api.post('/login', { email, password })
localStorage.setItem('token', data.token)

// Fetch internships (Internships.jsx)
const { data: internships } = await api.get('/internships')

3. Apply for Internship
await api.post('/internship-applications', { internshipId: '68f...' })
// MyApplications.jsx polls GET /internship-applications

4. Real-time Mentor Chat (Socket.IO)
// Student Conversation.jsx
import { io } from 'socket.io-client'
const socket = io(import.meta.env.VITE_API_URL.replace('/api',''))
socket.emit('joinConversation', conversationId)
socket.on('receiveMessage', msg => setMessages(m => [...m, msg]))
socket.emit('sendMessage', { conversation: conversationId, text })
socket.emit('typing', conversationId)

// server.js:98-115 broadcasts to room `conversation_${conversationId}`

5. AI Career Recommendation (Gemini)
await api.post('/ai/career-recommend', {
  skills: ['React','Node'],
  interests: ['AI','Backend']
})
// → { recommendation: "Full-Stack + AI Engineer roadmap...", roadmapId }

6. Resume Analyzer (ATS)
await api.post('/resumes/analyze', { resumeText })
// → { score: 82, missing: ["Docker"], suggestions: [...] }

Deployment
Frontend – Vercel vercel.json:2:

{ "buildCommand":"cd cilent && npm install && npm run build", "outputDirectory":"cilent/dist" }

Set env VITE_API_URL to Render URL.

Backend – Render / Railway:

npm start # node server.js

Env MONGO_URI (Atlas), JWT_SECRET, GEMINI_API_KEY, SMTP_*, CLIENT_URL.

Manual build check: npm run build in cilent must produce dist/index.html with no Vite errors (validated during training: 1.6s).

Troubleshooting & QA
Issue	Cause	Fix
CORS error	CLIENT_URL mismatch	Set CLIENT_URL=http://localhost:5173 (dev) or Vercel URL (prod) server.js:55
401 on /api/*	Missing Bearer	Ensure axiosInstance adds Authorization
Mongo SRV fail	Wrong MONGO_URI	Use Compass to test URI, config/db.js:8 logs ✅/❌
Socket not connecting	Client URL port	VITE_API_URL without trailing /api for socket io()
Gmail OTP not sent	App Password spaces	Remove spaces SMTP_PASS=djbyhstwnzarjiyl
Word report cannot open	OneDrive lock ~$... / Zone.Identifier	Unblock-File, kill WINWORD, re-save via python-docx
Testing performed: Postman for REST, browser responsive (Chrome DevTools 320–1440), Oxlint, Vite preview.

Roadmap
[ ] MySQL → full migration (currently dual)
[ ] Recruiter analytics & applicant shortlist UI polish
[ ] Push notifications (FCM) for Mentor requests
[ ] PWA + offline resume builder
[ ] Unit tests (Vitest) for CourseLearning, SkillQuiz
Contributing
git checkout -b feat/your-feature
npm run lint   # Oxlint must pass
git commit -m "feat: your feature"
git push origin feat/your-feature
# PR against main – include screenshots from docs/Pictures/

References
w3schools, MDN, React Docs, Express Docs, Node Docs, Stack Overflow – Chapter 11 References
Industrial_Training_Report_SkillBridgeAI_Dezycode_K-Scheme.docx (760 paras, 11 figures) – full 12-week report, Chapter 8 screenshots Figure 8.1–8.10
docs/Project_Overview.md, Features.md, Problem_Statement.md
Google Gemini API (aistudio.google.com), MongoDB Atlas, Vercel, Render
Acknowledgement
Industrial training at DezyKode IT Solutions Pvt. Ltd., Kharadi, Pune (City Vista, Office No.08) under Mr. Ranjeet Hinge / Mr. Pranav Shelke (MERN) and Mrs. Kiran Gaikwad (GPA). Gratitude to DezyKode trainers, GPA faculty, family and peers – as detailed in report Abstract and Acknowledgement.

Submitted by: Samarth Sujit Thombare (EN 24210270610) – Submitted to MSBTE, Govt. Polytechnic Awasari (Kh), 2025-26
Generated: Industrial Training Report (315004) – 12 Week Implant Training – SkillBridgeAI
