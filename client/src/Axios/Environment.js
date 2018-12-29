import * as env from '../Include/env';


const dev = {
    server: env.DEV_SERVER
   };
   const prod = {
    server: env.PROD_SERVER
   };
   export const environment = process.env.NODE_ENV === "production" ? prod : dev;