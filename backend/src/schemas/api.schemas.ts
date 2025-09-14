import { Model, Types } from "mongoose"

export interface ApiKeyInterface extends Document{
    userId:Types.ObjectId,
    name:string,
    displayKey:string,
    hashedKey:string,
    createdAt:Date,
    updatedAt:Date
    lastUsedAt?:Date
}

export interface ApiKeyModelType extends Model<ApiKeyInterface>{
    updateLastUsed(hashedKey:string):Promise<void>
}