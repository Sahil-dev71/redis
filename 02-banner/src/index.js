import express, { response } from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const BANNER_KEY = "app:banner";

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URI || "redis://localhost:6379";
const redis = new Redis(REDIS_URL);

app.post("/banner",async(req,res)=>{
    await redis.set(BANNER_KEY,req.body.message || "Request has not message");
    res.json({success: true}); 
})

app.get("/banner",async(req,res)=>{
    const message = await redis.get(BANNER_KEY);
    res.json({message: message});
})

app.get("/banner/exists",async(req,res)=>{
    const message = await redis.exists(BANNER_KEY);
    res.json({message: message});
})

app.delete("/banner",async(req,res)=>{
   const reply = await redis.del(BANNER_KEY);
    res.json({message: reply});
})

app.listen(PORT,()=>{
    console.log("Server is running on PORT : ",PORT);
})
