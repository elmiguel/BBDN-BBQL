import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
/**
 * Course Schema
 */

const CourseSchema = new Schema(
  {
    id: String,
    uuid: String,
    externalId: String,
    dataSourceId: String,
    courseId: String,
    name: String,
    description: String,
    created: Date,
    organization: Boolean,
    ultraStatus: String,
    allowGuests: Boolean,
    readOnly: Boolean,
    termId: String,
    availability: {
      available: String,
      duration: {
        type: { type: String }
      }
    },
    enrollment: {
      type: { type: String }
    },
    locale: {
      force: Boolean
    },
    hasChildren: Boolean,
    parentId: String,
    externalAccessUrl: String,
    guestAccessUrl: String
  });
CourseSchema.set('timestamps', true);

const default_select = 'id uuid externalId courseId courseName organization availability';


/**
 * Statics
 */
CourseSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  // tslint:disable-next-line:typedef
  load: function(options: any, cb: Function) {
    var select = options.select || default_select;
    console.log('[Course.load()] [criteria]:', options.criteria);
    return this.findOne(options.criteria)
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
    var criteria = options.criteria || {};
    this.findOne(options.criteria, (err: any, course: any) => {
      if (err) { throw (err); }
      if (course) {
        cb(err, course);
      } else {
        let _user = new this(criteria);
        cb(_user.save());
      }
    });
  }
};

export const Course = mongoose.model('Course', CourseSchema, 'courses');
