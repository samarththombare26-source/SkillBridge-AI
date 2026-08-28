
const express = require("express");

const router = express.Router();

const {
    makeAdmin
} = require("../controllers/adminController");


router.patch(
    "/make-admin/:userId",
    makeAdmin
);


module.exports = router;

