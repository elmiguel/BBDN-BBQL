import { GraphQLNonNull } from 'graphql';
import { DataSourceType, DataSourceInputType } from '../../types/data-source';

export const CreateDataSourceMutation = {
  type: DataSourceType,
  args: {
    input: { type: new GraphQLNonNull(DataSourceInputType) }
  },
  resolve: (_: any, { input }, { CreateDataSource }) => {
    return CreateDataSource(input);
  }
};
