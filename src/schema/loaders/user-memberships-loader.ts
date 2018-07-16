'use strict';
import * as DataLoader from 'dataloader';
import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

const getUserMembership = (userId: any, qs: any = null) => {
  return request.get({
    uri: `http://localhost:3000/bb/api/users/${userId}/courses`,
    qs: qs
  })
  .then((body: any) => JSON.parse(body))
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      const _docs =  result;
      const _userId = result[0].userId;
      const upsertDocs = _docs.map((update: any) => ({
          updateOne: {
            filter: { userId: update.userId, courseId: update.courseId },
            update: { $set: update },
            upsert: true
          }
        }));

        MODELS.memberships.bulkWrite(upsertDocs)
        .then((_result: any) => {
          resolve(MODELS.memberships.find({userId: _userId}).exec());
        })
        .catch((err: any) => reject(err));
    });
  });
};

export const MembershipUserLoader = new DataLoader(
  (keys: any) => {
    console.log('MEMBERSHIP USER LOADER KEYS:', keys);
    return new Promise(async (resolve: any, reject: any) => {
      const memberships = await Promise.all(keys.map((key: any) => getUserMembership(key)));
      console.log(memberships);
      if (memberships !== [null]) {
        resolve(memberships);
      } else {
        reject({errors: { message: 'memberships was return or assigned as null!' }});
      }
    });
  },
  { cache: true }
);

