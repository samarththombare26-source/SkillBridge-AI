import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import NotFound from "./pages/Error/NotFound";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import CareerRoadmaps from "./pages/CareerRoadmaps";
import CareerRoadmapDetails from "./pages/CareerRoadmapDetails";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/Student/StudentDashboard";
import CourseLearning from "./pages/Student/CourseLearning";
import Internships from "./pages/Student/Internships";
import InternshipDetails from "./pages/Student/InternshipDetails";
import MyApplications from "./pages/Student/MyApplications";
import ResumeBuilder from "./pages/Student/ResumeBuilder";
import ResumePreview from "./pages/Student/ResumePreview";
import FindMentors from "./pages/Student/FindMentors";
import MentorDetails from "./pages/Student/MentorDetails";
import MentorRequest from "./pages/Student/MentorRequest";
import MyMentorRequests from "./pages/Student/MyMentorRequests";
import MyMentors from "./pages/Student/MyMentors";
import StudentConversation from "./pages/Student/Conversation";
import CareerRecommendation from "./pages/Student/CareerRecommendation";
import Certificates from "./pages/Student/Certificates";
import SkillQuiz from "./pages/Student/SkillQuiz";
import SavedItems from "./pages/Student/SavedItems";
import ResumeAnalyzer from "./pages/Student/ResumeAnalyzer";

import MentorLayout from "./layouts/MentorLayout";
import MentorDashboard from "./pages/Mentor/MentorDashboard";
import MentorProfile from "./pages/Mentor/MentorProfile";
import MentorRequests from "./pages/Mentor/MentorRequests";
import MyStudents from "./pages/Mentor/MyStudents";
import MentorConversation from "./pages/Mentor/Conversation";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCourse from "./pages/Admin/CreateCourse";
import CreateLesson from "./pages/Admin/CreateLesson";
import ManageCourses from "./pages/Admin/ManageCourses";
import ManageLessons from "./pages/Admin/ManageLessons";
import ManageUsers from "./pages/Admin/ManageUsers";
import CreateCareerRoadmap from "./pages/Admin/CreateCareerRoadmap";
import CreateInternship from "./pages/Admin/CreateInternship";

import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/career-roadmaps" element={<ProtectedRoute><CareerRoadmaps /></ProtectedRoute>} />

            <Route path="/career-roadmaps/:roadmapId" element={<ProtectedRoute><CareerRoadmapDetails /></ProtectedRoute>} />

            <Route path="/recruiter" element={<ProtectedRoute allow={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* ==============================
                STUDENT ROUTES
                (students only)
            ============================== */}

            <Route path="/student" element={<ProtectedRoute allow={["student"]}><StudentLayout /></ProtectedRoute>}>
                <Route index element={<StudentDashboard />} />
                <Route path="course/:courseId" element={<CourseLearning />} />
                <Route path="internships" element={<Internships />} />
                <Route path="internship/:internshipId" element={<InternshipDetails />} />
                <Route path="my-applications" element={<MyApplications />} />
                <Route path="resume-builder" element={<ResumeBuilder />} />
                <Route path="resume-preview" element={<ResumePreview />} />
                <Route path="mentors" element={<FindMentors />} />
                <Route path="mentor/:mentorId" element={<MentorDetails />} />
                <Route path="mentor/:mentorId/request" element={<MentorRequest />} />
                <Route path="mentor-requests" element={<MyMentorRequests />} />
                <Route path="my-mentors" element={<MyMentors />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="skill-quiz" element={<SkillQuiz />} />
                <Route path="saved" element={<SavedItems />} />
                <Route path="resume-analyze" element={<ResumeAnalyzer />} />
                <Route path="conversation/:conversationId" element={<StudentConversation />} />
                <Route path="career-recommendation" element={<CareerRecommendation />} />
            </Route>

            {/* ==============================
                MENTOR ROUTES
                (mentors only)
            ============================== */}

            <Route path="/mentor" element={<ProtectedRoute allow={["mentor"]}><MentorLayout /></ProtectedRoute>}>
                <Route index element={<MentorDashboard />} />
                <Route path="profile" element={<MentorProfile />} />
                <Route path="requests" element={<MentorRequests />} />
                <Route path="my-students" element={<MyStudents />} />
                <Route path="conversation/:conversationId" element={<MentorConversation />} />
            </Route>

            {/* ==============================
                ADMIN ROUTES
                (admins only)
            ============================== */}

            <Route path="/admin" element={<ProtectedRoute allow={["admin"]}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="create-course" element={<CreateCourse />} />
                <Route path="create-lesson" element={<CreateLesson />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="lessons" element={<ManageLessons />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="create-roadmap" element={<CreateCareerRoadmap />} />
                <Route path="create-internship" element={<CreateInternship />} />
            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default App;
