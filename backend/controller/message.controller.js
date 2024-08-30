const Conversation = require("../models/conversation.model") ; 

const sendMessage = async (req, res) => {
    console.log("req.body-->",req.body)

    try {
        const {message} = req.body
        const {id: receiverId} = req.params.userId ; 
        const senderId = req.user.id ; 
        console.log("senderId-->",senderId)
        console.log("receiverId-->",receiverId) 
        console.log("message-->",message)
        // find a conversation between the two user 
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId , receiverId]},
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId , receiverId]
            })
        }

        const newMessage = new Message({
            senderId , 
            receiverId,
            message
        })
        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
    res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sending message controller : ", error.message) ; 
        res.status(500).json({error:"Internal server error "}) ; 
    }
}

module.exports = { sendMessage };