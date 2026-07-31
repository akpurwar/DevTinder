
const express = require("express");
const {userAuth}  = require('../middleware/auth');
const { validateEditProfile } = require("../utils/validation");
const user = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile" ,userAuth, async(req,res)=> {
    try{
    const user = req.user;
    res.send(user);
    }catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

profileRouter.patch("/profile/edit" ,userAuth, async(req,res)=> {
    try{
 
       if(!validateEditProfile(req)){

         throw new Error("Unallowed values are getting updated");
         
       } 
    const loggedinuser = req.user;

    Object.keys(req.body).forEach((field)=>(loggedinuser[field] = req.body[field]));


    await loggedinuser.save();

    res.json({
        "message": `${loggedinuser.firstName} edit sucessfully`,
        data : loggedinuser
    })

    }catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

profileRouter.post("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).send("Both passwords required");

    const user = req.user; // set by userAuth
    const ok = await user.validatePassword(currentPassword);
    if (!ok) return res.status(401).send("Current password invalid");

    user.password = await require("bcrypt").hash(newPassword, 10);
    await user.save();
    res.send("Password changed");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});



module.exports = profileRouter;