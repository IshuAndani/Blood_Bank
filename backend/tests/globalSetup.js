// tests/globalSetup.js
const { MongoMemoryReplSet } = require('mongodb-memory-server');

module.exports = async () => {
  const mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });
  await mongoServer.waitUntilRunning();
  const uri = mongoServer.getUri();

  global.__MONGO_URI__ = uri;
  global.__MONGO_SERVER__ = mongoServer;

  process.env.MONGODB_URI = uri; // Your app should read from this
};
