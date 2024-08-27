const { connection } = require('../Config/bullmq');
const { Worker } = require('bullmq');

const {newOTP} = require('../Mailer/otpMailer');

const emailWorker = new Worker('emailQueue', async (job)=> {
    try {
        
        await newOTP(job.data);
      } catch (error) {
        console.error("Error processing job:", error);
      }
    
}, {connection})

emailWorker.on('completed', (job) => {
    console.log(`Job completed with result ${job.returnvalue}`);
});
  
emailWorker.on('failed', (job, err) => {
    console.log(`Job failed with error ${err.message}`);
});

module.exports = emailWorker;
