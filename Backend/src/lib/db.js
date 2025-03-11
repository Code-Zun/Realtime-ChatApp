import mongoose from "mongoose"; 

export const connectDB = async () => {
    try { 
        const conn = await mongoose.connect(process.env.MONGODB_URI); 
        console.log("MongoDB Connection successfull"); 
    } catch (error){
        console.log("MongoDB Conn Fail", error); 
    }
}