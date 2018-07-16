'use strict';
import * as request from 'request-promise';
import * as bluebird from 'bluebird';
import { Token } from './models/token';
import { BbConfig } from './config';
import { User } from './models/user';
import { Course } from './models/course';
import { Membership } from './models/membership';
import { Announcement } from './models/announcement';
import { CourseRole } from './models/course-role';
import { SystemRole } from './models/system-role';
import { InstitutionRole } from './models/institution-role';
import { DataSource } from './models/data-source';
import { CourseChild } from './models/course-child';
import { Term } from './models/term';
//#region context setup
interface Context {
  originalReqOpts: any;
  returnReqOpts: any;
  req: any;
  res: any;
  path: any;
  params: any;
  data: any;
  isMany: any;
  model: any;
  error: any;
}

export const context: Context = {
  originalReqOpts: null,
  returnReqOpts: null,
  req: null,
  res: null,
  path: null,
  params: null,
  data: null,
  isMany: null,
  model: null,
  error: null
};
//#endregion

//#region MODELS
export const MODELS: any = {
  users: User,
  courses: Course,
  memberships: Membership,
  announcements: Announcement,
  courseRoles: CourseRole,
  systemRoles: SystemRole,
  institutionRoles: InstitutionRole,
  dataSources: DataSource,
  courseChildren: CourseChild,
  terms: Term,
  token: Token
};
//#endregion

//#region apiLog
export const apiLog = (req: any, res: any, next: any) => {
  if (process.env.NODE_DEBUG) {
    console.log('[\trest-utils:apiLog\t]\t', req.path);
    console.log('[\trest-utils:bbApiUrl\t]\t', req.app.locals.bbApiUrl);
    console.log('[\trest-utils:bbconfig\t]\t\n', req.app.locals.bbpayload);
  }

  if (req.query.force) {
    req.force = req.query.force;
  }
  (<any>Token).getToken((token: any) => {
    if (token && token.isValid()) {
      req.app.locals.bbpayload = token;
    } else {
      setToken((_token: any) => {
        req.app.locals.bbpayload = _token;
      });
    }
  });
  next();
};
//#endregion

//#region setToken()
export const setToken = (cb: any) => {
  request(
    {
      method: 'post',
      url: `${BbConfig.url}/oauth2/token`,
      headers: {
        'Authorization': `Basic ${BbConfig.auth}`
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    }
  )
  .then((body: any) => {
    Token.create(body, (err: any, token: any) => {
      if (err) { throw (err); }
      cb(token);
    });
  })
  .catch((err: any) => {
      if (err) {
        console.log('Oops!');
        throw (err.message);
      }
    }
  );
};
//#endregion

//#region buildParams()
export function buildParams(params: any, deleteKey: any = ''): object {
  let _params = {};

  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      console.log('PARAM KEY', key);
      let _key = key;

      if (key === 'userId') {
        // check for externalId, userName, uuid, else primaryId
        if (/^externalId/.test(params[key])) {
          _key = 'externalId';
        } else if (/^userName/.test(params[key])) {
          _key = 'userName';
        } else if (/^uuid/.test(params[key])) {
          _key = 'uuid';
        } else if (/^_/.test(params[key])) {
          _key = 'id';
        } else {
          _key = 'id';
        }
      }

      if (key === 'courseId') {
        // check for externalId, courseId, uuid, else primaryId
        if (/^externalId/.test(params[key])) {
          _key = 'externalId';
        } else if (/^courseId/.test(params[key])) {
          _key = 'courseId';
        } else if (/^uuid/.test(params[key])) {
          _key = 'uuid';
        } else if (/^_/.test(params[key])) {
          _key = 'id';
        } else {
          _key = 'id';
        }
      }

      if (key === 'courseChildId') {
        // check for externalId, courseId, uuid, else primaryId
        if (/^externalId/.test(params[key])) {
          _key = 'id';
        } else if (/^courseId/.test(params[key])) {
          _key = 'id';
        } else if (/^_/.test(params[key])) {
          _key = 'id';
        } else {
          _key = 'id';
        }
      }

      if (deleteKey !== '') {
        delete _params[deleteKey];
      }

      if (params[key]) {
        _params[_key] = params[key].replace(/^(\w+:)/gi, '');
      }
    }
  }
  return _params;
}
//#endregion

