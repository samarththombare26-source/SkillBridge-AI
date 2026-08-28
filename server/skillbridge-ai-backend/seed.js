require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Course = require("./models/Course");
const Lesson = require("./models/Lesson");
const Internship = require("./models/Internship");
const CareerRoadmap = require("./models/CareerRoadmap");
const User = require("./models/User");
const Mentor = require("./models/Mentor");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.log("❌ MONGO_URI not found in .env");
    process.exit(1);
}

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected for seeding");

        // Clear existing (optional - comment out to keep existing)
        // await Course.deleteMany({});
        // await Lesson.deleteMany({});
        // await Internship.deleteMany({});
        // await CareerRoadmap.deleteMany({});

        const existingCourses = await Course.countDocuments();
        if (existingCourses >= 8) {
            console.log(`ℹ️  ${existingCourses} courses already exist, skipping course seeding (delete manually to reseed)`);
        } else {
            console.log("🌱 Seeding 10 Courses...");
            const coursesData = [
                { title: "Full Stack Web Development", description: "Master MERN stack - MongoDB, Express, React, Node.js from scratch to deployment.", category: "Web Development", instructor: "Rahul Sharma", duration: "12 Weeks", level: "Beginner" },
                { title: "Data Science with Python", description: "Learn Python, Pandas, NumPy, Matplotlib and build real data science projects.", category: "Data Science", instructor: "Priya Verma", duration: "10 Weeks", level: "Intermediate" },
                { title: "Machine Learning Fundamentals", description: "Complete ML course covering supervised, unsupervised learning and neural networks.", category: "AI/ML", instructor: "Amit Patel", duration: "14 Weeks", level: "Advanced" },
                { title: "UI/UX Design Mastery", description: "Learn Figma, Adobe XD, user research and create stunning portfolio projects.", category: "Design", instructor: "Sneha Kulkarni", duration: "8 Weeks", level: "Beginner" },
                { title: "Java Backend with Spring Boot", description: "Build enterprise-grade REST APIs with Java, Spring Boot and MySQL.", category: "Backend", instructor: "Vikram Singh", duration: "10 Weeks", level: "Intermediate" },
                { title: "React Native Mobile Development", description: "Build cross-platform mobile apps with React Native and Expo.", category: "Mobile Development", instructor: "Anjali Desai", duration: "9 Weeks", level: "Intermediate" },
                { title: "Cyber Security Essentials", description: "Learn ethical hacking, network security, and penetration testing fundamentals.", category: "Cyber Security", instructor: "Karan Mehta", duration: "12 Weeks", level: "Advanced" },
                { title: "DevOps with AWS & Docker", description: "Master Docker, Kubernetes, CI/CD and deploy on AWS like a pro.", category: "DevOps", instructor: "Rohan Joshi", duration: "10 Weeks", level: "Advanced" },
                { title: "Python Programming Mastery", description: "From basics to advanced Python - OOP, DSA, and automation projects.", category: "Programming", instructor: "Neha Gupta", duration: "8 Weeks", level: "Beginner" },
                { title: "Digital Marketing & SEO", description: "Learn SEO, social media, Google Ads and grow businesses online.", category: "Marketing", instructor: "Pooja Reddy", duration: "6 Weeks", level: "Beginner" }
            ];
            const createdCourses = await Course.insertMany(coursesData);
            console.log(`✅ ${createdCourses.length} courses created`);

            // Seed 3 lessons per course with videos (max 40 min)
            console.log("🌱 Seeding Lessons with videos...");
            const lessonVideos = [
                { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", duration: 12 },
                { url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", duration: 18 },
                { url: "https://www.youtube.com/watch?v=rfscVS0vtbw", duration: 22 }
            ];
            let lessonCount = 0;
            for (let i = 0; i < createdCourses.length; i++) {
                const course = createdCourses[i];
                for (let j = 0; j < 3; j++) {
                    const vid = lessonVideos[j % lessonVideos.length];
                    await Lesson.create({
                        course: course._id,
                        title: `${course.title} - Lesson ${j + 1}`,
                        description: `Deep dive into ${course.title} - Part ${j + 1}`,
                        content: `This lesson covers core concepts of ${course.title}. Watch the video (max 40 min) and complete the quiz to proceed. Content includes hands-on examples and real-world projects.`,
                        order: j + 1,
                        duration: `${15 + j * 10} Minutes`,
                        videoUrl: vid.url,
                        videoDuration: vid.duration
                    });
                    lessonCount++;
                }
            }
            console.log(`✅ ${lessonCount} lessons created with videos`);
        }

        const existingInternships = await Internship.countDocuments();
        if (existingInternships >= 8) {
            console.log(`ℹ️  ${existingInternships} internships already exist, skipping`);
        } else {
            console.log("🌱 Seeding 10 Internships...");
            const internships = [
                { title: "Frontend Developer Intern", company: "Dezycode", description: "Work on frontend projects using React and modern web technologies.", skills: ["HTML", "CSS", "JavaScript", "React"], location: "Pune", duration: "3 Months", stipend: "₹10000 / month", deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "Backend Developer Intern", company: "TechNova", description: "Build scalable APIs with Node.js and Express. Work with real production databases.", skills: ["Node.js", "Express", "MongoDB"], location: "Remote", duration: "6 Months", stipend: "₹15000 / month", deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "Data Analyst Intern", company: "DataCrunch", description: "Analyze large datasets and create dashboards using Python and Tableau.", skills: ["Python", "SQL", "Tableau"], location: "Bangalore", duration: "4 Months", stipend: "₹12000 / month", deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "UI/UX Design Intern", company: "DesignHive", description: "Design user interfaces for web and mobile apps using Figma.", skills: ["Figma", "Adobe XD", "UI/UX"], location: "Mumbai", duration: "3 Months", stipend: "₹8000 / month", deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "Machine Learning Intern", company: "AI Labs", description: "Train ML models and work on computer vision projects.", skills: ["Python", "Machine Learning", "TensorFlow"], location: "Hyderabad", duration: "6 Months", stipend: "₹20000 / month", deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "Cyber Security Intern", company: "SecureNet", description: "Learn penetration testing and vulnerability assessment.", skills: ["Cyber Security", "Networking"], location: "Delhi", duration: "3 Months", stipend: "₹10000 / month", deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "Mobile App Intern", company: "AppBerry", description: "Build cross-platform apps with React Native.", skills: ["React Native", "JavaScript"], location: "Pune", duration: "4 Months", stipend: "₹12000 / month", deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "DevOps Intern", company: "CloudKraft", description: "Work with AWS, Docker and Kubernetes deployments.", skills: ["AWS", "Docker", "Kubernetes"], location: "Remote", duration: "6 Months", stipend: "₹18000 / month", deadline: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "Digital Marketing Intern", company: "MarketMinds", description: "Run campaigns on Google Ads and social media.", skills: ["SEO", "Google Ads", "Social Media"], location: "Bangalore", duration: "3 Months", stipend: "₹7000 / month", deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" },
                { title: "Java Developer Intern", company: "CodeCraft", description: "Develop enterprise applications with Java and Spring Boot.", skills: ["Java", "Spring Boot", "MySQL"], location: "Chennai", duration: "5 Months", stipend: "₹14000 / month", deadline: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000), type: "Internship", status: "Open" }
            ];
            await Internship.insertMany(internships);
            console.log("✅ 10 internships created");
        }

        const existingRoadmaps = await CareerRoadmap.countDocuments();
        if (existingRoadmaps >= 8) {
            console.log(`ℹ️  ${existingRoadmaps} roadmaps already exist, skipping`);
        } else {
            console.log("🌱 Seeding 10 Career Roadmaps...");
            const roadmaps = [
                { title: "Frontend Developer Roadmap", description: "Become a frontend expert with HTML, CSS, JS and React.", category: "Web Development", skills: ["HTML", "CSS", "JavaScript", "React"], level: "Beginner", steps: [{ title: "Learn HTML & CSS", description: "Master layouts and styling", duration: "2 weeks" }, { title: "JavaScript Fundamentals", description: "DOM, ES6, async", duration: "3 weeks" }, { title: "React Mastery", description: "Components, hooks, state", duration: "4 weeks" }], resources: ["MDN", "React Docs"] },
                { title: "Backend Developer Roadmap", description: "Master server-side development.", category: "Backend", skills: ["Node.js", "Express", "MongoDB"], level: "Intermediate", steps: [{ title: "Node.js Basics", description: "Event loop and modules", duration: "2 weeks" }, { title: "Express & APIs", description: "RESTful services", duration: "3 weeks" }, { title: "Database Design", description: "MongoDB and SQL", duration: "3 weeks" }], resources: ["Node Docs"] },
                { title: "Data Scientist Roadmap", description: "From statistics to ML deployment.", category: "Data Science", skills: ["Python", "Pandas", "ML"], level: "Intermediate", steps: [{ title: "Python for Data", description: "NumPy, Pandas", duration: "3 weeks" }, { title: "Machine Learning", description: "Supervised models", duration: "4 weeks" }, { title: "Deployment", description: "Model serving", duration: "2 weeks" }], resources: ["Kaggle"] },
                { title: "UI/UX Designer Roadmap", description: "Design beautiful user experiences.", category: "Design", skills: ["Figma", "UI/UX", "Research"], level: "Beginner", steps: [{ title: "Design Principles", description: "Color, typography", duration: "2 weeks" }, { title: "Figma Mastery", description: "Prototyping", duration: "3 weeks" }, { title: "Portfolio", description: "Case studies", duration: "2 weeks" }], resources: ["Figma Community"] },
                { title: "Mobile Developer Roadmap", description: "Build apps for iOS and Android.", category: "Mobile Development", skills: ["React Native", "Flutter"], level: "Intermediate", steps: [{ title: "React Native Basics", description: "Components", duration: "3 weeks" }, { title: "State Management", description: "Redux", duration: "2 weeks" }, { title: "Publishing", description: "Play Store", duration: "1 week" }], resources: ["Expo Docs"] },
                { title: "DevOps Engineer Roadmap", description: "Automate and scale infrastructure.", category: "DevOps", skills: ["Docker", "AWS", "Kubernetes"], level: "Advanced", steps: [{ title: "Linux & Networking", description: "Basics", duration: "2 weeks" }, { title: "Docker & K8s", description: "Containers", duration: "4 weeks" }, { title: "CI/CD on AWS", description: "Pipelines", duration: "3 weeks" }], resources: ["AWS Docs"] },
                { title: "Cyber Security Roadmap", description: "Protect systems from threats.", category: "Cyber Security", skills: ["Networking", "Ethical Hacking"], level: "Advanced", steps: [{ title: "Network Fundamentals", description: "OSI, TCP/IP", duration: "3 weeks" }, { title: "Ethical Hacking", description: "Tools", duration: "4 weeks" }, { title: "Certification", description: "CEH prep", duration: "3 weeks" }], resources: ["TryHackMe"] },
                { title: "AI Engineer Roadmap", description: "Build intelligent systems.", category: "AI/ML", skills: ["Python", "Deep Learning", "NLP"], level: "Advanced", steps: [{ title: "Python & Math", description: "Linear algebra", duration: "3 weeks" }, { title: "Deep Learning", description: "Neural nets", duration: "4 weeks" }, { title: "NLP Projects", description: "Chatbots", duration: "3 weeks" }], resources: ["DeepLearning.AI"] },
                { title: "Java Full Stack Roadmap", description: "Enterprise Java development.", category: "Backend", skills: ["Java", "Spring Boot", "React"], level: "Intermediate", steps: [{ title: "Core Java", description: "OOP", duration: "3 weeks" }, { title: "Spring Boot", description: "REST APIs", duration: "3 weeks" }, { title: "React Frontend", description: "Integration", duration: "3 weeks" }], resources: ["Java Docs"] },
                { title: "Digital Marketing Roadmap", description: "Grow brands online.", category: "Marketing", skills: ["SEO", "Ads", "Analytics"], level: "Beginner", steps: [{ title: "SEO Fundamentals", description: "On-page/off-page", duration: "2 weeks" }, { title: "Paid Ads", description: "Google/FB", duration: "2 weeks" }, { title: "Analytics", description: "GA4", duration: "2 weeks" }], resources: ["Google Skillshop"] }
            ];
            await CareerRoadmap.insertMany(roadmaps);
            console.log("✅ 10 career roadmaps created");
        }

        // Seed 5 mentor users + profiles
        const mentorCount = await User.countDocuments({ role: "mentor" });
        if (mentorCount >= 5) {
            console.log(`ℹ️  ${mentorCount} mentors already exist, skipping`);
        } else {
            console.log("🌱 Seeding 5 Mentors...");
            const mentorsData = [
                { name: "Rahul Sharma", email: "rahul.mentor@demo.com", phone: "9876543210", expertise: "Full Stack Development & AI", experience: "5 Years", bio: "Experienced Full Stack Developer with expertise in React, Node.js, MongoDB, and REST APIs. I enjoy helping students build real-world projects.", linkedin: "https://linkedin.com/in/rahul-sharma", availability: "Available" },
                { name: "Priya Verma", email: "priya.mentor@demo.com", phone: "9876543211", expertise: "Data Science & ML", experience: "7 Years", bio: "Data Scientist at top MNC, passionate about Python and ML. Mentored 100+ students.", linkedin: "https://linkedin.com/in/priya-verma", availability: "Available" },
                { name: "Amit Patel", email: "amit.mentor@demo.com", phone: "9876543212", expertise: "Cyber Security", experience: "6 Years", bio: "Cyber Security Analyst, CEH certified. Love teaching ethical hacking.", linkedin: "https://linkedin.com/in/amit-patel", availability: "Busy" },
                { name: "Sneha Kulkarni", email: "sneha.mentor@demo.com", phone: "9876543213", expertise: "UI/UX Design", experience: "4 Years", bio: "UI/UX Designer with award-winning portfolios. Help students craft beautiful designs.", linkedin: "https://linkedin.com/in/sneha-kulkarni", availability: "Available" },
                { name: "Vikram Singh", email: "vikram.mentor@demo.com", phone: "9876543214", expertise: "Java & Spring Boot", experience: "8 Years", bio: "Java Architect, built scalable systems for Fortune 500.", linkedin: "https://linkedin.com/in/vikram-singh", availability: "Available" }
            ];
            for (const m of mentorsData) {
                let user = await User.findOne({ email: m.email });
                if (!user) {
                    const hashed = await bcrypt.hash("demo123", 10);
                    user = await User.create({ name: m.name, email: m.email, phone: m.phone, password: hashed, role: "mentor" });
                }
                const existingMentor = await Mentor.findOne({ user: user._id });
                if (!existingMentor) {
                    await Mentor.create({ user: user._id, name: m.name, email: m.email, expertise: m.expertise, experience: m.experience, bio: m.bio, linkedin: m.linkedin, availability: m.availability });
                }
            }
            console.log("✅ 5 mentors created (password: demo123)");
        }

        console.log("\n🎉 Seeding complete! All features now have 8-10 items.");
        console.log("👉 Admin: shindepayal123@gmail.com / payal@1234");
        console.log("👉 Mentors: rahul.mentor@demo.com / demo123 (and 4 more)");
        await mongoose.connection.close();
        process.exit(0);

    } catch (err) {
        console.error("❌ Seeding failed:", err);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seed();
