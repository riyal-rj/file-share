import mongoose from "mongoose";
import { UserInterface  } from "../schemas/user.schemas";
import { compareValue, hashValue } from "../utils/bcrypt";
const userSchema=new mongoose.Schema<UserInterface>(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true
        },
        password:{
            type:String,
            select:true
        },
        profilePicture:{
            type:String,
            default:null
        }
    },
    {
        timestamps:true
    }
);


userSchema.pre('save',async function (next){
    if(this.isModified('password')){
        if(this.password){
            this.password=await hashValue(this.password)
        }
    }
    next();
});


userSchema.methods.comparePassword=async function (pass:string) {
    return compareValue(pass,this.password)
}


userSchema.methods.omitPassword=function():Omit<UserInterface,'password'>{
    const userObj=this.toObject();
    delete userObj.password;
    return userObj;
}


const UserModel=mongoose.model<UserInterface>('User',userSchema);
export default UserModel;

