import "dotenv/config";

import connectDB from "../src/db/index.js";
import { app } from "./app.js";

// dotenv.config({
//   path: "./env",
// });

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT || 5000, () => {
      console.log("listening on port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Error on monngose connection: " + error);
  });
