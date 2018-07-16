'use strict';
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { DataSourceType } from './data-source';

const TermDuration = new GraphQLObjectType({
  name: 'TermDuration',
  description: 'A Coures\'s description field.',
  fields: () => ({
    type: { type: GraphQLString },
    start: { type: GraphQLString },
    end: { type: GraphQLString },
    daysOfUse: { type: GraphQLInt }
  })
});

const TermAvailability = new GraphQLObjectType({
  name: 'TermAvailability',
  description: 'A Blackboard Term Availability Object',
  fields: () => ({
    available: { type: GraphQLString },
    duration: { type: TermDuration }
  })
});

export const TermType = new GraphQLObjectType({
  name: 'TermType',
  description: 'A Blackboard Term Learn Object',
  fields: () => ({
    id: { type: GraphQLString },
    externalId: { type: GraphQLString },
    dataSource: {
      type: DataSourceType,
      resolve: (_: any, args: any, { DataSourceLoader }) => {
        return DataSourceLoader.load(_.dataSourceId);
      }
    },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    availability: { type: TermAvailability }
  })
});
