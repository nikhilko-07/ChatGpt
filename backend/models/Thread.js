import mongoose, {Mongoose} from 'mongoose';

const MessageSchema = new mongoose.Schema({
    role:{
        type: String,
        enum:["user", "assistant"],
        required:true,
    },
    content:{
        type: String,
        required:true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
})

const ThreadSchema = new mongoose.Schema({
    threadId:{
        type: String,
        required: true,
        unique: true,
    },
    title:{
        type: String,
        default:"New Chat"
    },
    messages:[MessageSchema],
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    }
})

const Thread = mongoose.model('Thread',ThreadSchema);
export default Thread;

// export default Mongoose.model('Thread', ThreadSchema);