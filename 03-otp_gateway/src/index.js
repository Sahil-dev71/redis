import express from "express"
import Redis from "ioredis"

const REDIS_URL = process.env.REDIS_URI || "redis://localhost:6379";
const PORT = process.env.PORT || "3000";

const app = express();
const redis = new Redis(REDIS_URL);

app.use(express.json());

function otpKey(phone){
    return `otp:${phone}`;
}


app.post("/otp",async(req,res)=>{
    const {phone} = req.body;
    const otp = Math.floor(100000+Math.random()*900000).toString();

    await redis.set(otpKey(phone),otp,"EX",60);
    res.json({message: true,otp});
});

app.post("/otp/verify", async(req,res)=>{
    const {phone,otp} = req.body;
    const savedOTP = await redis.get(otpKey(phone));

    if(!savedOTP){
        return res.json({message: "otp is expired"});
    }

    if(savedOTP!==otp){
        return res.json({
            message: "otp is incorrect",
        })
    }
    res.json({
        message: "otp is successfully verified",
    })
})

app.get("/otp/:phone/ttl",async (req,res) => {
    const {phone} = req.params;
    const  ttl = await redis.ttl(otpKey(phone));
    res.json({ttl});
})

app.listen(PORT,()=>{
    console.log("sever is up and running on PORT : ",PORT);
})