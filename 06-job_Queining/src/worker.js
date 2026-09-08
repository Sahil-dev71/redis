import {connection} from  "./queue.js";
import { Worker } from "bullmq";

const worker = new Worker("emails",
    async(job)=>{
        console.log("email processing ... ", job.id,job.name,job.data);
        await new Promise((resolve)=>setTimeout(resolve,10000));
        console.log("email processing is completed",job.id,job.name,job.data);
    },
    {connection}
);

worker.on("failed",(job,error)=>{
    console.log("email is not sent bruhhh",job.id,job.name,job.data,error);
})

worker.on("completed",(job)=>{
    console.log("email is completely processed ",job.id,job.name,job.data);
})