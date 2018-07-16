import {  GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { AnnouncementType } from '../../types/announcement';

export const announcementByIdQuery = {
  type: AnnouncementType,
  description: `
    Get a Annoucemewnt from Bb via the
      id: _x_1 (default: primary)`,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: GraphQLBoolean }
  },
  resolve: (_: any, args: any, { AnnouncementLoader }) => {
    if (args.refresh) {
      AnnouncementLoader.clear(args.id);
    }
    return AnnouncementLoader.load(args.id);
  }

};
