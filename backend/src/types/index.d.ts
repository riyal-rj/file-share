import { UserInterface } from "../schemas/user.schemas";

declare global{
    namespace Express{
        interface User extends UserInterface{
            _id?:any,
            password?:string
        }
    }
}