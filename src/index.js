import dotenv from "dotenv";

import connectDB from "../src/db/index.js";

dotenv.config({
  path: "./env",
});

connectDB();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URL} / ${DB_NAME}`);
//     console.log("connected to mongoDB");
//   } catch (e) {
//     console.log("error: " + e.message);
//   }
// })();
