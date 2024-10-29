# Status Client Library and Server

This project includes a server and client library for polling the status of a simulated video translation job. The server provides a `/status` endpoint, which can return `pending`, `completed`, or `error` based on a configurable delay. The client library, `StatusClient`, allows efficient polling of the server’s status with features like adaptive polling intervals and retry limits.

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

## Server Usage

The server simulates a job status check and provides the `/status` endpoint.

### Running Locally

To run the server locally, use the following command:

```bash
npm run start

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

## Client Library Usage
The client library, StatusClient, polls the server's /status endpoint with adaptive polling intervals.

### Instantiating the Client
To use the client, import and instantiate StatusClient with the server URL and configuration options.

```typescript
import { StatusClient } from './src/StatusClient';

const client = new StatusClient('http://localhost:3000', {
  pollingInterval: 2000,  // Start with a 2-second interval
  maxInterval: 30000,     // Cap interval at 30 seconds
  maxRetries: 10,         // Maximum retry attempts
  onUpdate: (status) => console.log('Status update:', status),
});