'use strict';

const { Browser, promise } = require('selenium-webdriver');
const fs = require('fs');
const Path = require('path');
const config = require('./config');

/**
 *
 * @param {type} str
 * @param {type} length
 * @param {type} fill
 * @returns {String}
 */
function padStart(str, length, fill){
	fill = (fill === undefined || fill === null ? '' : fill)
		.toString().substring(0, 1) || '0';
	
	str = (str === undefined || str === null ? '' : str).toString();

	while( str.length < length ){
		str = fill + str;
	}
	
	return str.substring(-length);
};

/**
 *
 * @returns {String}
 */
function timeSuffix(){
	let date = new Date();
	return date.getFullYear()
		+ padStart((date.getMonth() + 1), 2, '0')
		+ padStart(date.getDate(), 2, '0')
		+ padStart(date.getHours(), 2, '0')
		+ padStart(date.getMinutes(), 2, '0')
		+ padStart(date.getSeconds(), 2, '0')
		+ padStart(date.getMilliseconds(), 3, '0');
}

/**
 *
 * @param {type} browser
 * @param {type} path
 * @param {type} name
 * @param {type} stamp
 * @returns {String}
 */
function resolveScreenshot(browser, path, name, stamp){

	if( browser === Browser.IE ) browser = 'ie';
		else if( browser === Browser.EDGE ) browser = 'edge';

	let parse = Path.parse(name || '');
	
	if( !parse.name ){
		parse.name = timeSuffix();
	} else if( stamp !== false ){
		parse.name += '_' + timeSuffix();
	}

	parse.dir = !!parse.dir ? parse.dir + '/' + browser : browser;
	parse.ext = parse.ext || '.png';
	parse.base = parse.name + parse.ext;

	return Path.resolve(path || config.screenshots || '', Path.format(parse));
};

/**
 *
 * @param {type} path
 * @param {type} mode
 * @returns {nm$_util.promise.Promise}
 */
function accessPromise( path, mode ){
	return new promise.Promise( function(resolve, reject){
		fs.access(path, mode, function(error){
			if( error ){
				reject(error);
			} else {
				resolve(true);
			}
		});
	});
};

/**
 *
 * @param {type} path
 * @returns {unresolved}
 */
function mkdirPromise(path){
	return accessPromise(path).then(
		_ => path,
		() => new promise.Promise(function( resolve, reject ){
			fs.mkdir( path, function(err){
				if( err ){
					mkdirPromise(Path.dirname(path))
						.then(_ => mkdirPromise(path))
						.then(_ => resolve(path));
				} else {
					resolve(path);
				}
			});
		})
	);
};

/**
 *
 * @param {type} filename
 * @param {type} data
 * @param {type} options
 * @returns {unresolved}
 */
function writeFilePromise( filename, data, options ){
	return mkdirPromise(Path.dirname(filename))
		.then(_ => new promise.Promise(	(resolve, reject) =>
			fs.writeFile( filename, data,options,
			error => {
				if (error) reject(error);
				resolve(filename);
			})
		));
};

/**
 *
 * @param {type} filename
 * @param {type} data
 * @returns {unresolved}
 */
function writeText( filename, data ){
	return writeFilePromise( filename, data, { encoding: 'utf8', flag: 'w' });
};

/**
 *
 * @param {type} filename
 * @param {type} data
 * @returns {unresolved}
 */
function writeImage( filename, data ){
	return writeFilePromise( filename, data, { encoding: 'base64', flag: 'w' });
};

/**
 * @param {Function} condition
 * @param {Function} doIf
 * @param {Function} doElse
 * @returns {Function}
 */
function condition( condition, doIf, doElse ){
	const chooseFn = bool => bool === true ? doIf() : (doElse ? doElse() : undefined);
	
	if( typeof condition === 'function' ){
		return promise.fulfilled(condition()).then(chooseFn);
	}
	return promise.fulfilled(condition).then(val => chooseFn && chooseFn(val));
};

/**
 *
 * @param {Function} doIf
 * @param {Function} doElse
 * @returns {Function}
 */
function ifPromise(doIf, doElse){
	return function(value){
		return condition(value, doIf, doElse);
	};
};

module.exports = {
	ifPromise: ifPromise,
	condition: condition,

	padStart: padStart,
	timeSuffix: timeSuffix,

	resolveScreenshot: resolveScreenshot,

	mkdirPromise: mkdirPromise,
	accessPromise: accessPromise,
	writeFilePromise: writeFilePromise,
	writeText: writeText,
	writeImage: writeImage
};

