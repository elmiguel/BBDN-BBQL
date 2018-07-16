'use strict';
// import { Response, Request } from 'express';
import { app } from './express-app';
import { restAPIRouter } from './rest-api';
import { BbQL } from './bbql-app';
// mount our api router

app.use('/api', restAPIRouter);

// pass the app into our BbQL function factory
BbQL(app);
app.get('/', (req: any, res: any) => res.redirect('/api'));
