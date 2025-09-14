export interface ApiKeyInterface extends Document{
    userId:string,
    name:string,
    displayKey:string,
    hashedKey:string,
    createdAt:Date,
    updatedAt:Date
    lastUsedAt?:Date
}