import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import userRoutes from "./routes/userRoute.js";

// __dirname fix for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 8800;

// ✅ Proper CORS setup
const corsOptions = {
  origin: (origin, callback) => {
    // Allow localhost origins
    if (origin === "http://localhost:5173" || origin === "http://localhost:3000") {
      callback(null, true);
      return;
    }
    
    // In production, allow specific domains
    if (process.env.NODE_ENV === "production") {
      // Allow your production website
      if (origin === "https://tan-aardvark-644850.hostingersite.com") {
        callback(null, true);
        return;
      }
      
      // Allow Android app (null origin for Android WebView)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      callback(new Error("Not allowed by CORS"));
      return;
    }
    
    // For development, allow all origins (but this should be changed in production)
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ handles preflight

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", routes);
app.use("/api/users", userRoutes);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });