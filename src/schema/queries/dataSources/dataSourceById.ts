import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { DataSourceType } from '../../types/data-source';

export const dataSourceByIdQuery = {
  type: DataSourceType,
  description: `
    Get a Data Source from Bb via the
      id: _x_1 (default: primary),
      externalId:<id>`,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { DataSourceLoader }) => {
    if (args.refresh) {
      DataSourceLoader.clear(args.id);
    }

    return DataSourceLoader.load(args.id);
  }
};
