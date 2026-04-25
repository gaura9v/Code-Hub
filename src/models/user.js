// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const userSchema = new Schema({
//     firstName: {
//         type: String,
//         minLength: 2,
//         maxLength: 30,
//         required: true
//     },
//     lastName: {
//         type: String,
//         minLength: 3,
//         maxLength: 30,
//     },
//     emailId: {
//         type: String,
//         unique: true,
//         required: true,
//         immutable: true,
//         trin: true,
//         lowercase: true
//     },
//     age: {
//         type: Number,
//         min: 6,
//         max: 80
//     },
//     role: {
//         type: String,
//         enum: ["user", "admin"],
//         default: "user"
//     },
//     problemSolved: {
//         type: [{
//             type:Schema.Types.ObjectId,
//             ref:'problem'
//         }],
        
//     },
//     password:{
//         type:String,
//         required:true
//     }
//     // photo:{
//     //     type:String,
//     //     default:"this is default photo"
//     // }
// }, {
//     timestamps: true
// });

// const User = mongoose.model("user", userSchema);
// module.exports = User;
const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,
        immutable: true,
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem',
            unique:true
        }],
        
    },
    password:{
        type:String,
        required: true
    }
},{
    timestamps:true
});

userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
      await mongoose.model('submission').deleteMany({ userId: userInfo._id });
    }
});


const User = mongoose.model("user",userSchema);

module.exports = User;
