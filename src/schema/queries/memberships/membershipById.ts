import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { MembershipType } from '../../types/membership';

export const membershipByIdQuery = {
  type: MembershipType,
  description: `
    Get a Membership from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>`,
  args: {
    courseId: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { MembershipLoader }) => {
    if (args.refresh) {
      MembershipLoader.clear(args.id);
    }
    return MembershipLoader.load({ courseId: args.courseId, userId: args.id });
  }

};
