import express from "express";
import Redis from "ioredis";

const URL = process.env.REDIS_URI || "redis://localhost:6379";
const PORT = process.env.PORT || "3000";

const app = express();
app.use(express.json());
const redis = new Redis(URL);
const QUEUE_KEY = "user:email";

app.post("/emails",async (req,res) => {
    const job = {
        "to" : req.body.to || "default@dafault.com",
        "subject" : req.body.subject || "Nohting is in the request",
        "body" : req.body.body || "Body is empty",
        "createdAt" : new Date().toISOString(),
    }
    const status = await redis.lpush(QUEUE_KEY,JSON.stringify(job));
    res.json({message: "email is sent",status});
})

app.get("/emails",async(req,res)=>{
    const job = await redis.rpop(QUEUE_KEY);
    if(!job){
        return res.json({message : "Queue is empty"});
    }
    const parsedJob = JSON.parse(job);
    res.json({status: "sent",parsedJob});
})

app.listen(PORT,()=>{
    console.log("Server is up and Runing on PORT : ",PORT);
})