export const adminAuth = (req,res,next)=> {
    let token = "xyz";
    let isAdmin = token === "xyz";

    if(!isAdmin){
        res.status(401).send("unauthorized user");

    }
    next();
}

export const userAuth = (req,res,next)=> {
    let token = "xyz1";
    let user = token === "xyz";

    if(!user){
        res.status(401).send("unauthorized user");

    }
    next();
}