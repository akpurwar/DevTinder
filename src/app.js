const express = require("express");
 const connectDB = require('./config/database');

 const User = require('./models/user')

const app  = express();


app.post("/signup", async(req,res)=> {

    const user = new User( {
        firstName:"akash",
        lastName:"purwar",
        email:"pur@gm.com",
        age:29,
        gender:"male"
    })
   
    try{
        await user.save();
        res.send("saved data sucess")
    }catch(err) {
        console.error("Data not saved ", err.message)
    }

})


connectDB().then(()=> {
    console.log("Data base connected")
    app.listen(8800, () => {
    console.log("server is successfully running on port 8800");
     });
  

}).catch((err)=> {

      console.log("DB connection failed")

})
// const {adminAuth, userAuth} = require("./middleware/auth");

// app.get("/user/login" , (req,res,next)=>{
//     res.send("loggin")
// })

// app.get("/user" , userAuth, (req,res,next)=>{
//     res.send("data fetched")
// })



// app.get("/admin/data" ,adminAuth, (req,res,next)=>{
//     res.send("data get")
// })

// app.get("/admin/delete", adminAuth ,(req,res,next)=> {
//     try{
//     res.send("delete data")
//     }catch(err){
//      res.send("something went wrong")
//     }
    
    
// })

// app.use("/",(err,req,res,next)=> {
//     if(err){
//         res.status(500).send("something went wrong");
//     }

// })

// app.get("/user", (req, res) => {
//  console.log(req.query);
//  res.send({ firstName: "Akshay", lastName: "Saini" });
// });

// app.get("/user/:userId/:name", (req, res) => {
//  console.log(req.params);
//  res.send({ firstName: "Akshay", lastName: "Saini" });
// });

// app.get("/ab?c", (req, res) => {
//  res.send({ firstName: "Akshay", lastName: "Saini" });
// });

// app.get("/ab+c", (req, res) => {
//  res.send({ firstName: "ag", lastName: "Saini" });
// });

// app.get("/*fly$/", (req, res) => {
//  res.send({ firstName: "akash", lastName: "purwar" });
// });


// app.use("/user",(req,res,next)=> {
//     next();
    
// },[(req,res,next)=> {
//      next();
//     //res.send("response2")
// },
// (req,res,next)=> {
//     next();
//     //res.send("response3")
// }],
// (req,res)=> {
//     res.send("response4")
// })



