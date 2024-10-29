import { Status } from "./job";

export interface WebhookRegistration {
  url: string;
  createdAt: number;
}

export interface WebhookPayload {
  result: Status;
  timestamp: number;
}
