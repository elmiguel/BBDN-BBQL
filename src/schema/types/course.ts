'use strict';
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { DataSourceType } from './data-source';

const _courseDuration = {
  type: { type: GraphQLString },
  start: { type: GraphQLString },
  end: { type: GraphQLString },
  daysOfUse: { type: GraphQLInt }
};

const CourseDuration = new GraphQLObjectType({
  name: 'CourseDuration',
  description: 'A Coures\'s description field.',
  fields: () => _courseDuration
});

const CourseInputDuration = new GraphQLInputObjectType({
  name: 'CourseInputDuration',
  description: 'A Coures\'s description field.',
  fields: () => _courseDuration
});

const _courseAvailability = {
  available: { type: GraphQLString },
  duration: { type: CourseDuration }
};

const _courseInputAvailability = {
  available: { type: GraphQLString },
  duration: { type: CourseInputDuration }
};

const CourseAvailability = new GraphQLObjectType({
  name: 'CourseAvailability',
  description: 'A Blackboard Course Object',
  fields: () => _courseAvailability
});

const CourseInputAvailability = new GraphQLInputObjectType({
  name: 'CourseInputAvailability',
  description: 'A Blackboard Course Object',
  fields: () => _courseInputAvailability
});

const _courseEnrollment = {
  type: { type: GraphQLString },
  start: { type: GraphQLString },
  end: { type: GraphQLString },
  accessCode: { type: GraphQLString }
};

const CourseEnrollment = new GraphQLObjectType({
  name: 'CourseEnrollment',
  description: 'Determines the course enrollment type',
  fields: () => _courseEnrollment
});

const CourseInputEnrollment = new GraphQLInputObjectType({
  name: 'CourseInputEnrollment',
  description: 'Determines the course enrollment type',
  fields: () => _courseEnrollment
});

const _courseLocale = {
  id: { type: GraphQLString },
  force: { type: GraphQLBoolean }
};

const CourseLocale = new GraphQLObjectType({
  name: 'CourseLocale',
  description: 'Describes the course\'s locale setting.',
  fields: () => _courseLocale
});

const CourseInputLocale = new GraphQLInputObjectType({
  name: 'CourseInputLocale',
  description: 'Describes the course\'s locale setting.',
  fields: () => _courseLocale
});

export const CourseType = new GraphQLObjectType({
  name: 'CourseType',
  description: 'A Blackboard Course Object',
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
    courseId: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    created: { type: GraphQLString },
    organization: { type: GraphQLBoolean },
    ultraStatus: { type: GraphQLString },
    allowGuests: { type: GraphQLBoolean },
    readOnly: { type: GraphQLBoolean },
    termId: { type: GraphQLString },
    availability: { type: CourseAvailability },
    enrollment: { type: CourseEnrollment },
    locale: { type: CourseLocale },
    hasChildren: { type: GraphQLBoolean },
    parentId: { type: GraphQLString },
    externalAccessUrl: { type: GraphQLString },
    guestAccessUrl: { type: GraphQLString }
  })
});

export const CourseInputType = new GraphQLInputObjectType({
  name: 'CourseInput',
  description: 'A Blackboard Course Object',
  fields: () => ({
    externalId: { type:  new GraphQLNonNull(GraphQLString) },
    dataSourceId: { type: GraphQLString },
    courseId: { type:  new GraphQLNonNull(GraphQLString) },
    name:  { type:  new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    organization: { type: GraphQLBoolean },
    ultraStatus: { type: GraphQLString },
    allowGuests: { type: GraphQLBoolean },
    readOnly: { type: GraphQLBoolean },
    termId: { type: GraphQLString },
    availability: { type: CourseInputAvailability },
    enrollment: { type: CourseInputEnrollment },
    locale: { type: CourseInputLocale },
    hasChildren: { type: GraphQLBoolean }
  })
});
