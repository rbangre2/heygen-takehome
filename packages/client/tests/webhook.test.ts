import { StatusClient } from "../src/StatusClient";
import { Status } from "../src/types";
import server from "../../server/src/server";
import express from "express";

describe("StatusClient Webhook Integration Test", () => {
  const PORT = 8082;
  const WEBHOOK_PORT = 8083;
  const BASE_URL = `http://localhost:${PORT}`;
  const WEBHOOK_URL = `http://localhost:${WEBHOOK_PORT}/webhook`;

  let statusClient: StatusClient;
  let serverInstance: any;
  let webhookServer: any;
  let webhookUpdates: any[] = [];

  beforeAll(async () => {
    const webhookApp = express();
    webhookApp.use(express.json());
    webhookApp.post("/webhook", (req, res) => {
      webhookUpdates.push(req.body);
      res.sendStatus(200);
    });

    try {
      webhookServer = await new Promise((resolve, reject) => {
        const server = webhookApp
          .listen(WEBHOOK_PORT, () => resolve(server))
          .on("error", reject);
      });

      serverInstance = await new Promise((resolve, reject) => {
        const srv = server.listen(PORT, () => resolve(srv)).on("error", reject);
      });
    } catch (error) {
      console.error("server setup failed: ", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (serverInstance) {
        await new Promise<void>((resolve) => {
          serverInstance.close(() => resolve());
        });
      }
      if (webhookServer) {
        await new Promise<void>((resolve) => {
          webhookServer.close(() => resolve());
        });
      }
    } catch (error) {
      console.error("server cleanup failed: ", error);
    }
  });

  beforeEach(() => {
    webhookUpdates = [];
    statusClient = new StatusClient(BASE_URL, {
      webhookUrl: WEBHOOK_URL,
      maxRetries: 5,
      onUpdate: (status) => console.log("status update: ", status),
    });
  });

  it("should receive webhook notifications", async () => {
    await statusClient.startMonitoring();

    const timeout = 6000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (webhookUpdates.length > 0) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    expect(webhookUpdates.length).toBeGreaterThan(0);
    const lastWebhook = webhookUpdates[webhookUpdates.length - 1];
    expect([Status.Completed, Status.Error]).toContain(
      lastWebhook.result as Status
    );

    await statusClient.stopMonitoring();
  }, 10000);
});
