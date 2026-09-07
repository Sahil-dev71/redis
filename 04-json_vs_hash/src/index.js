import express from "express";
import Redis from "ioredis";

const URL = process.env.REDIS_URI || "redis://localhost:6379";
const PORT = process.env.PORT || "3000";

const app = express();
const redis = new Redis(URL);
app.use(express.json());

function jsonKey(key){
    return `user:${key}:json`;
}
function hashKey(key){
    return `user:${key}:hash`;
}

app.post("/user/:id/json",async(req,res)=>{
    const id  = req.params.id;
    const status = await redis.set(jsonKey(id),JSON.stringify(req.body));
    console.log(status);
    res.json({success: true,method: "json"});
})

app.get("/user/:id/json",async (req,res) => {
    const id  = req.params.id;
    const user =  await redis.get(jsonKey(id));
    if(!user){
        return res.json({message : "user is not found"}).status(404);
    }
    res.json({User: JSON.parse(user)});
})

app.post("/user/:id/hash",async (req,res) => {
    const id =req.params.id;
    const data  = req.body;
    await redis.hset(hashKey(id),data);
    res.json({message : "user data is stored in hash",method: "hash"});
})

app.get("/user/:id/hash/all",async (req,res) => {
    const id = req.params.id;
    const user = await redis.hgetall(hashKey(id));
    res.json({user: user,way : "hgetall"});
})

app.get("/user/:id/hash",async (req,res) => {
    const id =req.params.id;
    const user = await redis.hget(hashKey(id),"name");
    res.json({user: user, way : "hget"})
})

app.listen(PORT,()=>{
    console.log("server is up and running on PORT : ",PORT);
})