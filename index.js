import mongoose from "mongoose";
import { config } from "dotenv";
config();

import "./src/bot/bot.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected..."))
  .catch(() => console.log("DB ERROR!"));

console.log("Dastur boshlanmoqda...");
