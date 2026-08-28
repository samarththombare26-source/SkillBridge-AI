const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User API
const registerUser = async (req, res) => {

    try {

       const {
    fullName,
    email,
    mobile,
    password,
    role
} = req.body;


        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        // Create new user
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
    name: fullName,
    email,
    phone: mobile,
    password: hashedPassword,
    role
});

        // Save user in MongoDB
        await newUser.save();


        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const loginUser = async (req, res) => {
    try {

        // Accept email OR mobile (identifier)
        const identifier = (req.body.identifier || req.body.email || req.body.mobile || req.body.phone || "").trim();
        const { password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message: "Email/Mobile and password are required"
            });
        }

        // Find user by email or phone
        const isEmail = identifier.includes("@");
        const user = isEmail
            ? await User.findOne({ email: identifier })
            : await User.findOne({ phone: identifier });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Login successful
       res.status(200).json({
    message: "Login successful",
    token,
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const updateProfile = async (req, res) => {

    try {

        const { name, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(

            req.user.id,

            {
                name,
                phone
            },

            {
                new: true
            }

        ).select("-password");

        res.json({

            message: "Profile updated successfully",

            user: updatedUser

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// Get all users - Admin
const getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

            console.log("ALL USERS FROM DATABASE:", users);

        res.status(200).json({
            message: "Users fetched successfully",
            users
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};
  
 // Update user - Admin
const updateUser = async (req, res) => {

    try {

        const { id } = req.params;
        const { name, phone, role } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        if (role !== undefined) {
            user.role = role;
        }

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};


// Delete user - Admin
const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prevent admin from deleting their own account
        if (req.user.id === id) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};


// Change user role - Admin
const changeUserRole = async (req, res) => {

    try {

        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                message: "Role is required"
            });
        }

        const allowedRoles = [
            "student",
            "Student",
            "recruiter",
            "Recruiter",
            "admin"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        if (req.user.id === id) {
            return res.status(400).json({
                message: "You cannot change your own admin role"
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User role updated successfully",
            user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};

// In-memory OTP store: identifier -> { otp, expiresAt, verified }
const otpStore = new Map();

// Helper: find user by email or phone
const findUserByIdentifier = async (identifier) => {
    const clean = identifier.trim();
    const isEmail = clean.includes("@");
    if (isEmail) {
        return await User.findOne({ email: clean });
    }
    return await User.findOne({ phone: clean });
};

// Forgot Password - send REAL OTP to email via Nodemailer
const forgotPassword = async (req, res) => {
    try {
        const identifier = (req.body.identifier || req.body.email || req.body.phone || req.body.mobile || "").trim();

        if (!identifier) {
            return res.status(400).json({ message: "Email or mobile number is required" });
        }

        const user = await findUserByIdentifier(identifier);

        if (!user) {
            return res.status(404).json({ message: "No account found with this email or mobile number" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        otpStore.set(identifier, { otp, expiresAt, verified: false });
        // Also store by email key so verification works regardless of identifier format
        otpStore.set(user.email, { otp, expiresAt, verified: false });
        if (user.phone) otpStore.set(user.phone, { otp, expiresAt, verified: false });

        const maskedEmail = user.email.replace(/(.{2}).+(@.+)/, "$1***$2");

        // Send REAL email via Nodemailer (or simulated Ethereal if placeholder)
        const { sendOtpEmail } = require("../utils/emailService");
        let emailResult;
        try {
            emailResult = await sendOtpEmail(user.email, otp, user.name);
        } catch (emailErr) {
            console.error("Email send error:", emailErr.message);
            return res.status(500).json({
                message: emailErr.message
            });
        }

        console.log(`🔐 OTP ${otp} sent to ${maskedEmail} (valid 10 min) | ${emailResult.simulated ? "SIMULATED" : "REAL EMAIL"}`);

        if (emailResult.simulated) {
            // Development mode - return OTP and preview URL so you can test without real SMTP
            return res.status(200).json({
                message: `OTP sent! (Development mode - no real SMTP configured) Check server console for OTP. For real email, configure Gmail App Password in .env`,
                maskedEmail: maskedEmail,
                otp: otp,
                previewUrl: emailResult.previewUrl || null,
                isSimulated: true
            });
        }

        res.status(200).json({
            message: `OTP sent to your registered email (${maskedEmail}) - check inbox and spam folder`,
            maskedEmail: maskedEmail,
            isSimulated: false
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const identifier = (req.body.identifier || req.body.email || req.body.phone || req.body.mobile || "").trim();
        const { otp } = req.body;

        if (!identifier || !otp) {
            return res.status(400).json({ message: "Email/Mobile and OTP are required" });
        }

        const record = otpStore.get(identifier);

        if (!record) {
            return res.status(400).json({ message: "No OTP found. Please request a new code." });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(identifier);
            return res.status(400).json({ message: "OTP has expired. Please request a new code." });
        }

        if (record.otp !== otp.toString().trim()) {
            return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
        }

        record.verified = true;
        otpStore.set(identifier, record);

        res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const identifier = (req.body.identifier || req.body.email || req.body.phone || req.body.mobile || "").trim();
        const { otp, newPassword, confirmPassword } = req.body;

        if (!identifier || !otp || !newPassword) {
            return res.status(400).json({ message: "Email/Mobile, OTP and new password are required" });
        }

        if (confirmPassword && newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const record = otpStore.get(identifier);

        if (!record || !record.verified) {
            return res.status(400).json({ message: "Please verify OTP first" });
        }

        if (record.otp !== otp.toString().trim()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(identifier);
            return res.status(400).json({ message: "OTP has expired. Please request a new code." });
        }

        const user = await findUserByIdentifier(identifier);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        otpStore.delete(identifier);

        console.log(`✅ Password reset successful for ${identifier}`);

        res.status(200).json({ message: "Password reset successful. You can now login with your new password." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser, loginUser, getProfile, updateProfile, getAllUsers, updateUser, deleteUser, changeUserRole,
    forgotPassword, verifyOtp, resetPassword
};