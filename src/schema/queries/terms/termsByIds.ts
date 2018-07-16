import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { TermType } from '../../types/term';

export const termsByIdsQuery = {
  type: new GraphQLList(TermType),
  description: `
    Get a Group of Terms from Bb via the
      id: _x_1 (default: primary)`,
  args: {
    ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { TermLoader }) => {
    if (args.refresh) {
      args.ids.map((id: any) => TermLoader.clear(id));
    }
    return TermLoader.loadMany(args.ids);
  }
};
