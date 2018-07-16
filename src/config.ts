
export const mongooseConfig: any = {
  database: 'mongodb://localhost:27017/BBQL'
};


export const BbConfig = {
  key: '<KEY>',
  secret: '<SECRET>',
  credentials: 'client_credentials',
  cert_path: './trusted/keytool_crt.pem',
  url: 'https://<INSTANCE>/learn/api/public/v1',
  auth: ''
};

BbConfig.auth = Buffer.from(BbConfig.key + ':' + BbConfig.secret).toString('base64');

