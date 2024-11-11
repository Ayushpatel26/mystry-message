import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

// db connection
async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected");
        return
    }
     try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {});
        
        connection.isConnected = db.connections[0].readyState;
        console.log("db connected successfully");
        // console.log(db);
        // console.log(db.connections);
        
     } catch (error) {
        console.log(("db connection fails"));
        console.log((error));
        process.exit(1);
        
     }
}

export default dbConnect();