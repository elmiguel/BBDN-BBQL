import { UserType, UserInputType } from '../../types/user';
import { GraphQLNonNull } from 'graphql';

export const CreateUserMutation = {
  type: UserType,
  args: {
    input: { type: new GraphQLNonNull(UserInputType) }
  },
  resolve: (_: any, { input }, { CreateUser }) => {
    return CreateUser(input);
  }
};
