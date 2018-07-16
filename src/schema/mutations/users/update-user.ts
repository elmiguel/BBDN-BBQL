import { UserType, UserInputType } from '../../types/user';
import { GraphQLNonNull } from 'graphql';

export const UpdateUserMutation = {
  type: UserType,
  args: {
    input: { type: new GraphQLNonNull(UserInputType) }
  },
  resolve: (_: any, { input }, { UpdateUser }) => {
    return UpdateUser(input);
  }
};
