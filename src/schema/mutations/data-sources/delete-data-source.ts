
import { GraphQLNonNull, GraphQLString, GraphQLObjectType } from 'graphql';

const DeleteDataSourceMessageType = new GraphQLObjectType({
  name: 'DeleteSourceMessage',
  description: 'Message received when deleting an object',
  fields: () => ({
    message: { type: GraphQLString }
  })
});

export const DeleteDataSourceMutation = {
  type: DeleteDataSourceMessageType,
  args: {
    input: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, { input }, { DeleteDataSource }) => {
    return DeleteDataSource(input);
  }
};
