'use strict';
import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as mongoStore from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import { mongooseConfig, BbConfig } from './config';
import { Token } from './models/token';
import { setToken, apiLog } from './rest-utils';

mongoStore(session);
(<any>mongoose).Promise = bluebird;

mongoose.connection.once('open', () => {
  mongoose.connection.on('error', (err: any) => { console.log(err); });
});

mongoose.connect(mongooseConfig.database);

// some variable setup
const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
// const DEBUG = process.env.NODE_DEBUG === '*' ? true : false;

// Express app creation and configuration
export const app = express();

// Do not display: Express JS in the x-powered-by header
app.set('x-powered-by', false);

// Allow trust from proxies and SSL support from your load balancer
// Especially if you are running on NGINX and upstreams
app.enable('trust proxy');

// Add our BbConfig to our app
app.locals.bbApiUrl = BbConfig.url;

(<any>Token).getToken((token: any) => {
  if (token && token.isValid()) {
    app.locals.bbpayload = token;
  } else {
    setToken((_token: any) => {
      app.locals.bbpayload = _token;
    });
  }
});

// setup body-parser and method-override lets express have access to body posts
// and PUT AND PATCH methods.
app.use(apiLog);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride((req: any) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// error handling
// development will print stacktrace esle an empty object
app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: ENV === 'development' ? err : {}
  });
});

//now that the app is setup, start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

