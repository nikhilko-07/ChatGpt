import express  from "express";
import Thread from "../models/Thread.js"
import getOpenAIAPIResponse from "../utils/openai.js";
const router = express.Router();

router.post("/test",async (req,res)=>{
    try {
        const thread = new Thread({
            threadId:"xyz",
            title:"Testing thread",
        })
        const response = await thread.save();
        res.json(response);
    }catch(err) {
        res.status(404).json({error:"Error at test function"});
    }
});

router.get("/thread", async (req,res)=>{

    try {

        const thread = await Thread.find({}).sort({updatedAt:-1});
        if(!thread){
            return res.status(401).json({error:"No thread found with this id"});
        }
        res.json(thread); //get the thread in descending order;
    }catch (err){
        res.status(404).json({error:"Error at fetching thread"});
    }
});

router.get("/thread/:threadId", async (req,res)=>{
   const {threadId} = req.params;
   try {
       const thread = await Thread.findOne({threadId});
       if (!thread) {
           res.status(404).json({error:"Thread not found"});
       }
       return res.json(thread.messages);
   }catch(err){
       res.status(404).json({error:"Error at fetching specified thread"});
   }
});

router.delete("/thread/:threadId", async (req,res)=>{
    const {threadId} = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if (!deletedThread) {
            res.status(404).json({error:"Thread not found"});
        }
        res.status(200).json({success: "Thread deleted successfully"});
    }catch (err){
        res.status(404).json({error:"Error at deleting thread"});
    }
});


router.post("/chat", async (req,res)=>{
    const {threadId, message} = req.body;

    if(!message || !threadId){
        res.status(404).json({error:"missing required fields"});
    }
    try {

        let thread = await Thread.findOne({threadId});

        if (!thread) {
            //Create new Thread
             thread = new Thread({
                threadId,
                title: message,
                messages:[{role: "user", content: message}]
            })
        }else{
            thread.messages.push({role:"user", content: message});
        }
        const assistanceReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role:"assistant", content: assistanceReply});
        thread.updatedAt = Date.now();

        await thread.save();
        res.json({reply : assistanceReply});
    }catch(err){
        console.log(err)
        res.status(404).json({error:"Error at posting chat"});
    }
})

export default router;