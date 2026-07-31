const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionrequest");
const user = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId" , userAuth, async(req,res)=> {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["interested","ignored"];
        
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"invalid status"+status})
        }


        const toUser =await user.findById(toUserId);
        //can handle touser equal to fromuser to self req
        if(!toUser){
            return  res.status(400).json({message:"invalid user"})
        }


        //if there is an exisiting connection 
        const  exisitingconnectionRequest = await ConnectionRequest.findOne({
            $or:[
           {fromUserId, toUserId},
           {fromUserId:toUserId, toUserId:fromUserId}
            ],
            
        });

        if(exisitingconnectionRequest){
            res.status(400).json({
                message:"connection alreay request exisits "
            })
        }
        const connectionRequest = new ConnectionRequest(
            {
                fromUserId,
                toUserId,
                status
            }
        )

        
        const data= await connectionRequest.save();
        res.json({
            message : "connection request send sucess",
            data
        })
    }catch(err){
        res.status(400).send("Error"+ err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId" , userAuth, async(req,res)=> {
    try {
       const loggeduser = req.user;
       const {requestId, status} = req.params;

       const allowedStatus = ["accepted", "rejected"];
       if(!allowedStatus.includes(status)){
        res.status(400).json({message:"Status not found"});
       }

       const connectionreq = await ConnectionRequest.findOne({
        _id : requestId,
        toUserId: loggeduser._id,
        status:"interested"
       })

       if(!connectionreq){
        res.status(404).json({message:"connection request not found"});
       }
       connectionreq.status = status;

       const data= await connectionreq.save();

       res.json({message:"Connection request"+ status , data})
    }catch(err){
        res.status(400).send("Error"+ err.message)
    }
})

module.exports = requestRouter;