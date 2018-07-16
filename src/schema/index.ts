import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { membershipsQuery } from './queries/memberships/memberships';
import { membershipsByIdsQuery } from './queries/memberships/membershipsByIds';
import { membershipByIdQuery } from './queries/memberships/membershipById';
import { userByIdsQuery } from './queries/users/usersByIds';
import { usersQuery } from './queries/users/users';
import { userByIdQuery } from './queries/users/userById';
import { coursesByIdsQuery } from './queries/courses/coursesByIds';
import { coursesQuery } from './queries/courses/courses';
import { courseByIdQuery } from './queries/courses/courseById';
import { dataSourcesByIdsQuery } from './queries/dataSources/dataSourcesByIds';
import { dataSourcesQuery } from './queries/dataSources/dataSources';
import { dataSourceByIdQuery } from './queries/dataSources/dataSourceById';
import { helloQuery } from './queries/misc/hello';
import { clearCacheQuery } from './queries/misc/clearCache';
import { membershipsByUserIdQuery } from './queries/memberships/membershipsByUserId';
import { announcementsQuery } from './queries/announcements/announcements';
import { announcementByIdQuery } from './queries/announcements/announcementById';
import { announcementsByIdsQuery } from './queries/announcements/announcementsByIds';
import { termsQuery } from './queries/terms/terms';
import { termsByIdsQuery } from './queries/terms/termsByIds';
import { termByIdQuery } from './queries/terms/termById';
import { CreateUserMutation } from './mutations/users/create-user';
import { DeleteUserMutation } from './mutations/users/delete-user';
import { UpdateUserMutation } from './mutations/users/update-user';
import { CreateCourseMutation } from './mutations/course/create-course';
import { DeleteCourseMutation } from './mutations/course/delete-course';
import { UpdateCourseMutation } from './mutations/course/update-course';
import { CreateMembershipMutation } from './mutations/memberships/create-membership';
import { DeleteMembershipMutation } from './mutations/memberships/delete-membership';
import { UpdateMembershipMutation } from './mutations/memberships/update-membership';
import { CreateDataSourceMutation } from './mutations/data-sources/create-data-source';
import { DeleteDataSourceMutation } from './mutations/data-sources/delete-data-source';
import { UpdateDataSourceMutation } from './mutations/data-sources/update-data-source';

const RootQueryType = new GraphQLObjectType({
  name:  'RootQueryType',
  description: 'A set of BbQL Queries for your appetite!',
  fields: () => ({
    hello: helloQuery,
    announcements: announcementsQuery,
    announcementById: announcementByIdQuery,
    announcementsByIds: announcementsByIdsQuery,
    usersByIds: userByIdsQuery,
    users: usersQuery,
    userById: userByIdQuery,
    coursesByIds: coursesByIdsQuery,
    courses: coursesQuery,
    courseById: courseByIdQuery,
    dataSourcesByIds: dataSourcesByIdsQuery,
    dataSources: dataSourcesQuery,
    dataSourceById: dataSourceByIdQuery,
    membershipsByIds: membershipsByIdsQuery,
    memberships: membershipsQuery,
    membershipById: membershipByIdQuery,
    membershipsByUserId: membershipsByUserIdQuery,
    terms: termsQuery,
    termById: termByIdQuery,
    termsByIds: termsByIdsQuery,
    clearCache: clearCacheQuery
  })
});

const RootMutationType = new GraphQLObjectType({
  name:  'RootMutationType',
  description: 'A set of BbQL Mutation for your appetite!',
  fields: () => ({
    createDataSource: CreateDataSourceMutation,
    deleteDataSource: DeleteDataSourceMutation,
    updateDataSource: UpdateDataSourceMutation,
    createUser: CreateUserMutation,
    deleteUser: DeleteUserMutation,
    updateUser: UpdateUserMutation,
    createCourse: CreateCourseMutation,
    deleteCourse: DeleteCourseMutation,
    updateCourse: UpdateCourseMutation,
    createMembership: CreateMembershipMutation,
    deleteMembership: DeleteMembershipMutation,
    updateMembership: UpdateMembershipMutation
  })
});

export const BbQLSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});
