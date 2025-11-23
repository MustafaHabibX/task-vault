import { Queue } from "bullmq";

// Redis connection configuration
export const connection = {
  host: "127.0.0.1",
  port: 6379, // default Redis port
};

// Name of the queue
export const jobQueueName = "jobs";

// Create a BullMQ queue instance
export const jobQueue = new Queue(jobQueueName, { connection });
