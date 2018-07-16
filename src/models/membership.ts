import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
/**
 * Membership Schema
 */

const MembershipSchema = new Schema(
  {
    userId: String,
    courseId: String,
    childCourseId: String,
    dataSourceId: String,
    created: String,
    availability: {
      available: String
    },
    courseRoleId: String,
    bypassCourseAvailabilityUntil: String,
    lastAccessed: String,
    user: { type: String, ref: 'User.id' }
  }
);
MembershipSchema.set('timestamps', true);

const default_select = 'id uuid externalId courseId courseName organization availability';


/**
 * Statics
 */
MembershipSchema.statics = {

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
      .populate('user', select)
      .sort({ _id: sort })
      .limit(limit)
      .skip(limit * page)
      .exec(cb);
  },
  // tslint:disable-next-line:typedef
  findOrCreate: function(options: any, cb: Function) {
    var criteria = options.criteria || {};
    this.findOne(options.criteria, (err: any, membership: any) => {
      if (err) { throw (err); }
      if (membership) {
        cb(err, membership);
      } else {
        let _membership = new this(criteria);
        cb(_membership.save());
      }
    });
  }
};

export const Membership = mongoose.model('Membership', MembershipSchema, 'memberships');


