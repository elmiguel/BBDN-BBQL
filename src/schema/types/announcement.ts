'use strict';
import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';

const AnnouncementDuration = new GraphQLObjectType({
  name: 'AnnouncementDuration',
  description: '',
  fields: () => ({
    type: { type: GraphQLString },
    start: { type: GraphQLString },
    end: { type: GraphQLString }
  })
});

const AnnouncementAvailability = new GraphQLObjectType({
  name: 'AnnouncementAvailability',
  description: '',
  fields: () => ({
    duration: { type: AnnouncementDuration }
  })
});

export const AnnouncementType = new GraphQLObjectType({
  name: 'AnnouncementType',
  description: 'A Blackboard Announcement Learn Object',
  fields: () => ({
    _id: { type: GraphQLString },
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    availability: { type: AnnouncementAvailability },
    showAtLogin: { type: GraphQLBoolean },
    showInCourses: { type: GraphQLBoolean },
    created: { type: GraphQLString }
  })
});
