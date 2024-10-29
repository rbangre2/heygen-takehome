import axios, { AxiosInstance } from "axios";
import { WebhookConfig, Status, StatusResponse } from "./types";
import { defaultConfig } from "./config";
import { calculateBackoff } from "./utils/backoff";

export class StatusClient {
  private axiosInstance: AxiosInstance;
  private pollingInterval: number;
  private maxInterval: number;
  private maxRetries: number;
  private retries: number = 0;
  private onUpdate?: (status: Status) => void;
  private pollingTimer: NodeJS.Timeout | null = null;
  private webhookUrl?: string;

  constructor(baseURL: string, config: WebhookConfig = {}) {
    this.axiosInstance = axios.create({ baseURL });
    this.pollingInterval =
      config.pollingInterval || defaultConfig.pollingInterval;
    this.maxInterval = config.maxInterval || defaultConfig.maxInterval;
    this.maxRetries = config.maxRetries || defaultConfig.maxRetries;
    this.onUpdate = config.onUpdate;
    this.webhookUrl = config.webhookUrl;
  }

  public async registerWebhook(): Promise<void> {
    if (!this.webhookUrl) {
      throw new Error("webhook URL not configured");
    }

    await this.axiosInstance.post("/webhooks/register", {
      url: this.webhookUrl,
    });
  }

  public async unregisterWebhook(): Promise<void> {
    if (!this.webhookUrl) {
      throw new Error("webhook URL not configured");
    }

    await this.axiosInstance.delete("/webhooks/unregister", {
      data: { url: this.webhookUrl },
    });
  }

  public async startMonitoring(): Promise<void> {
    this.startPolling();

    if (this.webhookUrl) {
      await this.registerWebhook();
    }
  }

  public async stopMonitoring(): Promise<void> {
    this.stopPolling();

    if (this.webhookUrl) {
      await this.unregisterWebhook();
    }
  }

  /*
    Starts polling the status endpoint and invokes the callback on each update
  */
  public startPolling(): void {
    if (this.pollingTimer) return;

    const poll = async () => {
      if (this.retries >= this.maxRetries) {
        this.stopPolling();
        console.warn("Polling stopped: Max retries reached.");
        return;
      }

      try {
        const status = await this.getStatus();
        this.retries++;

        // calls callback function on each retry
        if (this.onUpdate) this.onUpdate(status);

        // if still pending, adjust interval and poll again
        if (status === Status.Pending) {
          this.adjustPollingInterval();
          this.pollingTimer = setTimeout(poll, this.pollingInterval);
        } else {
          this.stopPolling();
        }
      } catch (error) {
        console.error("an error has occurred during polling:", error);
        this.stopPolling();
      }
    };

    poll();
  }

  /*
    Adjusts the polling interval with a backoff strategy
  */
  private adjustPollingInterval(): void {
    this.pollingInterval = calculateBackoff(
      this.pollingInterval,
      this.maxInterval
    );
  }

  public stopPolling(): void {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
      this.pollingTimer = null;
      this.retries = 0;
    }
  }

  // Fetches the current status
  public async getStatus(): Promise<Status> {
    try {
      const response = await this.axiosInstance.get<StatusResponse>("/status");
      return response.data.result;
    } catch (error) {
      console.error("error fetching fetching job status: ", error);
      throw error;
    }
  }
}
