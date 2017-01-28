'use strict';

const config = require('./lib/config');



exports.suite = function(){
    console.log('[environment.suite] config:', config);
};

