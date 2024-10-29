import { Request, Response } from "express";
import { jobStatusService } from "../services/jobStatusService";

export const getStatus = (req: Request, res: Response) => {
  const status = jobStatusService.getStatus();
  res.json({ result: status });
};
