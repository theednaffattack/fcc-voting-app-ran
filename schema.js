/*eslint-disable */
const { merge } = require("lodash");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const {
  makeExecutableSchema,
  addErrorLoggingToSchema
} = require("graphql-tools");

// const { userLoader } = require("./dataloaders.js");

const { ObjectID } = require("mongodb").ObjectID;
const bcrypt = require("bcryptjs");
// const { pubsub } = require("./subscriptions");

const rootSchema = [
  `
# Database user

type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String
    votes: [Vote!]!
}

type Poll {
  id: ID!
  title: String!
  votes: [Vote!]!
  postedBy: User
  options: [String!]!
  voteOptions: [VoteOption!]!
}

type Vote {
  id: ID!
  user: User!
  voteOption: VoteOption!
}

type Query {
  # User
  user: User
  allUsers: [User!]!
  Poll(_id: ID!): Poll
  getPoll(id: ID!): Poll
  # allPolls: [Poll!]!
  allPolls(filter: PollFilter, skip: Int, first: Int): [Poll!]!
}

input PollFilter {
  OR: [PollFilter!]
  title_contains: String
  voteOptions_contains: String
}

type VoteOption {
  id: ID!
  text: String!
  user: User!
  poll: Poll!
  votes: [Vote!]!
  votesCount: Int!
}

type Mutation {
  # Make a person!
  createUser(firstName: String!, lastName: String!, authProvider: AuthProviderSignupData!): User
  signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
  createPoll(title: String!, options: [String!]!): Poll
  createVote(voteOption: ID!): Vote
  createVoteOption(pollId: ID!): VoteOption
  # updatePoll(id: ID!, title: String, url: String, votes: Int): Poll  
  # updateOrCreatePoll(update: UpdatePoll!, create: CreatePoll!): Poll
}

type SigninPayload {
    token: String
    user: User
}

input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
}

input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
}

schema {
  query: Query
  mutation: Mutation
}

`
];
function buildFilters({ OR = [], title_contains, voteOptions_contains }) {
  const filter = title_contains || voteOptions_contains ? {} : null;
  if (title_contains) {
    filter.title = { $regex: `.*${title_contains}.*` };
  }
  if (voteOptions_contains) {
    filter.voteOptions = { $regex: `.*${voteOptions_contains}.*` };
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildFilters(OR[i]));
  }
  console.log("");
  return filters;
}

