const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).send("Please Login!");
        }

        const decodedObj = jwt.verify(token, process.env.JWT_SECRET || "Spark@123");

        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).send("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("ERROR: " + err.message);
    }
};

module.exports = {
    userAuth,
};
