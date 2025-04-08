import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async(req,res) => { 
    const{fullName, email, password} = req.body
    try { 
        if (!fullName || !email || !password){
            return res.status(400).json({message: "All field are required"})
        }
        //create user and hash password use bcrypt.js
        if (password.length < 6){ 
            return res.status(400).json({message: "Password must be at least 6 characters"}); 
        }

        const user = await User.findOne({email})

        if (user) return res.status(400).json({ message: "Email already exists"}); 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User ({
            fullName: fullName, 
            email: email, 
            password: hashedPassword
        })

        if (newUser){ 
            //generate JWT token for further auth  
            generateToken(newUser._id, res)
            await newUser.save(); 

            res.status(201).json({
                _id: newUser._id, 
                fullName: newUser.fullName, 
                email: newUser.email, 
                profilePic: newUser.profilePic, 
            }); 
        } else { 
            res.status(400).json({ message: "Invalid User Data"}); 
        }
    } catch (error){ 
        console.log("Error in signup controller", error.message); 
        res.status(500).json({message: "Internal server error"}); 
    }
};

export const login = async (req,res) => { 
    const { email, password } = req.body; 
    try {
        const user = await User.findOne({email}); 

        if (!user){ 
            res.status(400).json({message: "Invalid Credentials"}); 
        }

        const isCorrectPassword = await bcrypt.compare(user.password, password);

        if (!isCorrectPassword){ 
            res.status(400).json({message: "Invalid Credentials"});
        }

        generateToken(user._id, res); 

        //send back to client
        res.status(200).json({ 
            _id: user._id, 
            fullName: user.fullName, 
            email: user.email,
            profilePic: user.profilePic, 
        }); 
    } catch {
        res.status(500).json({message: "Internal Server Error"})
    }
};

export const logout = (req,res) => { 
    try{ 
        res.cookie("jwt", "", {maxAge : 0}); 
        res.status(200).json({message: "Logged out succesfully"}); 
    } catch (error){ 
        console.log("Error in logout controller", error.message); 
        res.status(500).json({message: "Internal server error"}); 
    }
};