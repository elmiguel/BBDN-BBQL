import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
/**
 * Course Role Schema
 */

const CourseRoleSchema = new Schema(
  {
    id: String,
    roleId: String,
    nameForCourses: String,
    nameForOrganizations: String,
    description: String,
    custom: Boolean,
    actAsInstructor: Boolean,
    availability: {
      available: String
    }
  }
);
CourseRoleSchema.set('timestamps', true);

const default_select = 'id roleId body nameForCourses nameForOrganizations description custom actAsInstructor availability';


/**
 * Statics
 */
CourseRoleSchema.statics = {

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
    console.log('[CourseRole.load()] [criteria]:', options.criteria);
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
      .populate('courseroles', select)
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

export const CourseRole = mongoose.model('CourseRole', CourseRoleSchema, 'courseroles');


