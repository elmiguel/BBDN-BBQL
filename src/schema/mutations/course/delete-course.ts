
import { GraphQLNonNull, GraphQLString, GraphQLObjectType } from 'graphql';

const DeleteCourseMessageType = new GraphQLObjectType({
  name: 'DeleteCourseMessage',
  description: 'Message received when deleting an object',
  fields: () => ({
    message: { type: GraphQLString }
  })
});

export const DeleteCourseMutation = {
  type: DeleteCourseMessageType,
  args: {
    input: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, { input }, { DeleteCourse }) => {
    return DeleteCourse(input);
  }
};
