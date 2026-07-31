const validators = require("validator");
const user = require("../models/user");

 function validateSignup(req)
 {
    const {firstName , lastName ,email,password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("FirstName, LastName should be entered ");
    }

    if(!validators.isEmail(email)){
        throw new Error("Email is not valid")
    }

    if(!validators.isStrongPassword(password)){
       throw new Error("Password is not strong");   
     }


}

 function validateEditProfile(req)
 {

     const includedfields = ["firstName", "lastName","gender"];

     let isAllowedEdit = Object.keys(req.body).every((field)=> includedfields.includes(field));

     return isAllowedEdit;


}


function validatePasswordForgotofProfile(req){

    const includedfields = ["password"];

     let isAllowedEdit = Object.keys(req.body).every((field)=> includedfields.includes(field));

     return isAllowedEdit;

}

module.exports = { validateSignup ,validateEditProfile,validatePasswordForgotofProfile }