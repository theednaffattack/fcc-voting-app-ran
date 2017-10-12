/*eslint-disable */
const DataLoader = require("dataloader");

async function batchUsers(Users, keys) {
  return await Users.find({ _id: { $in: keys } }).toArray();
}

async function batchVoteOptions(VoteOptions, keys) {
  return await VoteOptions.find({ pollId: { $in: keys } }).toArray();
}

module.exports = ({ Users, VoteOptions }) => ({
  userLoader: new DataLoader(keys => batchUsers(Users, keys), {
    cacheKeyFn: key => key.toString()
  }),
  voteOptionLoader: new DataLoader(
    keys => batchVoteOptions(VoteOptions, keys),
    {
      cacheKeyFn: key => key.toString()
    }
  )
});
/* eslint-enable */
