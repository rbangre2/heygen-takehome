import { Request, Response } from "express";
import { jobStatusService } from "../services/jobStatusService";

/*
  Returns the current status of the job
*/
export const getStatus = (req: Request, res: Response) => {
  const status = jobStatusService.getStatus();
  res.json({ result: status });
};
