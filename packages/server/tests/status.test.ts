import request from "supertest";
import { config } from "../src/config";
import app from "../src/server";
import { jobStatusService } from "../src/services/jobStatusService";

describe("GET /status endpoint", () => {
  it("should return pending status before delay", async () => {
    jobStatusService.resetStatus();

    const response = await request(app).get("/status");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: "pending" });
  });

  it(
    "should return completed or error status after delay",
    async () => {
      await new Promise((resolve) => setTimeout(resolve, config.statusDelay));

      const response = await request(app).get("/status");
      expect(response.status).toBe(200);
      expect(["completed", "error"]).toContain(response.body.result);
    },
    config.statusDelay + 1000
  );
});
