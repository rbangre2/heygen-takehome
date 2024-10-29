import { Request, Response } from "express";
import { webhookService } from "../services/webhookService";

/**
 * Registers a webhook URL.
 * @param req - The request object.
 * @param res - The response object.
 */
export const registerWebhook = (req: Request, res: Response): void => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: "webhook URL is required" });
      return;
    }

    webhookService.registerWebhook(url);
    res.json({ message: "webhook registered successfully" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Unregisters a webhook URL.
 * @param req - The request object.
 * @param res - The response object.
 */
export const unregisterWebhook = (req: Request, res: Response): void => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: "webhook URL is required" });
    return;
  }

  webhookService.unregisterWebhook(url);
  res.json({ message: "webhook deleted successfully" });
};
