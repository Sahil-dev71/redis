import Redis from "ioredis";
import express from "express";

const PORT = process.env.PORT || "3000";
const URL = process.env.REDIS_URI || "redis://localhost:6379";

const app = express();
const leaderboard = new Redis(URL);
const KEY = "ludo:scoreboard";

app.use(express.json());


app.post("/ludo/:user/like",async (req,res) => {
    const user = req.params.user;
    const profile = req.body.profile;

    const isUserExists = await leaderboard.zscore(KEY,user);
    if(!isUserExists){
        console.log("you are not a member of game.");
        return res.json({message : "user is not a participant"});
    }
    const response = await leaderboard.zincrby(KEY,1,profile);
    res.json({message: "User Profile is liked",response});
    
}) // an existing can like the profile of a user 
app.post("/ludo/:user/score",async (req,res) => {
    const user = req.params.user;
    const score = req.body.score || 1 ;
    const response = await leaderboard.zincrby(KEY,score,user);
    res.json({message: "user score has been updated",response});
})  // score of an user is incremented

app.get("/ludo/leaderboard/score",async (req,res) => {
    const top_performers = await leaderboard.zrevrange(KEY,0,10,"WITHSCORES");
    if(!top_performers){
        console.log("there is no one in game.");
        res.json({message: "No Participants till now"});
        return;
    }
    res.json({message: "Top Performers",top_performers});
}) //top 10 users are returned

app.get("/ludo/:user/rank",async (req,res) => {
    const user = req.params.user;
    const rank = await leaderboard.zrevrank(KEY,user);
    if(!rank){
        console.log("user is not participated yet.");
        res.json({message: "user doesn't exists"});
        return;
    }
    res.json({message: "The rank of user",rank});
})  // returns the rank of the user in leaderboard

app.listen(PORT,()=>{
    console.log("server is up and running on PORt : ",PORT);
})