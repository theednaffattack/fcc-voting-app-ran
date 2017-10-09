/*eslint-disable */
const { merge } = require("lodash");
const {
  makeExecutableSchema,
  addErrorLoggingToSchema
} = require("graphql-tools");
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
}

type Poll {
  id: ID!
  title: String!
  options: [String!]!
}

type Query {
  # User
  user: User
  allUsers: [User!]!
  poll: Poll
  allPolls: [Poll!]!
}

type Mutation {
  # Make a person!
  createUser(firstName: String!, lastName: String!, authProvider: AuthProviderSignupData!): User
  signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
  createPoll(title: String!, options: [String!]!): Poll
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

const rootResolvers = {
  Query: {
    allUsers: async (root, data, { mongo: { Users } }) => {
      // 1
      Users.find({}).toArray(); // 2
    },
    allPolls: async (root, data, { mongo: { Polls } }) => {
      Polls.find({}).toArray();
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
        password: await bcrypt.hash(
          data.authProvider.email.password,
          saltRounds
        )
      };
      // from: https://www.youtube.com/watch?v=eu2VJ9dtwiY
      // const hashedPassword =

      // bcrypt.hash(
      //   newUser.password,
      //   saltRounds,
      //   (err, hash) => {
      //     // I can make this async and get rid of the callback
      //     // Store hash in your password DB.
      //     newUser.password = hash;
      //     return newUser.password;
      //   }
      // );
      // newUser.password = bcrypt.hash("bacon", null, null, function(err, hash) {
      //   // Store hash in your password DB.
      // });
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
      // if (data.email.password === user.password) {
      //   return { token: `token-${user.email}`, user };
      // }
      // if (!valid) {
      //   throw Error("Incorrect password sucka!");
      // }
      // console.log("checked & decoded the hashed password");
      // return { token: `token-${user.email}`, user };
    },
    createPoll: async (root, data, { mongo: { Polls } }) => {
      let newOptions = data.options;
      newOptions = newOptions.toString().split(/\n/);
      const newPoll = {
        title: data.title,
        options: newOptions
      };
      const response = await Polls.insert(newPoll);
      return Object.assign({ id: response.insertedIds[0] }, newPoll);
    }
  },
  User: {
    id: root => root._id || root.id // 5
  },
  Poll: {
    id: root => root._id || root.id // 5
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
