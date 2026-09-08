import express from  "express";
import {emailQueue} from "./queue.js";


const app = express();
const PORT = process.env.PORT ||"3000";
app.use(express.json());

app.post("/send-email",async(req,res)=>{
    const job = await emailQueue.add("first-email",{
        to : req.body.to || "sahil@sahil.com",
        subject : req.body.subject || "There is no subject is provided by user",
        body: req.body.content || "there is no content in email body"
    },{
        attempts : 3,
        backoff: {
            type: "exponential",
            delay : 1000,
        }
    });

res.json({message : "email is queued",jobId : job.id});
})

app.listen(PORT,()=>{
    console.log("Server is up and running on PORT : ",PORT);
})