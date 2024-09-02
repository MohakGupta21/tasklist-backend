import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        password: {
            type:String,
            required:true
        },
        email: {
            type:String,
            required:true,
            unique:true
        }
    },
    {timestamp: true}
)

const UserModel = mongoose.model("Users", userSchema)

export default UserModel;