//#region setupRouterParams
export const setupRouterParams = (restAPIRouter: any) => {

  restAPIRouter.param('userId', (req: any, res: any, next: any, id: any) => {
    context.model = MODELS.users;
    context.isMany = false;
    context.path = req.path;
    //ensure that the user and memberships are null for clean responses
    req.user = null;
    req.memberships = null;
    if (req.force) {
      getDataFromBb(req, res, next);
    } else {
      MODELS.users
      .findOne(buildParams(req.params, 'userId'))
      .exec()
      .then((user: any) => {
        if (!user) {
          console.log('I SHOULD BE LOADED FIRST!!!!!!!!!!');
          context.path = req.path.replace('/courses', '');
          getDataFromBb(req, res, next);
        } else {
          req.user = user;
          next();
        }
      })
      .catch((err: any) => next(err));
    }
  });

  restAPIRouter.param('courseId', (req: any, res: any, next: any, id: any) => {
    context.model = MODELS.courses;
    context.isMany = false;
    context.path = req.path;

    if (req.force) {
      getDataFromBb(req, res, next);
    } else {
      MODELS.courses
        .findOne(buildParams(req.params, 'courseId'))
        .exec()
        .then((course: any) => {
          if (!course) {
            getDataFromBb(req, res, next);
          } else {
            req.course = course;
            next();
          }
        })
        .catch((err: any) => next(err));
    }
  });

  restAPIRouter.param('courseChildId', (req: any, res: any, next: any, id: any) => {
    context.model = MODELS.courseChildren;
    context.isMany = false;
    context.path = req.path;
    console.log('buildParams', buildParams(req.params, 'courseChildId'));

    //req.course should already be available via the courseId param router cb
    const parentId = req.course.id;
    const courseChildId = buildParams(req.params, 'courseChildId');

    if (req.force) {
      getDataFromBb(req, res, next);
    } else {
      // due to the nature of the course dependencies
      // a stacked promise will better fit this workflow
      let params = req.params;

      //clear out the courseId as it is already preloaded via req.course
      delete params.courseId;

      bluebird.all([
        req.course,
        MODELS.courseChildren
        .find(buildParams(req.params, 'courseChildId'))
        .exec()
      ]).then(([course, child]: any) => {
        console.log('BLUEBIRD');
        console.log('COURSE:', course);
        console.log('CHILD:', child);
      });


      MODELS.courseChildren
        .find({parentId: parentId})
        .exec()
        .then((_courseChildren: any) => {
          if (!_courseChildren) {
            getDataFromBb(req, res, next);
          } else {
            const courseChild = _courseChildren.find((c: any) => {
              return c.id = courseChildId;
            });
            req.courseChild = courseChild;
            next();
          }
        })
        .catch((err: any) => next(err));
    }
  });

  restAPIRouter.param('announcementId', (req: any, res: any, next: any, id: any) => {
    context.model = MODELS.announcements;
    context.isMany = false;
    context.path = req.path;

    if (req.force) {
      getDataFromBb(req, res, next);
    } else {
      MODELS.courses
        .findOne(buildParams(req.params, 'announcementId'))
        .exec()
        .then((announcement: any) => {
          if (!announcement) {
            getDataFromBb(req, res, next);
          } else {
            req.announcement = announcement;
            next();
          }
        })
        .catch((err: any) => next(err));
    }
  });

  restAPIRouter.param('courseRoleId', (req: any, res: any, next: any, id: any) => {
    context.model = MODELS.announcements;
    context.isMany = false;
    context.path = req.path;

    if (req.force) {
      getDataFromBb(req, res, next);
    } else {
      MODELS.courseRoles
        .findOne(buildParams(req.params, 'courseRoleId'))
        .exec()
        .then((courseRole: any) => {
          if (!courseRole) {
            getDataFromBb(req, res, next);
          } else {
            req.courseRole = courseRole;
            next();
          }
        })
        .catch((err: any) => next(err));
    }
  });

  restAPIRouter.param('systemRoleId', (req: any, res: any, next: any, id: any) => {
    context.model = MODELS.systemRoles;
    context.isMany = false;
    context.path = req.path;

    if (req.force) {
      getDataFromBb(req, res, next);
    } else {
      MODELS.systemRoles
        .findOne(buildParams(req.params, 'systemRoleId'))
        .exec()
        .then((systemRole: any) => {
          if (!systemRole) {
            getDataFromBb(req, res, next);
          } else {
            req.systemRole = systemRole;
            next();
          }
        })
        .catch((err: any) => next(err));
    }
  });

  restAPIRouter.param('dataSourceId', (req: any, res: any, next: any, id: any) => {
    context.model = MODELS.dataSources;
    context.isMany = false;
    context.path = req.path;

    if (req.force) {
      getDataFromBb(req, res, next);
    } else {
      MODELS.systemRoles
        .findOne(buildParams(req.params, 'dataSourceId'))
        .exec()
        .then((dataSource: any) => {
          if (!dataSource) {
            getDataFromBb(req, res, next);
          } else {
            req.dataSource = dataSource;
            next();
          }
        })
        .catch((err: any) => next(err));
    }
  });
};
//#endregion

