import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  statusDelay: parseInt(process.env.STATUS_DELAY || "5000"), // delay in ms
};
