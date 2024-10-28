const { connection } = require("../Config/bullmq");
const { Worker } = require("bullmq");
const { createClient } = require("ioredis");
const redis = createClient();
const { newOTP } = require("../Mailer/otpMailer");
const { newLink } = require("../Mailer/linkMailer");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "send-otp") {
      try {
        await newOTP(job.data);
      } catch (error) {
        console.error("Error processing job:", error);
      }
    } else if (job.name === "send-link") {
      try {
        await newLink(job.data);
      } catch (error) {
        console.error("Error processing job:", error);
      }
    }
  },
  { connection }
);

emailWorker.on("completed", async (job) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Job completed with result ${job.returnvalue}`);
  }
  try {
    await job.remove();
    if (process.env.NODE_ENV === "development") {
      console.log(`Job ${job.id} removed successfully.`);
    }
  } catch (err) {
    console.error(`Failed to remove job ${job.id}:`, err);
  }
});

emailWorker.on("failed", async (job, err) => {
  console.log(`Job failed with error: ${err.message}`);

  // Track the retry count
  const retryCount = job.attemptsMade;

  if (retryCount === 0) {
    // Retry after 1 minute (60,000 ms)
    setTimeout(async () => {
      try {
        await job.retry();
        if (process.env.NODE_ENV === "development") {
          console.log(`Retrying job with ID: ${job.id} after 1 minute`);
        }
      } catch (retryErr) {
        console.error(
          `Retry failed for job ID: ${job.id}, error: ${retryErr.message}`
        );
      }
    }, 60000);
  } else if (retryCount === 1) {
    // Retry after 5 minutes (300,000 ms)
    setTimeout(async () => {
      try {
        await job.retry();
        if (process.env.NODE_ENV === "development") {
          console.log(`Retrying job with ID: ${job.id} after 5 minutes`);
        }
      } catch (retryErr) {
        console.error(
          `Retry failed for job ID: ${job.id}, error: ${retryErr.message}`
        );
      }
    }, 300000);
  } else {
    console.log(
      `Job with ID: ${job.id} has exceeded retry attempts and will not be retried.`
    );
    try {
      await job.remove();
    } catch (err) {
      console.error(`Failed to remove job ${job.id}:`, err);
    }
  }
});

module.exports = emailWorker;