const rootResolvers = {
  Query: {
    allUsers: async (root, data, { mongo: { Users } }) => {
      // 1
      Users.find({}).toArray(); // 2
    },
    allPolls: async (root, { filter }, { mongo: { Polls, Users } }) => {
      let query = filter ? { $or: buildFilters(filter) } : {};
      return await Polls.find(query).toArray();
    },
    getPoll: async (root, { pollId }, { mongo: { Polls } }) => {
      console.log("executing get poll");
      return await Polls.findOne({ _id: pollId });
    },
    Poll: async (root, data, { mongo: { Polls } }) => {
      const grabId = data._id;
      const obj_id = new ObjectID(grabId);
      return await Polls.findOne(obj_id);
    }
  },
  Mutation: {
    // Add this block right after the `createLink` mutation resolver.
    createUser: async (root, data, { mongo: { Users } }) => {
      // You need to convert the given arguments into the format for the
      // `User` type, grabbing email and password from the "authProvider".
      const saltRounds = 12; // needed for bcrypt salting below
      const newUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.authProvider.email.email,
        // from: https://www.youtube.com/watch?v=eu2VJ9dtwiY
        password: await bcrypt.hash(
          data.authProvider.email.password,
          saltRounds
        )
      };

      const response = await Users.insert(newUser);
      return Object.assign({ id: response.insertedIds[0] }, newUser);
    },
    signinUser: async (root, data, { mongo: { Users } }) => {
      console.log("begin checking for user");
      console.log(data);
      const user = await Users.findOne({ email: data.email.email });
      console.log("*** user!!!");
      console.log(user);
      const valid = await bcrypt.compare(data.email.password, user.password);
      console.log(`*** valid? ${valid}`);
      if (valid) {
        console.log(`*** inside if executing?: ${valid}`);
        return { token: `token-${user.email}`, user };
      }
      return "Some kinda problem happened"; // { token: `token-${user.email}`, user };
    },
    createPoll: async (root, data, { mongo: { Polls, VoteOptions }, user }) => {
      let newOptions = data.options;
      newOptions = newOptions.toString().split(/\n/);
      data.options = newOptions;
      const newPoll = Object.assign(
        {
          postedById: user && user._id
        },
        data
      );
      const response = await Polls.insert(newPoll);
      const newVoteOption = {
        userId: user && user._id,
        pollId: new ObjectID(response.insertedIds[0])
      };
      let mappedOptions2 = newOptions.map(voteQuestion => {
        return {
          text: voteQuestion,
          userId: user && user._id,
          pollId: new ObjectID(response.insertedIds[0])
        };
      });
      const optionsResponse = await VoteOptions.insert(mappedOptions2);
      console.log("Writing to the VoteOptions collection");
      console.log(JSON.stringify(optionsResponse, null, 2));
      return Object.assign({ id: response.insertedIds[0] }, newPoll);
    },
    createVote: async (root, data, { mongo: { Votes }, user }) => {
      const newVote = {
        userId: user && user._id,
        voteOption: new ObjectID(data.voteOption)
      };
      console.log(newVote);
      const response = await Votes.insert(newVote);
      return Object.assign({ id: response.insertedIds[0] }, newVote);
    },
    createVoteOption: async (root, data, { mongo: { VoteOptions } }) => {
      const newVoteOption = {
        userId: user && user._id,
        pollId: new ObjectID(data.pollId)
      };
      return Object.assign({ id: response.insertedIds[0] }, newVoteOption);
    }
  },
  User: {
    id: root => root._id || root.id, // 5
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
      return await Votes.find({ userId: _id }).toArray();
    }
  },
  Poll: {
    id: root => root._id || root.id, // 5

    postedBy: async ({ postedById }, data, { dataloaders: { userLoader } }) => {
      return await userLoader.load(postedById).catch(error => {
        console.log(`Resolver 'postedBy' error ${error}`);
      });
    },
    voteOptions: async ({ _id }, data, { mongo: { VoteOptions } }) => {
      return await VoteOptions.find({ pollId: _id }).toArray();
    },
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
      return await Votes.find({ pollId: _id }).toArray();
    }
  },
  Vote: {
    id: root => root._id || root.id,

    user: async ({ userId }, data, { dataloaders: { userLoader } }) => {
      return await userLoader.load(userId).catch(error => {
        console.log(`Resolver 'postedBy' error ${error}`);
      });
    },
    voteOption: async ({ _id }, data, { mongo: { VoteOptions } }) => {
      return await VoteOptions.find({ pollId: _id }).toArray();
    }
  },
  VoteOption: {
    id: root => root._id || root.id,
    user: async ({ userId }, data, { dataloaders: { userLoader } }) => {
      return await userLoader.load(userId).catch(error => {
        console.log(`Resolver 'postedBy' error ${error}`);
      });
    },
    poll: async ({ pollId }, data, { mongo: { Polls } }) => {
      return await Polls.findOne({ _id: pollId });
    },
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
      return await Votes.find({ voteOption: _id }).toArray();
    },
    votesCount: async ({ _id }, data, { mongo: { Votes } }) => {
      let theCount = await Votes.find({ voteOption: _id }).toArray();
      return theCount.length;
    }
  }
};

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const schema = [...rootSchema];
const resolvers = merge(rootResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

addErrorLoggingToSchema(executableSchema, { log: e => console.log(e) });

module.exports = executableSchema;
/* eslint-enable */
