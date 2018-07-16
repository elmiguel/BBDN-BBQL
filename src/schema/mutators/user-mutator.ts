import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

const createUser = (input: any, qs: any = null) => {
  return request({
    method: 'post',
    uri: `http://localhost:3000/bb/api/users`,
    qs: qs,
    body: input,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.users.findOneAndUpdate(result, result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
        if (err) { reject(err); }
        console.log('#'.repeat(100));
        console.log(doc);
        console.log('#'.repeat(100));
        resolve(doc);
      });
    });
  });
};

const deleteUser = (userId: any, qs: any = null) => {
  return request({
    method: 'delete',
    uri: `http://localhost:3000/bb/api/users/${userId}`,
    qs: qs,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.users.findOneAndRemove( {id: userId}, (err: any, doc: any) => {
        if (err) { reject(err); }
        resolve({ message: `User '${userId}' has been deleted from Blackboard and Database` });
      });
    });
  });
};


const updateUser = (input: any, qs: any = null) => {
  return request({
    method: 'patch',
    uri: `http://localhost:3000/bb/api/users/userName:${input.userName}`,
    qs: qs,
    body: input,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.users.findOneAndUpdate(result, result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
        if (err) { reject(err); }
        resolve(doc);
      });
    });
  });
};

export const CreateUser = (input) => createUser(input);
export const DeleteUser = (userId) => deleteUser(userId);
export const UpdateUser = (input) => updateUser(input);
