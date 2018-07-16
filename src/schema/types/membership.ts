'use strict';
import { GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { UserType } from './user';
import { DataSourceType } from './data-source';
import { CourseType } from './course';

const _membershipAvailability = {
  available: { type: GraphQLString }
};

const MembershipAvailability = new GraphQLObjectType({
  name: 'MembershipAvailability',
  description: 'A Courses Member\'s availability',
  fields: () => _membershipAvailability
});

const MembershipInputAvailability = new GraphQLInputObjectType({
  name: 'MembershipInputAvailability',
  description: 'A Courses Member\'s availability',
  fields: () => _membershipAvailability
});

export const MembershipType = new GraphQLObjectType({
  name: 'MembershipType',
  description: 'A Blackboard Membership Learn Object',
  fields: () => (    {
    _id: { type: GraphQLString },
    userId: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: (_: any, args: any, { UserLoader }) => {
        return UserLoader.load(_.userId);
      }
    },
    courseId: { type: GraphQLString },
    course: {
      type: CourseType,
      resolve: ((_: any, args: any, { CourseLoader }) => {
        return CourseLoader.load(_.courseId);
      })
    },
    childCourseId: { type: GraphQLString },
    childCourse: {
      type: CourseType,
      resolve: ((_: any, args: any, { CourseLoader }) => {
        return CourseLoader.load(_.childCourseId);
      })
    },
    dataSource: {
      type: DataSourceType,
      resolve: (_: any, args: any, { DataSourceLoader }) => {
        return DataSourceLoader.load(_.dataSourceId);
      }
    },
    created: { type: GraphQLString },
    availability: { type: MembershipAvailability },
    courseRoleId: { type: GraphQLString },
    bypassCourseAvailabilityUntil: { type: GraphQLString },
    lastAccessed: { type: GraphQLString }
  })
});

export const MembershipInputType = new GraphQLInputObjectType({
  name: 'MembershipInputType',
  description: 'A Blackboard Membership Learn Object',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    courseId: { type: new GraphQLNonNull(GraphQLString) },
    dataSourceId: { type: GraphQLString },
    availability: { type: MembershipInputAvailability },
    courseRoleId: { type: GraphQLString }
  })
});
