import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { MembershipType } from '../../types/membership';
import { getMemberships } from '../../loaders/membership-loader';

export const membershipsQuery = {
  type: new GraphQLList(MembershipType),
  description: 'Load All Memberships from Bb Course.',
  args: {
    courseId: { type: new GraphQLNonNull(GraphQLString) },
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { MembershipLoader }) => {
    if (args.refresh) {
      MembershipLoader.clearAll();
    }

    return getMemberships(args.courseId, args.limit, args.offset)
      .then((memberships: any) =>
        memberships.map((membership: any) =>
          MembershipLoader.load({courseId: membership.courseId, userId: membership.userId})
      ));
  }
};
