import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api",chatRoutes);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    connectDB();
})
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log("MongoDB Connected");
    }catch(err) {
        console.log("Error at mongodb connect", err);
    }
}



// const client = new OpenAI({
//     apiKey: process.env.OPENAPIKEY,
// });
//
// const response = await client.responses.create({
//     model: 'gpt-4o-mini',
//     input: 'Joke related to Computer Science',
// });
//
// console.log(response.output_text);