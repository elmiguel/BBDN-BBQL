
import { GraphQLNonNull } from 'graphql';
import { CourseType, CourseInputType } from '../../types/course';

export const CreateCourseMutation = {
  type: CourseType,
  args: {
    input: { type: new GraphQLNonNull(CourseInputType) }
  },
  resolve: (_: any, { input }, { CreateCourse }) => {
    return CreateCourse(input);
  }
};
