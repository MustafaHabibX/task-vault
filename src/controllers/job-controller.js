import * as jobService from "../services/job-service.js";
import { jobQueue } from "../queue/job-queue.js";
import { AsyncFifoQueue } from "bullmq";

export async function getJobs(req, res) {
  const loggedInUserID = req.user.id;

  // Get the all jobs of the current user
  const result = await jobService.getAllJobs(loggedInUserID);

  return res
    .status(result.status)
    .json({ jobs: result.jobs, message: result.message });
}

export async function createJob(req, res) {
  const loggedInUserID = req.user.id;

  // Get user inputs
  const { name, description, status } = req.body;

  // Store the given job to the DB
  const result = await jobService.createJob(
    loggedInUserID,
    name,
    description,
    status
  );

  // The jobID that came from the DB
  const dbJob = result.job;

  // Push the job into BullMQ queue
  await jobQueue.add("newJob", { jobId: dbJob.id });

  return res.status(result.status).json({ message: result.message });
}

export async function getSpecificJob(req, res) {
  const inputJobId = parseInt(req.params.id);
  const userId = req.user.id;

  const result = await jobService.getSpecificJob(userId, inputJobId);

  if (result.error)
    return res
      .status(result.status)
      .json({ status: result.status, error: result.error });

  return res.json({ result: result.jobs });
}
