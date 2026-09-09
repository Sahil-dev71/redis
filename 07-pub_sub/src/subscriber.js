import Redis from "ioredis";
const URL = process.env.REDIS_URI || "redis://localhost:6379";

const subscriber =new Redis(URL);
subscriber.subscribe("notification",(err)=>{
    if(err){
        console.log("There is an error in notification : ",err);
    return ;
    }
    console.log("Notification is sent successfully");
})

subscriber.on("message",(channel,message)=>{
    console.log("The channel is : ",channel," : ",message);
})