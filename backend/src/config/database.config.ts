import mongoose from "mongoose";
import { ENV_VARS } from "../config/env.config";
import { logger } from "../utils/logger";

const connectDatabase=async()=>{
    try {
        await mongoose.connect(ENV_VARS.MONGO_URI);
        logger.info(`Connected to MongoDB Database successfully `)
    } catch (error) {
        logger.error(`Error while connecting to MongoDB Database`,error);
        process.exit(1);
    }
}

const disconnectDatabase=async()=>{
    try {
        await mongoose.disconnect();
        logger.info(`Disconnected from MongoDB Database successfully`);
    } catch (error) {
        logger.error(`Error while disconnecting from MongoDB Database`,error);
        process.exit(1);
    }
}

export {connectDatabase,disconnectDatabase};