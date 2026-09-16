const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

// require("./utils/cronjob");

const allowedOrigins = [
    "https://spark.scalewithabhi.in",
    "https://sparkv1.scalewithabhi.in",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
];

if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(",").forEach((url) => {
        const trimmed = url.trim().replace(/\/$/, "");
        if (trimmed && !allowedOrigins.includes(trimmed)) {
            allowedOrigins.push(trimmed);
        }
    });
}

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, cURL, Postman)
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/$/, "");
        const isAllowed = allowedOrigins.includes(cleanOrigin) || 
                          allowedOrigins.includes(origin) ||
                          /\.scalewithabhi\.in$/.test(cleanOrigin);

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
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
