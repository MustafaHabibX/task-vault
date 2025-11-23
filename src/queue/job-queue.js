import { Queue } from "bullmq";

// Redis connection configuration
const connection = {
  host: "127.0.0.1",
  port: 6379, // default Redis port
};

// Create a queue named "jobs"
export const jobQueue = new Queue("jobs", { connection });
