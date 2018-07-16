import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  access_token: String,
  token_type: String,
  expires_in: String
});
TokenSchema.set('timestamps', true);
TokenSchema.set('capped', { size: 1024, max: 1 });

// tslint:disable-next-line:typedef
TokenSchema.statics.getToken = function(cb: any) {
  return this.findOne({}, (err: any, token: any) => {
    if (err) { throw (err); }
    cb(token);
  });
};

TokenSchema.methods.isValid = function(): boolean {
  let createdAt = new Date(this.createdAt);
  let expires_in = new Date(createdAt + this.expires_in + '1000').toISOString();
  let now = new Date().toISOString();
  return now <= expires_in;
};

export const Token = mongoose.model('Token', TokenSchema, 'tokens');
