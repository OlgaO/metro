'use strict';
import express = require('express');
import fs = require('fs');
import path = require('path');

import Adapter from '../fetch-adapters/yadapter';
import * as tr from '../metro-graph';

var router = express.Router();

router.get('/updategraph', (req, res, next) => {
    const url = 'https://maps.yandex.ru/export/usermaps/geSTNBuviAaKSWp8lkQE4G7Oha2K8cUr.kml';
    let adapter = new Adapter(url);
    adapter.parseFile().then(graph => {
        let json = graph.toJSON();
        fs.writeFile('./json/graph.json', json, 'utf8', err => {
            if (err) throw err;
            console.time('recreation takes');
            const mg = new tr.MetroGraph(json);
            console.timeEnd('recreation takes');
        });
    }).catch(err => console.error(err));
});

//router.get('/metro', (req, res, next) => res.sendFile(path.resolve('./html/metro.html')));

// get graph in json
//router.get('/metrograph', (req, res, next) => res.sendFile(path.resolve('./json/graph.json')));
/* GET home page. */
//router.get('/', (req, res, next) => res.render('index', {title: 'Express'}));

//export default router;
export default router;
