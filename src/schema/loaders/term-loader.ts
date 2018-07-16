'use strict';
import * as DataLoader from 'dataloader';
import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

export const getTerms = async (limit: any = null, offset: any = null) => {
  return await new Promise(async (resolve: any, reject: any) => {
    const dataSource = await getTerm('', { limit: limit || 100, offset: offset || 0 });
    if (dataSource) {
      resolve(dataSource);
    } else {
      reject();
    }
  });
};

const getTerm = (termId: any = '', qs: any = null) => {
  const isMany = termId === '';
  const _termId = termId && !isMany ? `/${termId}` : '';

  return request.get({
    uri: `http://localhost:3000/bb/api/terms${_termId}`,
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

          MODELS.terms.bulkWrite(upsertDocs)
          .then((_result: any) => {

            const _upsertedDocs = {
              id: {
                $in: _docs.map((d: any) => d.id)
              }
            };

            resolve(MODELS.terms.find(_upsertedDocs).exec());
          })
          .catch((err: any) => reject(err));
      } else {
        MODELS.terms.findOneAndUpdate(
          result, result,
          { new: true, upsert: true, setDefaultOnInsert: true},
          (err: any, doc: any) => {
            if (err && doc === null && doc !== undefined) { reject(err); }

            // this method fails on certain objects!!
            // resolve(MODELS.terms.findOne(doc}).exec());

            resolve(MODELS.terms.findOne({id: doc.id}).exec());
        });
      }
    });
  });
};

export const TermLoader = new DataLoader(
  (keys: any) => {
    return new Promise(async (resolve: any, reject: any) => {
      const terms = await Promise.all(keys.map(getTerm));

      if (terms !== [null]) {
        resolve(terms);
      } else {
        reject({errors: { message: 'terms was return or assigned as null!' }});
      }
    });
  },
  { cache: true }
);

