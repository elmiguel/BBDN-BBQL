import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
/**
 * Institution Role Schema
 */

const InstitutionRoleSchema = new Schema(
  {
    id: String,
    roleId: String,
    description: String,
    custom: Boolean
  }
);
InstitutionRoleSchema.set('timestamps', true);

const default_select = 'id roleId description custom';


/**
 * Statics
 */
InstitutionRoleSchema.statics = {

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
    console.log('[InstitutionRole.load()] [criteria]:', options.criteria);
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
      .populate('institutionroles', select)
      .sort({ _id: sort })
      .limit(limit)
      .skip(limit * page)
      .exec(cb);
  },
  // tslint:disable-next-line:typedef
  findOrCreate: function(options: any, cb: Function) {
    var criteria = options.criteria || {};
    this.findOne(options.criteria, (err: any, institutionrole: any) => {
      if (err) { throw (err); }
      if (institutionrole) {
        cb(err, institutionrole);
      } else {
        let _institutionrole = new this(criteria);
        cb(_institutionrole.save());
      }
    });
  }
};

export const InstitutionRole = mongoose.model('InstitutionRole', InstitutionRoleSchema, 'institutionroles');