//#region memberships
export const memberships = (req: any , res: any, next: any) => {
  context.model = MODELS.memberships;
  context.isMany = true;
  context.path = req.path;
  req.memberships = null;
  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    console.log('MEMBERSHIPS => LOADING USER...');
    console.log({ userId: req.user.userId });
    MODELS.memberships
    .find({ userId: req.user.userId })
    .exec()
    .then((_memberships: any) => {
      if (_memberships.length === 0) {
        getDataFromBb(req, res, next);
      } else {
        req.memberships = _memberships;
        next();
      }
    })
    .catch((err: any) => next(err));
  }
};
//#endregion

//#region users
export const users = (req: any , res: any, next: any) => {
  // userId was not supplied,
  context.model = MODELS.users;
  context.isMany = true;
  context.path = req.path;

  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    if (!req.params.userId) {
      MODELS.users
      .find({})
      .exec()
      .then((_users: any) => {
        if (_users.length === 0) {
          getDataFromBb(req, res, next);
        } else {
          req.users = _users;
          next();
        }
      })
      .catch((err: any) => next(err));
    } else {
      next();
    }
  }

};
//#endregion

//#region courses
export const courses = (req: any , res: any, next: any) => {
  context.model = MODELS.courses;
  context.isMany = true;
  context.path = req.path;  // courseId was not supplied,

  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    if (!req.params.courseId) {
      MODELS.courses
      .find({})
      .exec()
      .then((_courses: any) => {
        if (_courses.length === 0) {
          getDataFromBb(req, res, next);
        } else {
          req.courses = _courses;
          next();
        }
      })
      .catch((err: any) => next(err));
    } else {
      next();
    }
  }

};
//#endregion

//#region courseRoles
export const courseRoles = (req: any , res: any, next: any) => {
  context.model = MODELS.courseRoles;
  context.isMany = true;
  context.path = req.path;  // courseId was not supplied,

  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    if (!req.params.courseRoleId) {
      MODELS.courseRoles
      .find({})
      .exec()
      .then((_courseRoles: any) => {
        if (_courseRoles.length === 0) {
          getDataFromBb(req, res, next);
        } else {
          req.courseRoles = _courseRoles;
          next();
        }
      })
      .catch((err: any) => next(err));
    } else {
      next();
    }
  }

};
//#endregion

//#region systemRoles
export const systemRoles = (req: any , res: any, next: any) => {
  context.model = MODELS.systemRoles;
  context.isMany = true;
  context.path = req.path;  // courseId was not supplied,

  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    if (!req.params.systemRoleId) {
      MODELS.systemRoles
      .find({})
      .exec()
      .then((_systemRoles: any) => {
        if (_systemRoles.length === 0) {
          getDataFromBb(req, res, next);
        } else {
          req.systemRoles = _systemRoles;
          next();
        }
      })
      .catch((err: any) => next(err));
    } else {
      next();
    }
  }

};
//#endregion

//#region dataSources
export const dataSources = (req: any , res: any, next: any) => {
  context.model = MODELS.dataSources;
  context.isMany = true;
  context.path = req.path;  // courseId was not supplied,

  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    if (!req.params.dataSourceId) {
      MODELS.systemRoles
      .find({})
      .exec()
      .then((_dataSources: any) => {
        if (_dataSources.length === 0) {
          getDataFromBb(req, res, next);
        } else {
          req.dataSources = _dataSources;
          next();
        }
      })
      .catch((err: any) => next(err));
    } else {
      next();
    }
  }

};
//#endregion

//#region courseChildren
export const courseChildren = (req: any , res: any, next: any) => {
  context.model = MODELS.courseChildren;
  context.isMany = true;
  context.path = req.path;  // Id was not supplied,
  console.log({ parentId: req.course.id});
  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    if (req.course) {
      MODELS.courseChildren
      .find({ parentId: req.course.id})
      .exec()
      .then((_courseChildren: any) => {
        if (_courseChildren.length === 0) {
          getDataFromBb(req, res, next);
        } else {
          req.courseChildren = _courseChildren;
          next();
        }
      })
      .catch((err: any) => next(err));
    } else {
      next();
    }
  }

};
//#endregion

