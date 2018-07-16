import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { UserMembershipsType } from '../../types/user-membership';

export const membershipsByUserIdQuery = {
  type: UserMembershipsType,
  description: `
    Get Memberships By User Id from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>`,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: async (_: any, args: any, { MembershipUserLoader }) => {
    if (args.refresh) {
      MembershipUserLoader.clear(args.id);
    }
    return await MembershipUserLoader.load(args.id);
  }

};
