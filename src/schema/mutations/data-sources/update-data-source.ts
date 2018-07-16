import { GraphQLNonNull } from 'graphql';
import { DataSourceType, DataSourceInputType } from '../../types/data-source';


export const UpdateDataSourceMutation = {
  type: DataSourceType,
  args: {
    input: { type: new GraphQLNonNull(DataSourceInputType) }
  },
  resolve: (_: any, { input }, { UpdateDataSource }) => {
    return UpdateDataSource(input);
  }
};
