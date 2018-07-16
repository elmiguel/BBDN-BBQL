import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
/**
 * Data Source Schema
 */

const DataSourceSchema = new Schema(
  {
    id: String,
    externalId: String,
    description: String
  });
DataSourceSchema.set('timestamps', true);

const default_select = 'id externalId description';


/**
 * Statics
 */
DataSourceSchema.statics = {

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
    console.log('[DataSource.load()] [criteria]:', options.criteria);
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
      .populate('datasources', select)
      .sort({ _id: sort })
      .limit(limit)
      .skip(limit * page)
      .exec(cb);
  },
  // tslint:disable-next-line:typedef
  findOrCreate: function(options: any, cb: Function) {
    var criteria = options.criteria || {};
    this.findOne(options.criteria, (err: any, datasource: any) => {
      if (err) { throw (err); }
      if (datasource) {
        cb(err, datasource);
      } else {
        let _datasource = new this(criteria);
        cb(_datasource.save());
      }
    });
  }
};

export const DataSource = mongoose.model('DataSource', DataSourceSchema, 'datasources');
