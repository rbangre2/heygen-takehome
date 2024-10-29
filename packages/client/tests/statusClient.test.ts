import { StatusClient } from "../src/StatusClient";
import { Status } from "../src/types";
import server from "../../server/src/server";

describe("StatusClient Integration Test", () => {
  const PORT = 8080;
  const BASE_URL = `http://localhost:${PORT}`;
  let statusClient: StatusClient;
  let serverInstance: any;

  beforeAll((done) => {
    serverInstance = server.listen(PORT, () => {
      console.log(`test server running on ${BASE_URL}`);
      done();
    });
  });

  afterAll((done) => {
    serverInstance.close(() => {
      console.log("test server closed");
      done();
    });
  });

  beforeEach(() => {
    statusClient = new StatusClient(BASE_URL, {
      pollingInterval: 1000,
      maxRetries: 5,
      onUpdate: (status) => console.log("status update: ", status),
    });
  });

  it("should poll the server and stop on final status", (done) => {
    const statusUpdates: Status[] = [];

    statusClient = new StatusClient(BASE_URL, {
      pollingInterval: 1000,
      maxRetries: 10,
      onUpdate: (status) => {
        statusUpdates.push(status);
        console.log("received status:", status);

        if (status !== Status.Pending) {
          statusClient.stopPolling();
          expect(statusUpdates).toContain(Status.Pending);
          expect([Status.Completed, Status.Error]).toContain(status);
          done();
        }
      },
    });

    statusClient.startPolling();
  }, 10000);
});
