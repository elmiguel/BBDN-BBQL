'use strict';
import * as express from 'express';
import {
  users,
  courses,
  setupRouterParams,
  sendData,
  memberships,
  announcements,
  courseRoles,
  systemRoles,
  institutionRoles,
  dataSources,
  courseChildren} from './rest-utils';

export const restAPIRouter = express.Router();

setupRouterParams(restAPIRouter);

restAPIRouter.all('/users/:userId/courses', [memberships], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log(req.user);
    console.log(req.memberships.length);
  }

  sendData(res, req.memberships);
});

restAPIRouter.all('/users/:userId?', [users], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('/users/:userId? (req.user(s))', req.user || req.users);
  }

  sendData(res, req.user || req.users);
});

restAPIRouter.all('/announcements/:announcementId?', [announcements], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('/announcements/:announcementId? (req.announcement(s))', req.announcement || req.announcements);
  }

  sendData(res, req.announcement || req.announcements);
});

restAPIRouter.all('/courseRoles/:courseRoleId?', [courseRoles], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('/courseRoles/:courseRoleId? (req.courseRole(s))', req.courseRole || req.courseRoles);
  }

  sendData(res, req.courseRole || req.courseRoles);
});

restAPIRouter.all('/systemRoles/:systemRoleId?', [systemRoles], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('/systemRoles/:systemRoleId? (req.systemRole(s))', req.systemRole || req.systemRoles);
  }

  sendData(res, req.systemRole || req.systemRoles);
});

restAPIRouter.all('/institutionRoles/:institutionRoleId?', [institutionRoles], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('/institutionRoles/:institutionRoleId? (req.institutionRole(s))', req.institutionRole || req.institutionRoles);
  }

  sendData(res, req.systemRole || req.systemRoles);
});

restAPIRouter.all('/dataSources/:dataSourceId?', [dataSources], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('/dataSources/:dataSourceId? (req.dataSource(s))', req.dataSource || req.dataSources);
  }

  sendData(res, req.dataSource || req.dataSources);
});

restAPIRouter.all('/courses/:courseId/children/:courseChildId?', [courseChildren], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('/courses/:courseId/children (req.courseChild/children)', req.courseChild || req.courseChildren);
  }

  sendData(res, req.courseChild || req.courseChildren);
});

restAPIRouter.all('/courses/:courseId?', [courses], (req: any, res: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('/courses/:courseId? (req.course(s))', req.course || req.courses);
  }

  sendData(res, req.course || req.courses);
});

