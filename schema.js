/*eslint-disable */
const { merge } = require("lodash");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const {
  makeExecutableSchema,
  addErrorLoggingToSchema
} = require("graphql-tools");

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
}

type Vote {
  id: ID!
  user: User!
  poll: Poll!
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
  options_contains: String
}

type Mutation {
  # Make a person!
  createUser(firstName: String!, lastName: String!, authProvider: AuthProviderSignupData!): User
  signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
  createPoll(title: String!, options: [String!]!): Poll
  createVote(pollId: ID!): Vote
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
function buildFilters({ OR = [], title_contains, options_contains }) {
  const filter = title_contains || options_contains ? {} : null;
  if (title_contains) {
    filter.title = { $regex: `.*${title_contains}.*` };
  }
  if (options_contains) {
    filter.options = { $regex: `.*${options_contains}.*` };
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildFilters(OR[i]));
  }
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
      console.log("pollId = " + JSON.stringify(data, null, 2));
      const grabId = data._id;
      console.log("grabId = " + JSON.stringify(grabId, null, 2));

      var obj_id = new ObjectID(grabId);
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
    createPoll: async (root, data, { mongo: { Polls }, user }) => {
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
      return Object.assign({ id: response.insertedIds[0] }, newPoll);
    },
    createVote: async (root, data, { mongo: { Votes }, user }) => {
      const newVote = {
        userId: user && user._id,
        pollId: new ObjectID(data.pollId)
      };
      const response = await Votes.insert(newVote);
      return Object.assign({ id: response.insertedIds[0] }, newVote);
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
    postedBy: async ({ postedById }, data, { mongo: { Users } }) => {
      return await userLoader.load(postedById);
    },
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
      return await Votes.find({ pollId: _id }).toArray();
    }
  },
  Vote: {
    id: root => root._id || root.id,

    user: async ({ userId }, data, { mongo: { Users } }) => {
      return await Users.findOne({ _id: userId });
    },
    poll: async ({ pollId }, data, { mongo: { Polls } }) => {
      let newPollId = pollId;
      return await Polls.findOne({ _id: newPollId });
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
