const { Queue } = require('bullmq');
const { createClient } = require('ioredis');
let connection;
try{
    connection = createClient({
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: null
    });
}
catch(err){
    console.log(err);
}


const emailQueue = new Queue('emailQueue', {connection});
const smsQueue = new Queue('smsQueue', {connection});

module.exports = {
    emailQueue,
    smsQueue,
    connection
}