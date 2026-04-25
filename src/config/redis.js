const { createClient } = require("redis");

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-13517.crce286.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13517
    }
});

module.exports = redisClient;