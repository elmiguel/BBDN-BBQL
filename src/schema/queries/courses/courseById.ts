import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';

import { CourseType } from '../../types/course';
export const courseByIdQuery = {
  type: CourseType,
  description: `
    Get a Course from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>,
      courseId:<courseId>, or
      uuid:<uuid>.`,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { CourseLoader }) => {
    if (args.refresh) {
      CourseLoader.clear(args.id);
    }
    return CourseLoader.load(args.id);
  }
};
