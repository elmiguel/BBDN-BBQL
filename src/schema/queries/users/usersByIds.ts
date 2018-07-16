import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { UserType } from '../../types/user';

export const userByIdsQuery = {
  type: new GraphQLList(UserType),
  description: `
    Get a Group of Users from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>,
      userName:<userName>, or
      uuid:<uuid>.`,
  args: {
    ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { UserLoader }) => {
    if (args.refresh) {
      args.ids.map((id: any) => UserLoader.clear(id));
    }
    return UserLoader.loadMany(args.ids);
  }
};
