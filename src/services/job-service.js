import { JobStatus } from "@prisma/client";
import prisma from "../database/prisma.js";

export async function getAllJobs(userID) {
  try {
    const jobs = await prisma.job.findMany({ where: { userId: userID } });
    if (!jobs) {
      return { status: 404, message: "Error getting jobs" };
    }

    return { status: 200, message: "Request Successfully procced.", jobs };
  } catch (err) {
    console.error("Error occured when fetching jobs.", err);
    return {
      status: 400,
      message: "Error occured when fetching jobs.",
      jobs: null,
    };
  }
}

export async function createJob(
  userID,
  inputName,
  inputDescription,
  inputStatus
) {
  try {
    const status =
      inputStatus && JobStatus[inputStatus.toUpperCase()]
        ? JobStatus[inputStatus.toUpperCase()]
        : undefined;

    const result = await prisma.job.create({
      data: {
        name: inputName,
        description: inputDescription,
        status: status,
        user: {
          connect: { id: userID },
        },
      },
    });

    return {
      status: 200,
      message: "Job created successfully",
      job: result,
    };
  } catch (err) {
    console.error("An error occured creating a new job.", err);
    return { status: 400, message: "An error occured creating a new job." };
  }
}
