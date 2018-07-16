import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

const createMembership = (input: any, qs: any = null) => {
  return request({
    method: 'put',
    uri: `http://localhost:3000/bb/api/courses/${input.courseId}/users/${input.userId}`,
    qs: qs,
    body: input,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.memberships.findOneAndUpdate(result, result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
        if (err) { reject(err); }
        console.log('#'.repeat(100));
        console.log(doc);
        console.log('#'.repeat(100));
        resolve(doc);
      });
    });
  });
};

const deleteMembership = (input: any, qs: any = null) => {
  return request({
    method: 'delete',
    uri: `http://localhost:3000/bb/api/courses/${input.courseId}/users/${input.userId}`,
    qs: qs,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.memberships.findOneAndRemove( {courseId: input.courseId, userId: input.userId}, (err: any, doc: any) => {
        if (err) { reject(err); }
        resolve({ message: `Membership '${input.courseId}:${input.userId}' has been deleted from Blackboard and Database` });
      });
    });
  });
};


const updateMembership = (input: any, qs: any = null) => {
  return request({
    method: 'patch',
    uri: `http://localhost:3000/bb/api/courses/${input.courseId}/users/${input.userId}`,
    qs: qs,
    body: input,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.memberships.findOneAndUpdate(
        { courseId: input.courseId, userId: input.userId },
        result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
        if (err) { reject(err); }
        resolve(doc);
      });
    });
  });
};

export const CreateMembership = (input) => createMembership(input);
export const DeleteMembership = (userId) => deleteMembership(userId);
export const UpdateMembership = (input) => updateMembership(input);
