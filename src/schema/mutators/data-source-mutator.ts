import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

const createDataSource = (input: any, qs: any = null) => {
  return request({
    method: 'post',
    uri: `http://localhost:3000/bb/api/dataSources`,
    qs: qs,
    body: input,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.dataSources.findOneAndUpdate(result, result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
        if (err) { reject(err); }
        console.log('#'.repeat(100));
        console.log(doc);
        console.log('#'.repeat(100));
        resolve(doc);
      });
    });
  });
};

const deleteDataSource = (dataSourceId: any, qs: any = null) => {
  let criteria = {};
  let _key: any;
  if (/^externalId/.test(dataSourceId)) {
    _key = 'externalId';
  } else if (/^_/.test(dataSourceId)) {
    _key = 'id';
  } else {
    _key = 'id';
  }
  criteria[_key] = dataSourceId.replace(/^(\w+:)/gi, '');

  return request({
    method: 'delete',
    uri: `http://localhost:3000/bb/api/dataSources/${dataSourceId}`,
    qs: qs,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.dataSources.findOneAndRemove(criteria, (err: any, doc: any) => {
        if (err) { reject(err); }
        resolve({ message: `Data Source '${dataSourceId}' has been deleted from Blackboard and Database` });
      });
    });
  });
};


const updateDataSource = (input: any, qs: any = null) => {
  return request({
    method: 'patch',
    uri: `http://localhost:3000/bb/api/dataSources/externalId:${input.externalId}`,
    qs: qs,
    body: input,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      // tslint:disable-next-line:max-line-length
      MODELS.dataSources.findOneAndUpdate({ externalId: input.externalId }, result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
        if (err) { reject(err); }
        resolve(doc);
      });
    });
  });
};

export const CreateDataSource = (input) => createDataSource(input);
export const DeleteDataSource = (dataSourceId) => deleteDataSource(dataSourceId);
export const UpdateDataSource = (input) => updateDataSource(input);
