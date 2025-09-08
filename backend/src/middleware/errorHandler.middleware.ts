import { ErrorRequestHandler,Response } from "express";
import {ZodError} from "zod";
import { HTTP_STATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { logger } from "../utils/logger";
import { ErrorCodeEnum } from "../enum/errorCode.enum";

const formatZodeError=(res:Response,error:ZodError)=>{
    const errors=error?.issues?.map((err)=>({
        field:err.path.join('.'),
        message:err.message
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message:"Validation Error",
        errorCode:ErrorCodeEnum.VALIDATION_ERROR,
        errors
    })
}


export const errorHandler:ErrorRequestHandler=(
    error,
    req,
    res,
    next
):any=>{
    logger.error(`Error on path`)
}