const { connection } = require("../Config/bullmq");
const { Worker } = require("bullmq");
const client = require("../Config/twillio");

const sendMessageOTP = (data) => {
  client.messages
    .create({
      body: `Here is your OTP: ${data.otp} ${data.reason}`,
      to: `+91${data.phone}`,
      from: process.env.TWILIO_NUMBER,
    })
    .then((message) => console.log(message.sid));
};

const smsWorker = new Worker(
  "smsQueue",
  async (job) => {
    if (job.name === "send-otp") {
      try {
        await sendMessageOTP(job.data);
      } catch (error) {
        console.error("Error processing job:", error);
      }
    }
  },
  { connection }
);

smsWorker.on("completed", async (job) => {
  console.log(`SMS Sent`);
  await job.remove();
});

smsWorker.on("failed", (job, err) => {
  console.log(`Job failed with error ${err.message}`);
});

module.exports = smsWorker;
