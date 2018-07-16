
import { GraphQLNonNull, GraphQLString, GraphQLObjectType } from 'graphql';
import { MembershipInputType } from '../../types/membership';

const DeleteMembershipMessageType = new GraphQLObjectType({
  name: 'DeleteMembershipMessageType',
  description: 'Message received when deleting an object',
  fields: () => ({
    message: { type: GraphQLString }
  })
});

export const DeleteMembershipMutation = {
  type: DeleteMembershipMessageType,
  args: {
    input: { type: new GraphQLNonNull(MembershipInputType) }
  },
  resolve: (_: any, { input }, { DeleteMembership }) => {
    return DeleteMembership(input);
  }
};