//#region institutionRoles
export const institutionRoles = (req: any , res: any, next: any) => {
  context.model = MODELS.institutionRoles;
  context.isMany = true;
  context.path = req.path;  // courseId was not supplied,

  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    if (!req.params.institutionRoleId) {
      MODELS.institutionRoles
      .find({})
      .exec()
      .then((_institutionRoles: any) => {
        if (_institutionRoles.length === 0) {
          getDataFromBb(req, res, next);
        } else {
          req.institutionRoles = _institutionRoles;
          next();
        }
      })
      .catch((err: any) => next(err));
    } else {
      next();
    }
  }

};
//#endregion

//#region announcements
export const announcements = (req: any , res: any, next: any) => {
  context.model = MODELS.announcements;
  context.isMany = true;
  context.path = req.path;  // announcementId was not supplied,

  if (req.force) {
    getDataFromBb(req, res, next);
  } else {
    if (!req.params.announcementId) {
      MODELS.announcements
      .find({})
      .exec()
      .then((_announcements: any) => {
        if (_announcements.length === 0) {
          getDataFromBb(req, res, next);
        } else {
          req.announcements = _announcements;
          next();
        }
      })
      .catch((err: any) => next(err));
    } else {
      next();
    }
  }

};
//#endregion

//#region sendData()
// tslint:disable-next-line:typedef
export function sendData (res: any = null, data: any = null, debug: any = null) {
  //comfirm status, render json to client
  if (debug) {
    console.log('-'.repeat(80));
    console.log(debug);
    // console.log(data);
    console.log('-'.repeat(80));
  }

  const _res = res || context.res;
  const _data = data || context.data;

  if (context.error || !_data) {
    console.log(context.error);
    _res.status(404).json({ message: 'No records could be found' });
  } else {
    _res.status(200).json(_data);
  }
}
//#endregion

//#region getDataFromBb()
// tslint:disable-next-line:typedef
function getDataFromBb (req: any , res: any, next: any) {
  const url = req.app.locals.bbApiUrl + (context.path && context.path !== '' ? context.path : req.path);

  if (process.env.NODE_DEBUG) {
    console.log('[rest-utils.getDataFromBb] [document.then()] retrieving document from Bb');
    console.log(req.app.locals.bbpayload.access_token);
    console.log(url);
    console.log('DO I HAVE A USER?', req.user);
    console.log('DO I HAVE MEMBERSHIPS?', req.memberships);
  }

  request({
    method: req.method,
    url: url,
    headers: {
      'Authorization': `Bearer ${req.app.locals.bbpayload.access_token}`
    },
    qs: req.query,
    form: req.body,
    json: true
  })
  .then((body: any) => {
    if (body) {
      if (process.env.NODE_DEBUG) {
        console.log('docs loaded');
        // console.log(body);
      }
      context.data = body;
      saveDataToDatabase(req, res, next);
    } else {
      // doc(s) do(es) not exist in Bb
      // pass the result(s) back to the client
      next();
    }
  })
  .catch((err: any) => next(err));
}
//#endregion

//#region saveDataToDatabase()
// tslint:disable-next-line:typedef
function saveDataToDatabase (req: any , res: any, next: any) {
  if (process.env.NODE_DEBUG) {
    // console.log('Save Data:', context.data);
  }
  //check if multiple docs
  //if isMany, bulkWrite, send results to client
  // else create(upsert), send result to client
  // blackboard returns a root object key: results for multiple records
  context.req = req;
  context.res = res;
  if (context.isMany && context.data.results) {
    console.log(context.data);
    let _docs =  context.data.results;
    const upsertDocs = _docs.map((update: any) => ({
        updateOne: {
          filter: update,
          update: { $set: update },
          upsert: true
        }
      }));
      context.model.bulkWrite(upsertDocs)
      .then((result: any) => {
        // after the bulkWrite is done, get the upserts
        const _upsertedDocs = {
          _id: {
            $in: result.toJSON().upserted
          }
        };
        context.model.find(_upsertedDocs).exec().then((docs: any) => {
          context.data = docs;
          req[context.model.collection.name] = docs;
          next();
        });
      })
      .catch((err: any) => console.log(err));
  } else {
    context.model.create(context.data, (err: any, doc: any) => {
      if (err) { throw (err); }
      context.data = doc;
      const modelName = context.model.collection.name.slice(0, -1);
      req[modelName] = doc;
      next();
    });
  }
}
//#endregion
