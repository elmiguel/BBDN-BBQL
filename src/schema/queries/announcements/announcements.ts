import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import { getAnnouncements } from '../../loaders/announcement-loader';
import { AnnouncementType } from '../../types/announcement';

export const announcementsQuery = {
  type: new GraphQLList(AnnouncementType),
  description: 'Load All Announcements from Bb.',
  args: {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    refresh: { type: GraphQLBoolean }
  },
  resolve: async (_: any, args: any, { AnnouncementLoader }) => {
    if (args.refresh) {
      AnnouncementLoader.clearAll();
    }
    return await getAnnouncements(args.limit, args.offset)
      .then((announcements: any) => announcements.map((announcement: any) => AnnouncementLoader.load(announcement.id)));

  }
};
