import express, { Application } from "express";
import router from "./routes";
import { config } from "./config";

const app: Application = express();
const port = config.port;

app.use(express.json());

app.use(router);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
