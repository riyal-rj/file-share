import dotenv from "dotenv";
dotenv.config();

import express,{NextFunction, Request, Response} from "express";
import cors, {CorsOptions} from "cors";
import helmet from "helmet";
import { ENV_VARS } from "./config/env.config";
import { UnauthorizedException } from "./utils/appError";
import { errorHandler } from "./middleware/errorHandler.middleware";

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

app.use(errorHandler);


async function startServer(){
    try {
        //await connectDatabase();  
     
        const server = app.listen(ENV_VARS.PORT, ()=>{
            console.log(`Server is running on port ${ENV_VARS.PORT} in ${ENV_VARS.NODE_ENV} mode`);
        });

        const shutDownSignals=["SIGTERM","SIGINT"];
        shutDownSignals.forEach((signal)=>{
            process.on(signal,async ()=>{
                console.log(`${signal} received: shutting down gracefully`);
            });
            try {
                server.close(()=>{
                    console.log(`HTTP server closed`);
                });

                process.exit(0);
            } catch (error) {
                console.error(`Error ocurred while shutting down the server: ${error}`);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error(`Failed to start the server`, error);
        process.exit(1);
    }
}

startServer();


