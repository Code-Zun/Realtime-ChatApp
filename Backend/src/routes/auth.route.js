import express from "express";
import {login, logout, signup, updateProfile, checkAuth} from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

//check first if they're authenthicated thru protectRoute, and only then can they update profile, database, etc
router.post("/update-profile", protectRoute, updateProfile); 

//check for auth, called every time page is refreshed, could bring user to profile page / login page depending on outcome
router.get("/check", protectRoute, checkAuth); 

export default router; 