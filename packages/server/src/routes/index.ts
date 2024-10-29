import express from "express";
import { getStatus } from "../controllers/statusController";
import {
  registerWebhook,
  unregisterWebhook,
} from "../controllers/webhookController";

const router = express.Router();

router.get("/status", getStatus);
router.post("/webhooks/register", registerWebhook);
router.delete("/webhooks/unregister", unregisterWebhook);

export default router;
