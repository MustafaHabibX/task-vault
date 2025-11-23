const { Worker } = require("bullmq");
const { JobStatus } = require("@prisma/client");
const prismaImport = require("../database/prisma.js");
const prisma = prismaImport.default;
const { jobQueueName, connection } = require("../queue/job-queue.js");

const worker = new Worker(
  jobQueueName,
  async (job) => {
    const jobId = job.data.jobId;

    // Mark as RUNNING
    await prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.RUNNING },
    });

    console.log(`Processing/Running job ID: ${jobId} ...`);

    // Simulate work, currently we use timeout with 10seconds
    await new Promise((resolve) => setTimeout(resolve, 20000));

    // Mark the job as COMPLETED, because job processing is finished
    await prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.COMPLETED },
    });

    console.log(`Job ID: ${jobId} completed`);
  },
  { connection }
);

worker.on("completed", (job) => console.log(`Yay!, Job ${job.id} completed`));
worker.on("failed", (job, err) =>
  console.log(`Ops!, Job ${job.id} failed: ${err.message}`)
);

console.log("Job worker is running...");
