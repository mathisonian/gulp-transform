/*
 * gulp-transform
 * https://github.com/mathisonian/gulp-transform
 *
 * Copyright (c) 2014 Matthew Conlen
 * Licensed under the MIT license.
 */

'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var Converter=require('csvtojson').core.Converter;


var inputTypes = {
    TSV: 'tsv',
    CSV: 'csv',
    JSON: 'json'
};

function getExtension(filename) {
    var ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1];
}


var Transform = function(options) {
    if (!(this instanceof Transform)) {
        return new Transform(options);
    }

    if(typeof options === 'string') {
        this.inputType = options;
    }
};

Transform.prototype.csv = function(options) {
    throw new Error('Method not yet implemented');
    var transform = function(file, env, cb) {
        console.log(file);
        cb();
    };

    return through.obj(transform);
};

Transform.prototype.tsv = function(options) {

    throw new Error('Method not yet implemented');
    var transform = function(file, env, cb) {
        console.log(file);
        cb();
    };

    return through.obj(transform);
};

Transform.prototype.json = function(options) {

    var self = this;

    var transform = function(file, env, cb) {
        var csvConverter = new Converter(false);

        if(!self.inputType) {
            var extension = getExtension(file.path);
            self.inputType = extension.toLowerCase();
        }

        var delimiter = ',';

        if(self.inputType === inputTypes.TSV) {
            delimiter = '\t';
        }

        var bufs = [];

        file.path = gutil.replaceExtension(file.path, '.json');
        csvConverter.on('record_parsed', function(rowJSON) {
           bufs.push(rowJSON);
        });

        csvConverter.on('end_parsed', function() {
           file.contents = new Buffer(JSON.stringify(bufs));
           cb(null, file);
        });

        csvConverter.from.string(file.contents, {delimiter: delimiter}).on('error', function(err) {
            cb(err);
        });
    };

    return through.obj(transform);
};


module.exports = Transform;
