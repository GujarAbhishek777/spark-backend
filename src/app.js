const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

// require("./utils/cronjob");

app.use(
    cors({
        origin: [
            "https://spark.scalewithabhi.in",
            "https://sparkv1.scalewithabhi.in",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        optionsSuccessStatus: 200,
    })
);
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
// const paymentRouter = require("./routes/payment");
// const initializeSocket = require("./utils/socket");
// const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/api", authRouter);

app.use("/", profileRouter);
app.use("/api", profileRouter);

app.use("/", requestRouter);
app.use("/api", requestRouter);

app.use("/", userRouter);
app.use("/api", userRouter);
// app.use("/", paymentRouter);
// app.use("/", chatRouter);

const server = http.createServer(app);
// initializeSocket(server);

connectDB()
    .then(() => {
        console.log("Database connection established...");
        server.listen(process.env.PORT, () => {
            console.log("Server is successfully listening on port 3000...");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected!!");
    });
