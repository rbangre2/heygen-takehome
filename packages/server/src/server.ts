import express from "express";
import router from "./routes";
import { config } from "./config";

const app = express();
const port = config.port;

app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
