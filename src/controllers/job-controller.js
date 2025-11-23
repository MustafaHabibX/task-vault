import * as jobService from "../services/job-service.js";

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

  // A simple implementation for testing
  const result = await jobService.createJob(
    loggedInUserID,
    name,
    description,
    status
  );

  return res.status(result.status).json(result);
}
