import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  statusDelay: parseInt(process.env.STATUS_DELAY || "15000"), // delay in ms
};
