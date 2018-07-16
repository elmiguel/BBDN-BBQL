
import { GraphQLNonNull, GraphQLString, GraphQLObjectType } from 'graphql';

const DeleteUserMessageType = new GraphQLObjectType({
  name: 'DeleteUserMessage',
  description: 'Message received when deleting an object',
  fields: () => ({
    message: { type: GraphQLString }
  })
});

export const DeleteUserMutation = {
  type: DeleteUserMessageType,
  args: {
    input: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, { input }, { DeleteUser }) => {
    return DeleteUser(input);
  }
};
