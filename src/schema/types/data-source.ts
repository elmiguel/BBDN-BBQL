'use strict';
import { GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';

export const DataSourceType = new GraphQLObjectType({
  name: 'DataSource',
  description: 'A Blackboard Data Source Learn Object',
  fields: () => ({
    _id: { type: GraphQLString },
    id: { type: GraphQLString },
    externalId: { type: GraphQLString },
    description: { type: GraphQLString }
  })
});
export const DataSourceInputType = new GraphQLInputObjectType({
  name: 'DataSourceInput',
  description: 'A Blackboard Data Source Learn Object',
  fields: () => ({
    externalId: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  })
});
