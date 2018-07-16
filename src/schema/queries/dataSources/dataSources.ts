import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import { DataSourceType } from '../../types/data-source';
import { getDataSources } from '../../loaders/data-source-loader';

export const dataSourcesQuery = {
  type: new GraphQLList(DataSourceType),
  description: 'Load All Data Sources from Bb.',
  args: {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    refresh: { type: GraphQLBoolean }
  },
  resolve: async (_: any, args: any, { DataSourceLoader }) => {
    if (args.refresh) {
      DataSourceLoader.clearAll();
    }

    return await getDataSources(args.limit, args.offset)
    .then((dataSources: any) =>
      dataSources.map((dataSource: any) =>
        DataSourceLoader.load(dataSource.id)));
  }
};
