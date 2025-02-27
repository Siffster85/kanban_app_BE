import express, { NextFunction, Request, Response } from "express";
import tasksRoutes from "./routes/tasksRoute";
import userRoutes from "./routes/userRoute";
import projectRoutes from "./routes/projectRoute";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";
import cors from "cors";

const app = express();

const allowedOrigins = ["https://ylskanban.netlify.app"]; // Array for future expansion if needed

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) { // Allow requests without origin (like Postman)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Custom-Header"],
  }),
);

app.options("*", cors({  // Handle preflight OPTIONS requests for ALL routes (*)
  origin: function (origin, callback) { // Same origin logic as above.
      if (!origin || allowedOrigins.includes(origin)) { 
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Must match your main CORS config
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Custom-Header"], // Must match your main CORS config
}));

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
}));

app.use("/api/tasks", requiresAuth, tasksRoutes);
app.use("/api/projects", requiresAuth, projectRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode= error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;
