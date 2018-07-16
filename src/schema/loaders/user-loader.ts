'use strict';
import * as DataLoader from 'dataloader';
import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

export const getUsers = async (limit: any = null, offset: any = null) => {
  return await new Promise(async (resolve: any, reject: any) => {
    const users = await getUser('', { limit: limit || 100, offset: offset || 0 });
    if (users) {
      resolve(users);
    } else {
      reject();
    }
  });
};

// const getUserDbFirst = (userId: any = '', qs: any = null) => {

// };

export const getUser = (userId: any = '', qs: any = null) => {
  const isMany = userId === '';
  // console.log(userId, isMany);
  const _userId = userId && !isMany ? `/${userId}` : '';
  return request.get({
    uri: `http://localhost:3000/bb/api/users${_userId}`,
    qs: qs
  })
  .then((body: any) => JSON.parse(body))
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      if (isMany) {
        const _docs =  result;

        const upsertDocs = _docs.map((update: any) => ({
            updateOne: {
              filter: { id: update.id },
              update: { $set: update },
              upsert: true
            }
          }));

          MODELS.users.bulkWrite(upsertDocs)
          .then((_result: any) => {
            const _upsertedDocs = {
              id: {
                $in: _docs.map((d: any) => d.id)
              }
            };

            resolve(MODELS.users.find(_upsertedDocs).exec());
          })
          .catch((err: any) => reject(err));
      } else {
        MODELS.users.findOneAndUpdate(result, result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
          if (err) { reject(err); }
          console.log('#'.repeat(100));
          console.log(doc);
          console.log('#'.repeat(100));
          resolve(doc);
          // resolve(MODELS.users.findOne(doc).exec());
        });
      }
    });
  });
};



export const UserLoader = new DataLoader(
  (keys: any) => {
    return new Promise(async (resolve: any, reject: any) => {
      const users = await Promise.all(keys.map(getUser));
      if (users !== [null]) {
        resolve(users);
      } else {
        reject({errors: { message: 'users was return or assigned as null!' }});
      }
    });
  },
  { cache: true }
);
