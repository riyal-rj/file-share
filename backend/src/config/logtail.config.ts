import { Logtail } from "@logtail/node";
import { ENV_VARS } from "./env.config";

export const logtail = new Logtail(ENV_VARS.LOGTAIL_SOURCE_TOKEN,{
    endpoint: ENV_VARS.LOGTAIL_INGESTING_HOST
});

