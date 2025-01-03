import mongoose from "mongoose";

type  ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
    //check if already connected
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }
    try {
        //log the connection string for debugging
        console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);
        // connect to MongoDB
        const db=await mongoose.connect(process.env.MONGODB_URI || "",{
            //remove deprecated options (no longer needed in Mongoose 6+)
            //useNewUrlParser: true, //edited
            //useUnifiedTopology:true, //edited
        });

        //log the connection details
        console.log("MongoDB connection details:", db);
        //console.log(db) //uncomment this
        
        connection.isConnected=db.connections[0].readyState;
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed",error);
        process.exit(1)
    }
}

export default dbConnect;