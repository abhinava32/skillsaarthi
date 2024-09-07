const { Queue } = require('bullmq');
const { createClient } = require('ioredis');

const connection = createClient({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null
});

const emailQueue = new Queue('emailQueue', {connection});

module.exports = {
    emailQueue,
    connection
}