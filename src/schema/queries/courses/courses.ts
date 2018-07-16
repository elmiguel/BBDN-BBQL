import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import { CourseType } from '../../types/course';
import { getCourses } from '../../loaders/course-loader';

export const coursesQuery = {
  type: new GraphQLList(CourseType),
  description: 'Load All Courses from Bb.',
  args: {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { CourseLoader }) => {
    if (args.refresh) {
      CourseLoader.clearAll();
    }
    return getCourses(args.limit, args.offset)
      .then((courses: any) =>
      courses.map((course: any) =>
        CourseLoader.load(courses.id)));
  }
};
