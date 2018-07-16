import { GraphQLNonNull } from 'graphql';
import { MembershipType, MembershipInputType } from '../../types/membership';

export const CreateMembershipMutation = {
  type: MembershipType,
  args: {
    input: { type: new GraphQLNonNull(MembershipInputType) }
  },
  resolve: (_: any, { input }, { CreateMembership }) => {
    return CreateMembership(input);
  }
};
