import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
/**
 * Course Child Schema
 */

const CourseChildSchema = new Schema(
  {
    id: String,
    parentId: String,
    dataSourceId: String,
    created: String
  }
);
CourseChildSchema.set('timestamps', true);

const default_select = 'id parentId dataSourceId created';


/**
 * Statics
 */
CourseChildSchema.statics = {

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
    console.log('[CourseChild.load()] [criteria]:', options.criteria);
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
      .populate('coursechildren', select)
      .sort({ _id: sort })
      .limit(limit)
      .skip(limit * page)
      .exec(cb);
  },
  // tslint:disable-next-line:typedef
  findOrCreate: function(options: any, cb: Function) {
    var criteria = options.criteria || {};
    this.findOne(options.criteria, (err: any, coursechild: any) => {
      if (err) { throw (err); }
      if (coursechild) {
        cb(err, coursechild);
      } else {
        let _coursechild = new this(criteria);
        cb(_coursechild.save());
      }
    });
  }
};

export const CourseChild = mongoose.model('CourseChild', CourseChildSchema, 'coursechildren');


