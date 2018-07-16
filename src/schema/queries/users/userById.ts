import {  GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { UserType } from '../../types/user';

export const userByIdQuery = {
  type: UserType,
  description: `
    Get a User from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>,
      userName:<userName>, or
      uuid:<uuid>.`,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { UserLoader }) => {
    if (args.refresh) {
      UserLoader.clear(args.id);
    }
    return UserLoader.load(args.id);
  }

};
