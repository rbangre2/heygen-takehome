# Status Client Library and Server

This project includes a server and client library for polling the status of a simulated video translation job. The server provides a `/status` endpoint, which can return `pending`, `completed`, or `error` based on a configurable delay. The client library, `StatusClient`, allows efficient polling of the server's status with features like adaptive polling intervals, retry limits, and webhook notifications.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Server Usage](#server-usage)
  - [Running Locally](#running-locally)
  - [Environment Configuration](#environment-configuration)
- [Client Library Usage](#client-library-usage)
  - [Instantiating the Client](#instantiating-the-client)
  - [Methods](#methods)
  - [Example Usage](#example-usage)
- [Running Tests](#running-tests)

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- [Jest](https://jestjs.io/) for testing

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

## Server Usage

The server simulates a job status check and provides the `/status` endpoint.

### Running Locally

To run the server locally, use the following command:

```bash
npm run start
```

By default, the server listens on http://localhost:8080. You can configure the port in an .env file or via the config settings.

# Environment Configuration

Create a `.env` file in the server folder to specify configuration options.

### Example `.env` file:
```plaintext
PORT=3000
STATUS_DELAY=5000

## PORT
Specifies the port on which the server listens.

## STATUS_DELAY
Delay in milliseconds before the job status changes from pending to either completed or error.
```

## Client Library Usage
The client library, StatusClient, polls the server's /status endpoint with adaptive polling intervals.

### Instantiating the Client
To use the client, import and instantiate StatusClient with the server URL and configuration options.

```typescript
import { StatusClient } from './src/StatusClient';

const client = new StatusClient('http://localhost:3000', {
  pollingInterval: 2000,    // Start with a 2-second interval
  maxInterval: 30000,       // Cap interval at 30 seconds
  maxRetries: 10,           // Maximum retry attempts
  webhookUrl: 'https://your-service.com/webhook',  // Optional webhook URL
  onUpdate: (status) => console.log('Status update:', status),
});
```

### Methods

- `startMonitoring()`: Starts polling and registers webhook if configured
- `stopMonitoring()`: Stops polling and unregisters webhook if configured
- `getStatus()`: Makes a single request to get current status
- `registerWebhook()`: Register a webhook URL with the server
- `unregisterWebhook()`: Unregister a webhook URL from the server

### Webhook Support

The StatusClient supports webhook notifications in addition to polling. When configured with a webhook URL, the client will:
- Automatically register the webhook URL when monitoring starts
- Receive push notifications when the job status changes
- Continue polling as a fallback mechanism
- Automatically unregister the webhook when monitoring stops

Example with webhook configuration:

```typescript
const client = new StatusClient('http://localhost:3000', {
  webhookUrl: 'https://your-service.com/webhook',
  onUpdate: (status) => {
    console.log('Status update received:', status);
    if (status !== 'pending') {
      client.stopMonitoring();
    }
  },
});

await client.startMonitoring();
```

The webhook endpoint should expect POST requests with the following payload:

```typescript
interface WebhookPayload {
  result: 'pending' | 'completed' | 'error';
  timestamp: number;
}
```

### Example Usage

Here's an example of using StatusClient to poll for job status updates:

```typescript
const client = new StatusClient('http://localhost:3000', {
  pollingInterval: 2000,   // Poll every 2 seconds initially
  maxInterval: 30000,      // Maximum interval of 30 seconds
  maxRetries: 5,           // Retry up to 5 times
  onUpdate: (status) => {
    console.log('Status update received:', status);
    if (status !== 'pending') {
      client.stopMonitoring();
    }
  },
});

await client.startMonitoring();
```

The `examples` directory contains complete working examples:

- `basic-polling.ts`: Shows how to use the client with polling only
- `webhook-monitoring.ts`: Demonstrates webhook integration with fallback polling

To run the examples:

1. Start the server
```
cd packages/server
npm run start
```

2. Run the polling example 
```
cd packages/client
npm run example:polling
```

3. Run the webhook example
```
cd packages/client
npm run example:webhook
```

## Running Tests

The project includes both server and client tests to ensure functionality, performance, and integration. 

### Server Tests

The server tests cover endpoint responses, error handling, and overall functionality of the `/status` endpoint.

To run the server tests:

1. Navigate to the server directory:
   ```bash
   cd packages/server
   ```
2. Run the tests
   ```bash
   npm run test
   ```

### Client Integration Tests

The client integration tests verify the `StatusClient` library’s behavior when interacting with the live server. 
To run the client integration tests:

Start the tests from the client directory, which will automatically import and interact with the server:

   ```bash
   cd packages/client
   npm test
   ```
