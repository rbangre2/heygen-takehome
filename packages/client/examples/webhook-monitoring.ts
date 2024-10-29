import { StatusClient } from "../src/StatusClient";
import { Status } from "../src/types";
import express from "express";

// begin by running the server locally

// setup a simple webhook server
const app = express();
app.use(express.json());
const WEBHOOK_PORT = 3001;

// setup webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("webhook received:", req.body);
  res.sendStatus(200);
});

// start webhook server
app.listen(WEBHOOK_PORT, () => {
  console.log(`webhook server listening on port ${WEBHOOK_PORT}`);
});

// create a new client instance with webhook configuration
const client = new StatusClient("http://localhost:8080", {
  pollingInterval: 2000,
  maxInterval: 30000,
  maxRetries: 5,
  webhookUrl: `http://localhost:${WEBHOOK_PORT}/webhook`,
  onUpdate: (status) => {
    if (status !== Status.Pending) {
      client.stopMonitoring();
    }
  },
});

// start monitoring
console.log("starting status monitoring with webhooks...");
client
  .startMonitoring()
  .catch((error) => console.error("error during monitoring:", error));
