import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { CourseType } from '../../types/course';


export const coursesByIdsQuery = {
  type: new GraphQLList(CourseType),
  description: `
    Get a Group of Courses from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>,
      courseId:<courseId>, or
      uuid:<uuid>.`,
  args: {
    ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { CourseLoader }) => {
    if (args.refresh) {
      args.ids.map((id: any) => CourseLoader.clear(id));
    }
    return CourseLoader.loadMany(args.ids);
  }
};
