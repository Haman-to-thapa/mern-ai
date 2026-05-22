import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import itineraryRoutes from "./routes/itineraryRoutes";
import shareRoutes from "./routes/shareRoutes";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/share", shareRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ message });
});

const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
