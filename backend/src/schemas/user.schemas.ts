import { Document, Types } from "mongoose";

export interface UserInterface extends Document {
    _id:Types.ObjectId,
    name:string,
    email:string,
    password:string,
    profilePicture:string | null,
    createdAt:Date,
    updatedAt:Date,
    comparePassword(value:string):Promise<boolean>
    omitPassword():Omit<UserInterface, "password">
}