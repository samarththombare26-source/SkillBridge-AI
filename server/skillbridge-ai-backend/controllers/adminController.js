
const User = require("../models/User");

// Make a user admin
const makeAdmin = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        user.role = "admin";

        await user.save();

        res.status(200).json({
            message: "User is now an admin",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to make user admin",
            error: error.message
        });

    }

};


module.exports = {
    makeAdmin
};

