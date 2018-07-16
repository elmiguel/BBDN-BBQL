'use strict';
import { BbQLSchema } from './schema';
import { sendData, MODELS } from './rest-utils';
import * as request from 'request-promise';
import { CourseLoader } from './schema/loaders/course-loader';
import { DataSourceLoader } from './schema/loaders/data-source-loader';
import { MembershipLoader } from './schema/loaders/membership-loader';
import { UserLoader } from './schema/loaders/user-loader';
import { MembershipUserLoader } from './schema/loaders/user-memberships-loader';
import { AnnouncementLoader } from './schema/loaders/announcement-loader';
import { TermLoader } from './schema/loaders/term-loader';
import { CreateUser, DeleteUser, UpdateUser } from './schema/mutators/user-mutator';
import { CreateCourse, DeleteCourse, UpdateCourse } from './schema/mutators/course-mutator';
import { CreateMembership, UpdateMembership, DeleteMembership } from './schema/mutators/membership-mutator';
import { CreateDataSource, DeleteDataSource, UpdateDataSource } from './schema/mutators/data-source-mutator';
// import * as DataLoader from 'dataloader';
// import { getUser } from './schema/loaders/user-loader';
const graphqlHTTP = require('express-graphql');

const root = {
  hello: () => 'Hello from BbQL'
};

//#region getDataFromBb
function getDataFromBb (req: any, res: any, next: any): void {
  console.log(req.path);
  const url = `${req.app.locals.bbApiUrl}${req.path}`;

  if (process.env.NODE_DEBUG) {
    console.log('[bbql-app.getDataFromBb] [document.then()] retrieving document from Bb');
    console.log(req.app.locals.bbpayload.access_token);
    console.log(url);
  }

  request({
    method: req.method,
    url: url,
    headers: {
      'Authorization': `Bearer ${req.app.locals.bbpayload.access_token}`
    },
    qs: req.query,
    body: req.body,
    json: true
  })
  .then((body: any) => {
    if (body) {
      if (process.env.NODE_DEBUG) {
        console.log('docs loaded');
        // console.log(body);
      }

      if (body.results) {
        req.bbdata = body.results;
      } else {
        req.bbdata = body;
      }

      // console.log(req.bbdata);
      next();
    } else {
      // doc(s) do(es) not exist in Bb
      // pass the result(s) back to the client
      next();
    }
  })
  .catch((err: any) => next(err));
}
//#endregion

//#region BbQL
export function BbQL(app: any): void {
  app.use('/bbql', graphqlHTTP((req: any, res: any) => {

    // const UserLoader = new DataLoader(
    //   (keys: any) => {
    //     return new Promise(async (resolve: any, reject: any) => {
    //       const users = await Promise.all(keys.map(getUser));
    //       if (users !== [null]) {
    //         resolve(users);
    //       } else {
    //         reject({errors: { message: 'users was return or assigned as null!' }});
    //       }
    //     });
    //   },
    //   { cache: true }
    // );

    return {
      schema: BbQLSchema,
      rootValue: root,
      graphiql: true,
      context: {
        req,
        res,
        AnnouncementLoader,
        CourseLoader,
        DataSourceLoader,
        MembershipLoader,
        MembershipUserLoader,
        TermLoader,
        UserLoader,
        CreateUser,
        DeleteUser,
        UpdateUser,
        CreateCourse,
        DeleteCourse,
        UpdateCourse,
        CreateMembership,
        DeleteMembership,
        UpdateMembership,
        CreateDataSource,
        DeleteDataSource,
        UpdateDataSource,
        MODELS
      }
    };
  }));

  app.use('/bb/api/{0,}', [getDataFromBb], (req: any, res: any) => {
    sendData(res, req.bbdata, { from: 'bbql-app', route: '/bb/api/{0,}'});
  });
}
//#endregion

