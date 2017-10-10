/*eslint-disable */

const { Logger, MongoClient } = require("mongodb");

// export a connection to the db that returns our collections
// we must specify each
// since connecting is an asynchronous operation, the function needs to be annotated with the async keyword
module.exports = async () => {
  console.log(`connecting to mongoDB: ${process.env.MONGODB_URI}`);
  const db = await MongoClient.connect(process.env.MONGODB_URI);
  let logCount = 0;
  Logger.setCurrentLogger((msg, state) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel("debug");
  Logger.filter("class", ["Cursor"]);

  return {
    // Links: db.collection("links"),
    Users: db.collection("users"),
    Votes: db.collection("votes"),
    Polls: db.collection("polls")
    // Questions: db.collection("questions"),
    // PollVotes: db.collection("pollVotes")
  };
};
/* eslint-enable */
