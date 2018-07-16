import * as mongoose from 'mongoose';

const fieldsAliasPlugin = require('mongoose-aliasfield');
const Schema = mongoose.Schema;

/**
 * User Schema
 */

const UserSchema = new Schema({
  id: { type: String, alias: 'userId' },
  uuid: String,
  externalId: String,
  dataSourceId: String,
  userName: { type: String },
  educationLevel: String,
  studentId: String,
  birthDate: String,
  gender: String,
  created: String,
  lastLogin: String,
  systemRoleIds: [],
  institutionRoleIds: [],
  availability: {
    available: String
  },
  name: {
    given: String,
    family: String,
    middle: String,
    other: String,
    suffix: String,
    title: String
  },
  job: {
    title: String,
    department: String,
    company: String
  },
  contact: {
    homePhone: String,
    mobilePhone: String,
    businessPhone: String,
    businessFax: String,
    email: String,
    webPage: String
  },
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  locale: {
    id: String,
    calendar: String,
    firstDayOfWeek: String
  }
});

// tslint:disable-next-line:typedef
let handleE11000 = function(error: any, doc: any, next: any) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(error);
  }
};

UserSchema.post('save', handleE11000);
UserSchema.post('update', handleE11000);
UserSchema.post('findOneAndUpdate', handleE11000);
UserSchema.post('insertMany', handleE11000);

UserSchema.plugin(fieldsAliasPlugin);
UserSchema.set('timestamps', true);

const default_select = 'id uuid externalId userName name email';

UserSchema.set('toJSON', {
  // tslint:disable-next-line:typedef
  transform: function(doc: any, ret: any, options: any) {
    delete ret.password; return ret;
  }
});

/**
 * Statics
 */
UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  // tslint:disable-next-line:typedef
  load: function(options: any, cb: Function) {
    let criteria = options.criteria || {};
    let select = options.select || default_select;
    let isPrimaryId: boolean;
    try {
      console.log('[User.load() [options.criteria]', criteria);
      isPrimaryId = /^_\d+_1/.test(criteria.userId);
    } catch (ex) {
      console.log(ex);
      isPrimaryId = false;
    } finally {
      console.log(isPrimaryId);
    }
    let _criteria: any = {};
    if (!isPrimaryId) {
      for (let key in criteria) {
        if (key === 'userId') {
          // check for externalId else userName
          if (/^\d+/.test(criteria.userId)) {
            _criteria.externalId = criteria.userId;
          } else {
            _criteria.userName = criteria.userId;
          }
        } else {
          _criteria[key] = criteria[key];
        }
      }
    } else {
      _criteria = Object.assign({}, criteria);
      _criteria.id = criteria.userId;
      delete _criteria.userId;
    }
    console.log('[User.load()] [_criteria]:', _criteria);
    return this.findOne(_criteria)
      .select(select)
      .exec(cb);
  },
  // tslint:disable-next-line:typedef
  list: function(options: any, cb: Function) {
    var criteria = options.criteria || {};
    var select = options.select || default_select;
    var sort = options.sort || 1;
    var page = options.page || 0;
    var limit = options.limit || 30;
    return this.find(criteria)
      .select(select)
      .populate('users', select)
      .sort({ _id: sort })
      .limit(limit)
      .skip(limit * page)
      .exec(cb);
  },
  // tslint:disable-next-line:typedef
  findOrCreate: function(options: any, cb: Function) {
    let criteria = options.criteria || {};
    let isPrimaryId: boolean;
    try {
      console.log('[User.load() [options.criteria]', options.criteria);
      isPrimaryId = /^_\d+_1/.test(options.criteria.userId);
    } catch (ex) {
      console.log(ex);
      isPrimaryId = false;
    } finally {
      console.log(isPrimaryId);
    }
    let _criteria: any = {};
    if (!isPrimaryId) {
      for (let key in options) {
        if (key === 'userId') {
          _criteria.userName = options.criteria.userId;
        } else {
          _criteria[key] = options.criteria[key];
        }
      }
    } else {
      _criteria = Object.assign({}, criteria);
    }
    console.log('[User.findOrCreate()] [_criteria]:', _criteria);
    this.findOne(_criteria, (err: any, user: any) => {
      if (err) { throw (err); }
      if (user) {
        cb(err, user);
      } else {
        let _user = new this(criteria);
        cb(null, _user.save());
      }
    });
  }
};

export const User =  mongoose.model('User', UserSchema, 'users');
