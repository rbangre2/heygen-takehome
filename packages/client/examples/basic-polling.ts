import { StatusClient } from "../src/StatusClient";
import { Status } from "../src/types";

// begin by running the server locally

// create a new client instance
const client = new StatusClient("http://localhost:8080", {
  pollingInterval: 2000, // poll every 2 seconds initially
  maxInterval: 30000, // maximum interval of 30 seconds
  maxRetries: 5, // retry up to 5 times
  onUpdate: (status) => {
    console.log("status update received:", status);
    if (status !== Status.Pending) {
      console.log("final status reached:", status);
      client.stopMonitoring();
    }
  },
});

// start monitoring
console.log("starting status monitoring...");
client
  .startMonitoring()
  .catch((error) => console.error("error during monitoring:", error));
