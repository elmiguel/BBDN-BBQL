'use strict';
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { DataSourceType } from './data-source';
import { MembershipType } from './membership';

const _userAvailability = {
  available: { type: GraphQLString }
};

const UserAvailability = new GraphQLObjectType({
  name: 'UserAvailability',
  description: 'Determines the availability of the User.',
  fields: () => _userAvailability
});
const UserInputAvailability = new GraphQLInputObjectType({
  name: 'UserInputAvailability',
  description: 'Determines the availability of the User.',
  fields: () => _userAvailability
});

const _userName = {
  given: { type: new GraphQLNonNull(GraphQLString) },
  family: { type: new GraphQLNonNull(GraphQLString) },
  middle: { type: GraphQLString },
  title: { type: GraphQLString },
  other: { type: GraphQLString },
  suffix: { type: GraphQLString }
};

const UserName = new GraphQLObjectType({
  name: 'UserName',
  description: 'User name Object: First, Last, Middle, ...',
  fields: () => _userName
});

const UserInputName = new GraphQLInputObjectType({
  name: 'UserInputName',
  description: 'User name Object: First, Last, Middle, ...',
  fields: () => _userName
});

const _userContact = {
  homePhone: { type: GraphQLString },
  mobilePhone: { type: GraphQLString },
  businessPhone: { type: GraphQLString },
  businessFax: { type: GraphQLString },
  email: { type: GraphQLString },
  webPage: { type: GraphQLString }
};

const UserContact = new GraphQLObjectType({
  name: 'UserContact',
  description: 'User\'s email address',
  fields: () => _userContact
});
const UserInputContact = new GraphQLInputObjectType({
  name: 'UserInputContact',
  description: 'User\'s email address',
  fields: () => _userContact
});

const _userJob = {
  title: { type: GraphQLString },
  department: { type: GraphQLString },
  company: { type: GraphQLString }
};

const UserJob = new GraphQLObjectType({
  name: 'UserJob',
  description: 'User\'s Job Descriptional Object',
  fields: () => _userJob
});

const UserInputJob = new GraphQLInputObjectType({
  name: 'UserInputJob',
  description: 'User\'s Job Descriptional Object',
  fields: () => _userJob
});

const _userAddress = {
  street1: { type: GraphQLString },
  street2: { type: GraphQLString },
  city: { type: GraphQLString },
  state: { type: GraphQLString },
  zipCode: { type: GraphQLString },
  country: { type: GraphQLString }
};

const UserAddress = new GraphQLObjectType({
  name: 'UserAddress',
  description: 'User\'s address object',
  fields: () => _userAddress
});

const UserInputAddress = new GraphQLInputObjectType({
  name: 'UserInputAddress',
  description: 'User\'s address object',
  fields: () => _userAddress
});

const _userLocale = {
  id: { type: GraphQLString },
  calendar: { type: GraphQLString },
  firstDayOfWeek: { type: GraphQLString }
};

const UserLocale = new GraphQLObjectType({
  name: 'UserLocale',
  description: 'User\'s locale preference',
  fields: () => _userLocale
});

const UserInputLocale = new GraphQLInputObjectType({
  name: 'UserInputLocale',
  description: 'User\'s locale preference',
  fields: () => _userLocale
});

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'A Blackboard User Object',
  fields: () => ({
    _id: { type: GraphQLString },
    id: { type: GraphQLString },
    uuid: { type: GraphQLString },
    externalId: { type: GraphQLString },
    dataSource: {
      type: DataSourceType,
      resolve: (_: any, args: any, { DataSourceLoader }) => {
        return DataSourceLoader.load(_.dataSourceId);
      }
    },
    userName: { type: GraphQLString },
    studentId: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    educationLevel: { type: GraphQLString },
    gender: { type: GraphQLString },
    created: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    systemRoleIds: { type: new GraphQLList(GraphQLString) },
    institutionRoleIds: { type: new GraphQLList(GraphQLString) },
    availability: { type: UserAvailability },
    name: { type: UserName },
    job: { type : UserJob },
    contact: { type: UserContact },
    address: { type: UserAddress },
    locale: { type: UserLocale },
    memberships: {
      type: new GraphQLList(MembershipType),
      resolve: (_: any, args: any, { MembershipUserLoader }) => {
        return MembershipUserLoader.load(args.id);
      }
    }
  })
});

export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  description: 'A Blackboard User Object',
  fields: () => ({
    uuid: { type: GraphQLString },
    externalId: { type: GraphQLString },
    dataSourceId: { type: GraphQLString },
    userName: { type: GraphQLString },
    password: { type: new GraphQLNonNull(GraphQLString) },
    studentId: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    educationLevel: { type: GraphQLString },
    gender: { type: GraphQLString },
    created: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    systemRoleIds: { type: new GraphQLList(GraphQLString) },
    institutionRoleIds: { type: new GraphQLList(GraphQLString) },
    availability: { type: UserInputAvailability },
    name: { type: UserInputName },
    job: { type : UserInputJob },
    contact: { type: UserInputContact },
    address: { type: UserInputAddress },
    locale: { type: UserInputLocale }
  })
});
