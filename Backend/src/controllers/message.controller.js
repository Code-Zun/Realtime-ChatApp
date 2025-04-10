import User from "../models/user.model.js";
import Message from "../models/message.model.js";


export const getUsersForSidebar = async(req,res) => {
    //fetch every single user except ourself in the contact list
    try {
        const loggedInUserId = req.user._id; 
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");
        
        res.status(200).json(filteredUsers); 
    } catch (error) {
        console.error("Error in getUsersForSideBar: ", error.message); 
        res.status(500).json({error: "Internal server error"}); 
    }
}

export const getMessages = async(req,res) => {
    try {
        //grab the dynamic value
        const {id:userToChatId} = req.params
        const myID = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myID, receiverId: userToChatId}, 
                {senderId: userToChatId, receiverId: myID}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages", error.message); 
        res.status(500).json({error: "Internal server error"}); 
    }
}

export const sendMessage = async(req,res) => {
    try {
        const { text,image } = req.body; 
        const { id: receiverID } = req.params; 
        const senderId = req.user._id; 

        let imageURL; 

        if (image){
            //upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image); 
            imageURL = uploadResponse.secure_url; 
        }

        const newMessage = new Message({
            senderId, 
            receiverId, 
            text, 
            image: imageURL, 
        });

        await newMessage.save() //save to db, by passin to client

        //real time functionality here with socket.io

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller", error.message); 
        res.status(500).json({error: "Internal server error"}); 
    }
}