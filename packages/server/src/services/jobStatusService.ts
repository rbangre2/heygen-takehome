import { Status } from "../models/job";
import { config } from "../config";
import { webhookService } from "./webhookService";

class JobStatusService {
  private status: Status = Status.Pending;

  constructor() {
    this.runJob();
  }

  /* 
    This method simulates the status change of a job.
    It randomly sets the status to either completed or error with a delay.
  */
  private runJob(): void {
    setTimeout(async () => {
      this.status = Math.random() < 0.8 ? Status.Completed : Status.Error;
      // Notify webhooks of status change
      await webhookService.notifyWebhooks(this.status);
    }, config.statusDelay);
  }

  /* 
    This method returns the current status of the job.
  */
  public getStatus(): Status {
    return this.status;
  }

  /* 
    This method resets the status of the job to pending and starts the job again.
  */
  public resetStatus(): void {
    this.status = Status.Pending;
    this.runJob();
  }
}

export const jobStatusService = new JobStatusService();
