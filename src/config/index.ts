import * as dotEnv from "dotenv";
dotEnv.config();
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: number;
        CLIENT_SECRET: string;
        USER_MAIL:string;
        USER_PASSWORD:string;
        SECRET_KEY:string;

      }
    }
  }
export {errorHandler} from "./errorHandler";
export {ApiError} from "./apiError"
export const PORT = process.env.PORT
export const USER_MAIL = process.env.USER_MAIL
export const USER_PASSWORD =process.env.USER_PASSWORD
export const CLIENT_SECRET =process.env.CLIENT_SECRET
export const CLIENT_ID =process.env.CLIENT_ID
export const SECRET_KEY =process.env.SECRET_KEY

