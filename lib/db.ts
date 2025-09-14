import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); //load the env variables

const MONGODB_URI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
    // check if the MONGODB_URI is not undefined
    if (!MONGODB_URI) {
        console.log("there was error loading MONGODB_URI from the .env folder ");
    }

     // now check if the connection is already established
    if (mongoose.connection.readyState === 1) {
        console.log("mongo db connection already estabilished");
        return;
    }
    if (mongoose.connection.readyState === 2) {
        console.log("connection is in progress...");
    }
    try {
        await mongoose.connect(MONGODB_URI!, {
            dbName: 'TeamBB_DB',
            bufferCommands: true
        });
        console.log("connected to mongo db");
    } catch (error) {
        console.log("error connecting to mongo db", error);
    }   

}

export { connectToDatabase };


