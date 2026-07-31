const { default: mongoose } = require('mongoose');

require('mongoose');
const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        index:true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true, // already it is has index once we declare unique
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`${value} is not a valid email`)
            }
            return true
        }
    },
    age: {
        type: Number,
        min: [6, 'Too few eggs'],
    },
    password : {
        type: String,
        required : [true, "password required"]
    },
    gender: {
        type: String,
        enum : {
            values: ["male", "female" , "other"],
            message: `{VALUE} is not of the correct status type`
        }
    }

},{timestamps: true })


userSchema.methods.getJWT =  async function(){
  const user= this; 
  const token = await jwt.sign({_id: user._id},"DevTinder@790", {expiresIn : "1d"});
  return token

}

userSchema.methods.validatePassword = async function(userInputpassword){
    const user= this;
    const isPasswordVlid = await bcrypt.compare(userInputpassword ,user.password)

    return isPasswordVlid
}

module.exports = mongoose.model("User", userSchema);



