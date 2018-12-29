//variables for prod vs dev


const dev = {
    context: "http://localhost:5000"
   };
   
   const prod = {
    context: "http://localhost:5000"
   };
   
   export const environment = process.env.NODE_ENV === "production" ? prod : dev;