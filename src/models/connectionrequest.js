const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    

    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required:true
    }

}, { timestamps: true })

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

//cONNECTIONrEQUESTsCHEM.FIND({FRONuSERiD , TOuserId})
connectionRequestSchema.index({fromUserId:1, toUserId:1}) //compound index

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    //check if fromuser same as to user Id 

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection to yourself ")
    }
    next();
})

module.exports = ConnectionRequest;

//why should we not create index for everything kya use case hai 
//adv and disadv of indexes
//$or $and $nor $not