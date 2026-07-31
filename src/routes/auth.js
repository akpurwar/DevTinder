const express = require("express");
const User = require('../models/user');
const bcrypt = require("bcrypt");
const {validateSignup }= require('../utils/validation');

 const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

    try {
        const { password, firstName, lastName, email } = req.body;

        validateSignup(req);

        const passwordhash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordhash
        })
        await user.save();
        res.send("saved data success")
    } catch (err) {
        console.error("Data not saved ", err.message)
        res.status(400).send("Error: " + err.message)
    }

})

authRouter.post("/login" , async (req, res) => {
    try{
    const {email , password} = req.body;

    const user = await User.findOne({email : email})

    if(!user){
        res.send("invalid credential")
    }

    const passwordmatch = await user.validatePassword(password);
    console.log(passwordmatch)
    if(!passwordmatch) {
        res.send("invalid credentials")
    }else {

        const token = await user.getJWT();

        res.cookie("token",token , {expires : new Date(Date.now() + 8 *3600000)}); //{httpOnly:true}
        res.send("Sucess login")
       
    }
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }





})


authRouter.post("/logout", async(req ,res)=> {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });

    res.send("logout sucess");
})

module.exports = authRouter;