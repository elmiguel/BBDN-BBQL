'use strict';
import { GraphQLObjectType, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { MembershipType, MembershipInputType } from './membership';

export const UserMembershipsType = new GraphQLObjectType({
  name: 'UserMembershipsType',
  description: 'A collection of a user\'s membership objects.',
  fields: () => ({
    memberships: {
      type: new GraphQLList(MembershipType),
      resolve: (_: any, args: any, { MembershipUserLoader }) => {
        return MembershipUserLoader.load(args.id);
      }
    }
  })
});

export const UserMembershipsInputType = new GraphQLInputObjectType({
  name: 'UserMembershipsInputType',
  description: 'A collection of a user\'s membership objects.',
  fields: () => ({
    memberships: {
      type: new GraphQLList(MembershipInputType),
      resolve: (_: any, args: any, { MembershipUserLoader }) => {
        return MembershipUserLoader.load(args.id);
      }
    }
  })
});
