import mongoose from "mongoose";
import Config from "../config";

const env = (process.env.ENVIRONMENT || "development") as keyof typeof Config;

mongoose.set("strictQuery", true);

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(Config[env].db);
        console.info("MongoDB Connection Success");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        throw err;
    }
};

export default connectDB;
