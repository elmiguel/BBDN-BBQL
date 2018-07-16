import { GraphQLString } from 'graphql';

export const clearCacheQuery = {
  type: GraphQLString,
  description: `
    Clear Cache Busting via specific Loader or All (default).
  `,
  args: {
    loader: { type: GraphQLString }
  },
  resolve: async (_: any, args: any, context: any) => {
    let msg = 'Complete Cache Cleared!';
    if (args.loader) {
      context[args.loader].clearAll();
      msg = `${args.loader} Cache Cleared!`;
    } else {
      context.CourseLoader.clearAll();
      context.DataSourceLoader.clearAll();
      context.MembershipLoader.clearAll();
      context.UserLoader.clearAll();
    }

    return await msg;
  }
};
