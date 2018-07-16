
import { GraphQLNonNull } from 'graphql';
import { MembershipInputType, MembershipType } from '../../types/membership';

export const UpdateMembershipMutation = {
  type: MembershipType,
  args: {
    input: { type: new GraphQLNonNull(MembershipInputType) }
  },
  resolve: (_: any, { input }, { UpdateMembership }) => {
    return UpdateMembership(input);
  }
};
