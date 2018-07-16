import {  GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { TermType } from '../../types/term';

export const termByIdQuery = {
  type: TermType,
  description: `
    Get a Term from Bb via the
      id: _x_1 (default: primary)`,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { TermLoader }) => {
    if (args.refresh) {
      TermLoader.clear(args.id);
    }
    return TermLoader.load(args.id);
  }

};
