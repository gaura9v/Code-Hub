const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
    try {

        //checking the token is valid or not
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Token is not present");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;


        if(payload.role!="admin"){
            throw new Error("Invalid token")
        }

        if(!_id){
            throw new Error("Invalid token");
        }

        const result=await User.findById(_id);

        if(!result){
            throw new Error("User does not exist");
        }

        //redis ke block list me present toh nhi he
        const isBlocked=await redisClient.exists(`token:${token}`);

        if(isBlocked){
            throw new Error("Invalid token");
        }

        req.result=result;

        next();
    } catch(err) {
        res.status(401).send("Error: "+ err);
    }
}

module.exports=adminMiddleware;