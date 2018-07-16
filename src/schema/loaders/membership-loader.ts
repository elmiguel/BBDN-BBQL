'use strict';
import * as DataLoader from 'dataloader';
import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

export const getMemberships = async (courseId: any, limit: any = null, offset: any = null) => {
  return await new Promise(async (resolve: any, reject: any) => {
    const membership = await getMembership(courseId, '', { limit: limit || 100, offset: offset || 0 });
    if (membership) {
      resolve(membership);
    } else {
      reject();
    }
  });
};

const getMembership = (courseId: any, userId: any = '', qs: any = null) => {
  const isMany = userId === '';
  const _userId = userId && !isMany ? `/${userId}` : '';

  return request.get({
    uri: `http://localhost:3000/bb/api/courses/${courseId}/users${_userId}`,
    qs: qs
  })
  .then((body: any) => JSON.parse(body))
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      if (isMany && Array.isArray(result)) {
        const _docs =  result;
        const upsertDocs = _docs.map((update: any) => ({
            updateOne: {
              filter: { userId: update.userId, courseId: update.courseId },
              update: { $set: update },
              upsert: true
            }
          }));

          MODELS.memberships.bulkWrite(upsertDocs)
          .then((_result: any) => {
            const _upsertedDocs = {
              $and: _docs.map((d: any) => (
                { $or: [ { userId: d.userId }, { courseId: d.courseId } ] }
              ))
            };

            resolve(MODELS.memberships.find(_upsertedDocs).exec());
          })
          .catch((err: any) => reject(err));
      } else {
        MODELS.dataSources.findOneAndUpdate(
          result, result,
          { new: true, upsert: true, setDefaultOnInsert: true},
          (err: any, doc: any) => {
            if (err && doc === null && doc !== undefined) { reject(err); }
            resolve(MODELS.memberships.findOne(doc).exec());
        });
      }
    });
  });
};

export const MembershipLoader = new DataLoader(
  (keys: any) => {
    console.log('MEMBERSHIP LOADER KEYS:', keys);
    return new Promise(async (resolve: any, reject: any) => {
      let memberships;
      if (Array.isArray(keys.userId)) {
        memberships = await Promise.all(keys.map((key: any) => key.userId.map((user: any) => getMembership(key.courseId, user.userId))));
      } else {
        memberships = await Promise.all(keys.map((key: any) => getMembership(key.courseId, key.userId)));
      }

      if (memberships !== [null]) {
        resolve(memberships);
      } else {
        reject({errors: { message: 'memberships was return or assigned as null!' }});
      }
    });
  },
  { cache: true }
);

