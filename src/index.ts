import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import { ResolverMap } from "./types/resolverTypes";
import { User } from "./entity/User";
import { Profile } from "./entity/Profile";

const typeDefs = `
  type User {
    id: Int!
    firstName: String!
    profile: Profile!
  }
  type Profile{
    id: Int!
    gender: String
    photo:  String
  }
  input ProfileInput{
    gender: String!
    photo:  String!
  }
  type Query {
    hello(name: String): String!
    user(id: Int!): User!
    users: [User!]!
  }
  type Mutation {
    createUser(firstName: String!, profile :ProfileInput): User!
    updateUser(id: Int!, firstName: String, lastName: String, age: Int, email: String): Boolean
    deleteUser(id: Int!): Boolean
  }
`;

const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: any) => `Hello ${name || "World"}`,
    user: (_, { id }) => User.findByIds(id, { relations: ["profile"] }),
    users: () => User.find(),
  },
  Mutation: {
    createUser: async (_, args) => {
      const profile = await Profile.save({ ...args.profile });

      const user = await User.create({
        firstName: args.firstName,
        profileId: profile.id,
      });
      return {
        ...user,
        profile,
      };
    },

    updateUser: async (_, { id, ...args }) => {
      try {
        await User.update(id, args);
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },
    deleteUser: async (_, { id }) => {
      try {
        await User.delete(id);
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
