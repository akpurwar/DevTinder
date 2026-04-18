const express = require("express");

const app  = express();

app.use("/test" , (req, res)=> {// request handler
    res.send("hello from server ")  
})

app.use("/hell" , (req, res)=> {// request handler
    res.send("hell from server ")  
})

app.listen(8800, ()=> {
    console.log("server is sucessfully running on port 3000");
});

