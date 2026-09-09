import express from "express";
import Redis from "ioredis";

const URL = process.env.REDIS_URI || "redis://localhost:6379";
const PORT = process.env.PORT || "3000";

const app = express();
app.use(express.json());

const publisher = new Redis(URL);

app.post("/notifications",async(req,res)=>{
    const payload = {
        message : req.body.message || "Default message",
        from : req.body.from || "Default user"
    }

    const job = await publisher.publish("notification",JSON.stringify(payload));
    res.json({status: "success",job});
})

app.listen(PORT,()=>{
    console.log("Server is up and running on PORT : ",PORT);
})