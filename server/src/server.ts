
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;
// נקודת הכניסה של השרת: עושים חיבור למסד נתונים ולאחר מכן מאזינים על פורט
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();