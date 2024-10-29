import axios from "axios";
import { Status } from "../models/job";
import { WebhookPayload } from "../models/webhook";

class WebhookService {
  private webhooks: Set<string> = new Set();

  /**
   * Registers a webhook URL.
   * @param url - The URL to register.
   * @throws {Error} If the URL is invalid.
   */
  public registerWebhook(url: string): void {
    if (!this.isValidUrl(url)) {
      throw new Error("invalid webhook URL");
    }
    this.webhooks.add(url);
  }

  /**
   * Unregisters a webhook URL.
   * @param url - The URL to unregister.
   */
  public unregisterWebhook(url: string): void {
    this.webhooks.delete(url);
  }

  /**
   * Validates a URL.
   * @param url - The URL to validate.
   * @returns {boolean} True if the URL is valid, false otherwise.
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Notifies all registered webhooks with the given status.
   * @param status - The status to notify with.
   */
  public async notifyWebhooks(status: Status): Promise<void> {
    const payload: WebhookPayload = {
      result: status,
      timestamp: Date.now(),
    };

    const notifications = Array.from(this.webhooks).map((url) =>
      this.sendWebhook(url, payload)
    );

    await Promise.allSettled(notifications);
  }

  /**
   * Sends a webhook notification to a given URL.
   * @param url - The URL to send the notification to.
   * @param payload - The payload to send.
   */
  private async sendWebhook(
    url: string,
    payload: WebhookPayload
  ): Promise<void> {
    try {
      await axios.post(url, payload);
    } catch (error) {
      console.error(`failed to notify webhook ${url}:`, error);
    }
  }
}

export const webhookService = new WebhookService();
