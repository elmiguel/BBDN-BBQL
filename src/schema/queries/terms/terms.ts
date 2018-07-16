import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import { getTerms } from '../../loaders/term-loader';
import { TermType } from '../../types/term';

export const termsQuery = {
  type: new GraphQLList(TermType),
  description: 'Load All Terms from Bb.',
  args: {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    refresh: { type: GraphQLBoolean }
  },
  resolve: async (_: any, args: any, { TermLoader }) => {
    if (args.refresh) {
      TermLoader.clearAll();
    }
    return await getTerms(args.limit, args.offset)
      .then((terms: any) => terms.map((term: any) => TermLoader.load(term.id)));

  }
};
