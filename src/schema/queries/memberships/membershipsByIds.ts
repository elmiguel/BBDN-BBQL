import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { MembershipType } from '../../types/membership';

export const membershipsByIdsQuery = {
  type: new GraphQLList(MembershipType),
  description: `
    Get a Group of Memberships from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>`,
  args: {
    courseId: { type: new GraphQLNonNull(GraphQLString) },
    ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { MembershipLoader }) => {
    if (args.refresh) {
      args.ids.map((id: any) => MembershipLoader.clear(id));
    }

    return MembershipLoader.loadMany([{ courseId: args.courseId, userId: args.ids }]);
  }
};
