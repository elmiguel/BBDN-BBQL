import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import { UserType } from '../../types/user';
import { getUsers } from '../../loaders/user-loader';

export const usersQuery = {
  type: new GraphQLList(UserType),
  description: 'Load All Users from Bb.',
  args: {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    refresh: { type: GraphQLBoolean }
  },
  resolve: async (_: any, args: any, { UserLoader }) => {
    if (args.refresh) {
      UserLoader.clearAll();
    }
    return await getUsers(args.limit, args.offset)
      .then((users: any) => users.map((user: any) => UserLoader.load(user.id)));

  }
};
