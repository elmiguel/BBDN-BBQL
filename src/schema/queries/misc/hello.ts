import { GraphQLString } from 'graphql';

export const helloQuery = {
  type: GraphQLString,
  description: 'Basic Hello World example.',
  resolve: () => 'Hello from BbQL!!'
};
