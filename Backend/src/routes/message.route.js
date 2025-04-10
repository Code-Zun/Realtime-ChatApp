import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";


const router = express.Router(); 

//dm sidebar function for users that have messages with current user 
//must only 
router.get("/user", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMessages) //userId to fetch messages

router.post("/send/:id", protectRoute, sendMessage); 

export default router; 

