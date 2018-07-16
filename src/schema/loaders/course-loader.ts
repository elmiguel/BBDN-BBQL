'use strict';
import * as DataLoader from 'dataloader';
import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

export const getCourses = async (limit: any = null, offset: any = null) => {
  return await new Promise(async (resolve: any, reject: any) => {
    const course = await getCourse('', { limit: limit || 100, offset: offset || 0 });
    if (course) {
      resolve(course);
    } else {
      reject();
    }
  });
};

const getCourse = (courseId: any = '', qs: any = null) => {
  const isMany = courseId === '';
  const _courseId = courseId && !isMany ? `/${courseId}` : '';

  return request.get({
    uri: `http://localhost:3000/bb/api/courses${_courseId}`,
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

          MODELS.courses.bulkWrite(upsertDocs)
          .then((_result: any) => {
            const _upsertedDocs = {
              id: {
                $in: _docs.map((d: any) => d.id)
              }
            };

            resolve(MODELS.courses.find(_upsertedDocs).exec());
          })
          .catch((err: any) => reject(err));
      } else {
        MODELS.courses.findOneAndUpdate(
          result, result,
          { new: true, upsert: true, setDefaultOnInsert: true},
          (err: any, doc: any) => {
          if (err && doc === null) { reject(err); }
          resolve(MODELS.courses.findOne({id: doc.id}).exec());
        });
      }
    });
  });
};

export const CourseLoader = new DataLoader(
  (keys: any) => {
    return new Promise(async (resolve: any, reject: any) => {
      const courses = await Promise.all(keys.map(getCourse));

      if (courses !== [null]) {
        resolve(courses);
      } else {
        reject({errors: { message: 'courses was return or assigned as null!' }});
      }
    });
  },
  { cache: true }
);

