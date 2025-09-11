import dotenv from "dotenv";
import express,{NextFunction, Request, Response} from "express";
import cors, {CorsOptions} from "cors";
import helmet from "helmet";
import { ENV_VARS } from "./config/env.config";
import { UnauthorizedException } from "./utils/appError";


const app=express();
const BASE_PATH=ENV_VARS.BASE_PATH;


const allowedOrigins=ENV_VARS.ALLOWED_ORIGINS?.split(',');

const corsOptions:CorsOptions={
    credentials:true,
    origin(origin,callback){
        if(!origin || allowedOrigins.includes(origin))
            callback(null,true);
        else
        {
            const errorMsg=`CORS error: Origin ${origin} is not allowed`;
            callback(new UnauthorizedException(errorMsg),false);
        }
    },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(helmet());


