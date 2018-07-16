'use strict';
import * as DataLoader from 'dataloader';
import * as request from 'request-promise';
import { MODELS } from '../../rest-utils';

export const getAnnouncements = async (limit: any = null, offset: any = null) => {
  return await new Promise(async (resolve: any, reject: any) => {
    const dataSource = await getAnnouncement('', { limit: limit || 100, offset: offset || 0 });
    if (dataSource) {
      resolve(dataSource);
    } else {
      reject();
    }
  });
};

const getAnnouncement = (announcementId: any = '', qs: any = null) => {
  const isMany = announcementId === '';
  const _announcementId = announcementId && !isMany ? `/${announcementId}` : '';

  return request.get({
    uri: `http://localhost:3000/bb/api/announcements${_announcementId}`,
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

          MODELS.announcements.bulkWrite(upsertDocs)
          .then((_result: any) => {
            const _upsertedDocs = {
              id: {
                $in: _docs.map((d: any) => d.id)
              }
            };

            resolve(MODELS.announcements.find(_upsertedDocs).exec());
          })
          .catch((err: any) => reject(err));
      } else {
        MODELS.announcements.findOneAndUpdate(
          result, result,
          { new: true, upsert: true, setDefaultOnInsert: true},
          (err: any, doc: any) => {
            if (err && doc === null && doc !== undefined) { reject(err); }
            resolve(MODELS.announcements.findOne(doc).exec());
        });
      }
    });
  });
};

export const AnnouncementLoader = new DataLoader(
  (keys: any) => {
    return new Promise(async (resolve: any, reject: any) => {
      const announcements = await Promise.all(keys.map(getAnnouncement));

      if (announcements !== [null]) {
        resolve(announcements);
      } else {
        reject({errors: { message: 'announcements was return or assigned as null!' }});
      }
    });
  },
  { cache: true }
);

