
import { GraphQLNonNull } from 'graphql';
import { CourseType, CourseInputType } from '../../types/course';

export const UpdateCourseMutation = {
  type: CourseType,
  args: {
    input: { type: new GraphQLNonNull(CourseInputType) }
  },
  resolve: (_: any, { input }, { UpdateCourse }) => {
    return UpdateCourse(input);
  }
};
