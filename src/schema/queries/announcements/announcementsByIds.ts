import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { AnnouncementType } from '../../types/announcement';

export const announcementsByIdsQuery = {
  type: new GraphQLList(AnnouncementType),
  description: `
    Get a Group of Announcements from Bb via the
      id: _x_1 (default: primary)`,
  args: {
    ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { AnnouncementLoader }) => {
    if (args.refresh) {
      args.ids.map((id: any) => AnnouncementLoader.clear(id));
    }
    return AnnouncementLoader.loadMany(args.ids);
  }
};
