const axios = require('axios');
const { createClient } = require('ioredis');
const redis = createClient();

const authenticateApi = ()=> {
  let token;
  const options = {
    method: 'POST',
    url: 'https://api.sandbox.co.in/authenticate',
    headers: {
      accept: 'application/json',
      'x-api-key': process.env.SANDBOX_API_KEY,
      'x-api-secret': process.env.SANDBOX_API_SECRET,
      'x-api-version':'2.0'
    }
  };

  axios
    .request(options)
    .then(async function (response) {
      console.log("setting token: ",response.data.access_token);
      await redis.set('SANDBOX_JWT', response.data.access_token, 'EX', (60*60*23)+(60*59));
      await redis.set('SANDBOX_JWT_EXPIRY_TEMP',Date.now()+(1000*60*60*24));
      await redis.set('SANDBOX_JWT_EXPIRY_PERM',Date.now()+(1000*60*60*24*365)); 
    })
    .catch(function (error) {
      console.error(error);
    });
}

const authorizeApi = () => {
  const options = {
    method: 'POST',
    url: `https://api.sandbox.co.in/authorize?request_token=${redis.get('SANDBOX_JWT')}`,
    headers: {
      accept: 'application/json',
      authorization: `${redis.get('SANDBOX_JWT')}`,
      'x-api-key': process.env.SANDBOX_API_KEY,
      'x-api-version': '2.0'
    }
  };
  
  axios
    .request(options)
    .then(async function (response) {
      console.log("Setting access token as ",response.data);
      await redis.set('SANDBOX_JWT', response.data.access_token, 'EX', (60*60*23)+(60*59)); 
      await redis.set('SANDBOX_JWT_EXPIRY_TEMP',Date.now()+(1000*60*60*24));
    })
    .catch(function (error) {
      console.error(error);
    });
}

module.exports = {
    authenticateApi,
    authorizeApi
}


