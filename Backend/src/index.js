import express from "express"; 
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"; 
dotenv.config();
import cookieParser from "cookie-parser"; 

//web framework to help build API's

import authRoutes from "./routes/auth.route.js";

const app = express(); 
const PORT = process.env.PORT;

app.use(express.json()); 
app.use(cookieParser()); 

app.use("/api/auth", authRoutes); 

app.listen(PORT, () => { 
    console.log("Server is running on PORT:" + PORT);
    connectDB(); 
}); 