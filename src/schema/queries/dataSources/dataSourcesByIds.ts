import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { DataSourceType } from '../../types/data-source';

export const dataSourcesByIdsQuery = {
  type: new GraphQLList(DataSourceType),
  description: `
    Get a Group of DataSources from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>`,
  args: {
    ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { DataSourceLoader }) => {
    if (args.refresh) {
      args.ids.map((id: any) => DataSourceLoader.clear(id));
    }
    return DataSourceLoader.loadMany(args.ids);
  }
};
