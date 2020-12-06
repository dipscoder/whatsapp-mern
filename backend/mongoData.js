import mongoose from "mongoose"

const whatsappSchema = new mongoose.Schema({
    
    channelName : String,
    conversation : [
        {
            message : String,
            timestamp : String,
            user: {
                displayName : String,
                email: String,
                photo: String,
                uid:String,
                received : Boolean,
            }
            
        }
    ]
    
})

export default mongoose.model('conversations', whatsappSchema)