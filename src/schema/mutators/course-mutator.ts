import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

const createCourse = (input: any, qs: any = null) => {
  return request({
    method: 'post',
    uri: `http://localhost:3000/bb/api/courses`,
    qs: qs,
    body: input,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.courses.findOneAndUpdate(result, result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
        if (err) { reject(err); }
        console.log('#'.repeat(100));
        console.log(doc);
        console.log('#'.repeat(100));
        resolve(doc);
      });
    });
  });
};

const deleteCourse = (courseId: any, qs: any = null) => {
  return request({
    method: 'delete',
    uri: `http://localhost:3000/bb/api/courses/${courseId}`,
    qs: qs,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.courses.findOneAndRemove( {id: courseId}, (err: any, doc: any) => {
        if (err) { reject(err); }
        resolve({ message: `Course '${courseId}' has been deleted from Blackboard and Database` });
      });
    });
  });
};


const updateCourse = (input: any, qs: any = null) => {
  return request({
    method: 'patch',
    uri: `http://localhost:3000/bb/api/course/externalId:${input.externalId}`,
    qs: qs,
    body: input,
    json: true
  })
  .then((result: any) => {
    return new Promise((resolve: any, reject: any) => {
      MODELS.courses.findOneAndUpdate(result, result, { new: true, upsert: true, setDefaultOnInsert: true}, (err: any, doc: any) => {
        if (err) { reject(err); }
        resolve(doc);
      });
    });
  });
};

export const CreateCourse = (input) => createCourse(input);
export const DeleteCourse = (courseId) => deleteCourse(courseId);
export const UpdateCourse = (input) => updateCourse(input);
