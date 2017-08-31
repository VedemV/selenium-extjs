'use strict';

/**
 * @class until.types
 */

/**
 * Тип значения переменной
 *
 * @param {Mixed} v
 * @return {String}
 */
function trueType(v) {
	if (v === null) { return 'null'; }
	let type = typeof v;
	if (type === 'object') {
		if (Array.isArray(v)) { type = 'array'; }
		if (v instanceof Date){ type = 'date'; }
	}
	return type;
};

/**
 * Проверка типа значения
 * @param {Mixed} v
 * @param {String} want
 * @return {Mixed}
 */
function checkType(v, want) {
	let got = trueType(v);
	if (got !== want) {
		throw new TypeError('require ' + want + ', but got ' + got);
	}
	return v;
};

/**
 * @method
 * @param {Number} v
 * @return {Number}
 */
const checkNumber = v => checkType(v, 'number');

/**
 * @method
 * @param {Function} v
 * @return {Function}
 */
const checkFunction = v => checkType(v, 'function');

/**
 * @method
 * @param {String} v
 * @return {String}
 */
const checkString = v => checkType(v, 'string');

/**
 * @method
 * @param {Object} v
 * @return {Object}
 */
const checkObject = v => checkType(v, 'object');

/**
 * @method
 * @param {Date} v
 * @return {Object}
 */
const checkDate = v => checkType(v, 'date');

/**
 * @method
 * @param {Function} v
 * @return {Boolean}
 */
const isFunction = v => trueType(v) === 'function';

/**
 * @method
 * @param {Number} v
 * @return {Boolean}
 */
const isNumber = v => trueType(v) === 'number';

/**
 * @method
 * @param {Object} v
 * @return {Boolean}
 */
const isObject = v => trueType(v) === 'object';

/**
 * @method
 * @param {Date} v
 * @return {Boolean}
 */
const isDate = v => trueType(v) === 'date';

/**
 * @method
 * @param {String} v
 * @return {Boolean}
 */
const isString = v => trueType(v) === 'string';


/**
 * @param {Mixed} value
 * @param {Function} predicate
 * @return {Boolean|Promise}
 */
function evaluate (value, predicate) {
	if (isObject(value) && isFunction(value.then)) {
		return value.then(predicate);
	}
	predicate(value);
};

module.exports = {
	trueType: trueType,
	checkType: checkType,
	
	checkNumber: checkNumber,
	checkFunction: checkFunction,
	checkString: checkString,
	checkObject: checkObject,
	checkDate: checkDate,

	isFunction: isFunction,
	isNumber: isNumber,
	isObject: isObject,
	isString: isString,
	isDate: isDate,

	evaluate: evaluate
};

