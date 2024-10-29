export enum Status {
  Pending = "pending",
  Completed = "completed",
  Error = "error",
}

export interface StatusResponse {
  result: Status;
}

export interface ClientConfig {
  pollingInterval?: number;
  maxInterval?: number;
  maxRetries?: number;
  onUpdate?: (status: Status) => void;
}

export interface StatusResponse {
  result: Status;
}

export interface WebhookConfig extends ClientConfig {
  webhookUrl?: string;
}
