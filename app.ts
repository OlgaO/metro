/// <reference path="./typings/tsd.d.ts" />
'use strict';

import express = require('express');
import path = require('path');
//import logger = require('morgan');
import bodyParser = require('body-parser');
import routes from './routes/router';

const app: express.Express = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));
app.use('/', routes);
//app.use('/users', users);

export default app;