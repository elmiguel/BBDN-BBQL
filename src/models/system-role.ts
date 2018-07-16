import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
/**
 * System Role Schema
 */

const SystemRoleSchema = new Schema(
  {
    id: String,
    roleId: String,
    description: String,
    custom: Boolean
  }
);
SystemRoleSchema.set('timestamps', true);

const default_select = 'id roleId description custom';


/**
 * Statics
 */
SystemRoleSchema.statics = {

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
    console.log('[SystemRole.load()] [criteria]:', options.criteria);
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
      .populate('systemroles', select)
      .sort({ _id: sort })
      .limit(limit)
      .skip(limit * page)
      .exec(cb);
  },
  // tslint:disable-next-line:typedef
  findOrCreate: function(options: any, cb: Function) {
    var criteria = options.criteria || {};
    this.findOne(options.criteria, (err: any, systemrole: any) => {
      if (err) { throw (err); }
      if (systemrole) {
        cb(err, systemrole);
      } else {
        let _systemrole = new this(criteria);
        cb(_systemrole.save());
      }
    });
  }
};

export const SystemRole = mongoose.model('SystemRole', SystemRoleSchema, 'systemroles');


