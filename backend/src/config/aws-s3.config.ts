import {S3Client} from "@aws-sdk/client-s3";
import { ENV_VARS } from "./env.config";

export const s3Client = new S3Client({ 
    credentials:{
        accessKeyId:ENV_VARS.AWS_ACCESS_KEY,
        secretAccessKey:ENV_VARS.AWS_SECRET_KEY
    },
    region:ENV_VARS.AWS_REGION
 });