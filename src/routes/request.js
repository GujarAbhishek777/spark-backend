const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendRequestHandler = async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res
                .status(400)
                .json({ message: "Invalid status type: " + status });
        }

        if (fromUserId.toString() === toUserId.toString()) {
            return res
                .status(400)
                .json({ message: "Cannot send connection request to yourself!" });
        }

        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res
                .status(400)
                .json({ message: "Invalid user ID format: " + toUserId });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingConnectionRequest) {
            return res
                .status(400)
                .json({ message: "Connection Request Already Exists!!" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message:
                req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
    } catch (err) {
        res.status(400).json({ message: "ERROR: " + err.message });
    }
};

// Accept both POST and GET requests for send request endpoint
requestRouter.post("/request/send/:status/:toUserId", userAuth, sendRequestHandler);
requestRouter.get("/request/send/:status/:toUserId", userAuth, sendRequestHandler);

const reviewRequestHandler = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed!" });
        }

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: "Invalid connection request ID!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if (!connectionRequest) {
            return res
                .status(404)
                .json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({ message: "Connection request " + status, data });
    } catch (err) {
        res.status(400).json({ message: "ERROR: " + err.message });
    }
};

// Accept both POST and GET requests for review request endpoint
requestRouter.post("/request/review/:status/:requestId", userAuth, reviewRequestHandler);
requestRouter.get("/request/review/:status/:requestId", userAuth, reviewRequestHandler);

module.exports = requestRouter;
