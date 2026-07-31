const express = require("express");
 const User = require('../models/user');
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionrequest");
const user = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user" ,async(req , res)=> {
    try{
     const user =  await User.findOne({ firstName : req.body.firstName});

     if(!user){
        res.send("User not found")

     }else {
        res.send(JSON.parse(JSON.stringify(user)))

     }
    }catch(err){
      res.status(404).send("Something went wrong")
    }
   
})

userRouter.delete("/user" ,async(req , res)=> {
    try{

        const userId = req.body.userId;

       const user =   await findByIdAndDelete(userId);

        res.send("deleted")

  
    }catch(err){
      res.status(404).send("Something went wrong")
    }
   
})


userRouter.get("user/feed" , userAuth,async(req , res)=> {
    try{

      let limit = parseInt(req.query.limit)|| 1;
      let page = parseInt(req.query.page) || 10;
      limit = limit > 50 ? 50 : limit;
      skip = (page-1)*limit;

      const loggedinuser = req.user;

      const connectionRequest = await ConnectionRequest.find({
        $or:[
          {toUserId : loggedinuser._id},
          {fromUserId: loggedinuser._id}
        ]
      }).select({fromUserId,toUserId}).populate("firstName lastName")

      const hiderUsers = new Set();

      connectionRequest.forEach(req => {
        hiderUsers.add(req.fromUserId.toStirng());
        hiderUsers.add(req.toUserId.toStirng());
      });

      const users = User.find({
        $and:[
        {_id: {$nin : Array.from(hiderUsers)}}, 
        {_id :{$ne: loggedinuser._id}}]
    }).skip(skip).limit(limit);
   
      res.send(users);
    }catch(err){
      res.status(404).send("Something went wrong")
    }
   
})


userRouter.get("/user/requests/recieved", userAuth , async(req, res)=> {
  try{
     const loggedinuser = req.user;

     const connectionRequest  = await ConnectionRequest.find({
      toUserId : loggedinuser._id,
      status : "interested"
     }).populate("fromUserId", "firstName lastName");

     res.send(connectionRequest);

    }catch(err){
      res.status(404).send("Something went wrong")
    }

})



userRouter.get("/user/connections", userAuth , async(req, res)=> {
  try{
     const loggedinuser = req.user;

     const connectionRequest  = await ConnectionRequest.find({
      $or: [
        {toUserId:loggedinuser._id , status: "accepted"},
        {fromUserId: loggedinuser._id , status:"accepted"}
      ]
     }).populate("fromUserId", "firstName lastName").populate("toUserId", "firstName" , "lastName")

     const data = connectionRequest.map((item)=> {

       if(item.toUserId._id.toStirng() == loggedinuser._id.toStirng()){
        return item.fromUserId;
       }
       return item.fromUserId;
     })
    

     res.send(data);

    }catch(err){
      res.status(404).send("Something went wrong")
    }

})

module.exports = userRouter;