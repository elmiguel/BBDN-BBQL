'use strict';
import * as DataLoader from 'dataloader';
import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

export const getDataSources = async (limit: any = null, offset: any = null) => {
  return await new Promise(async (resolve: any, reject: any) => {
    const dataSource = await getDataSource('', { limit: limit || 100, offset: offset || 0 });
    if (dataSource) {
      resolve(dataSource);
    } else {
      reject();
    }
  });
};

const getDataSource = (dataSourceId: any = '', qs: any = null) => {
  const isMany = dataSourceId === '';
  const _dataSourceId = dataSourceId && !isMany ? `/${dataSourceId}` : '';

  return request.get({
    uri: `http://localhost:3000/bb/api/dataSources${_dataSourceId}`,
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

          MODELS.dataSources.bulkWrite(upsertDocs)
          .then((_result: any) => {
            const _upsertedDocs = {
              id: {
                $in: _docs.map((d: any) => d.id)
              }
            };

            resolve(MODELS.dataSources.find(_upsertedDocs).exec());
          })
          .catch((err: any) => reject(err));
      } else {
        MODELS.dataSources.findOneAndUpdate(
          result, result,
          { new: true, upsert: true, setDefaultOnInsert: true},
          (err: any, doc: any) => {
            if (err && doc === null && doc !== undefined) { reject(err); }
            resolve(MODELS.dataSources.findOne(doc).exec());
        });
      }
    });
  });
};

export const DataSourceLoader = new DataLoader(
  (keys: any) => {
    return new Promise(async (resolve: any, reject: any) => {
      const dataSources = await Promise.all(keys.map(getDataSource));

      if (dataSources !== [null]) {
        resolve(dataSources);
      } else {
        reject({errors: { message: 'dataSources was return or assigned as null!' }});
      }
    });
  },
  { cache: true }
);

