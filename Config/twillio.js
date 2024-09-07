const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// client.messages
//   .create({
//     body: 'Test message',
//     to: '+917023943953', // Replace with a valid number
//     from: process.env.TWILIO_NUMBER,
//   })
//   .then((message) => console.log('Message SID:', message.sid))
//   .catch((error) => console.error('Error:', error));

module.exports = client;

