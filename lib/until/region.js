'use strict';

const { promise } = require('selenium-webdriver');
const { isNumber, isObject } = require('./types');

/**
 * @class until.Region
 *
 * @constructor
 * @param {Number|Object|Promise} x
 * @param {Number|Object|Promise} y
 * @param {Number} [width]
 * @param {Number} [height]
 *
 */
module.exports = class Region {
	
	constructor(){
		let location = {x: 0, y: 0};
		let size = {width: 0, height: 0};

		this.initilized = false;

		if( promise.isPromise(arguments[0]) && promise.isPromise(arguments[1]) ){
			this.left = location.x;
			this.top = location.y;
			this.right = this.left + size.width;
			this.bottom = this.top + size.height;
			this._initilized = promise.all([arguments[0],arguments[1]])
				.then( params => {
					this.left = params[0].x;
					this.top = params[0].y;
					this.right = this.left + params[1].width;
					this.bottom = this.top + params[1].height;
					return this.initilized = true;
				});
			return;
		}
		
		if( isObject(arguments[0]) ){
			location = {
				x: isNumber(arguments[0].x) ? arguments[0].x : location.x,
				y: isNumber(arguments[0].y) ? arguments[0].y : location.y
			};
			// (location, size)
			if( isObject(arguments[1]) ){
				size = {
					width: isNumber(arguments[1].width) ? arguments[1].width : size.width,
					height: isNumber(arguments[1].height) ? arguments[1].height : size.height
				};
			// (location, width, height)
			} else if( isNumber(arguments[1]) && isNumber(arguments[2]) ){
				size = {
					width: arguments[1],
					height: arguments[2]
				};
			}
		// (x, y, ...)
		} else if( isNumber(arguments[0]) && isNumber(arguments[1]) ){
			location = {
				x: arguments[0],
				y: arguments[1]
			};
			// (x, y, size)
			if( isObject(arguments[2]) ){
				size = {
					width: isNumber(arguments[2].width) ? arguments[2].width : size.width,
					height: isNumber(arguments[2].height) ? arguments[2].height : size.height
				};
			// (x, y, width, height)
			} else if( isNumber(arguments[2]) && isNumber(arguments[3]) ){
				size = {
					width: arguments[2],
					height: arguments[3]
				};
			}
		}

		this.left = location.x;
		this.top = location.y;
		this.right = this.left + size.width;
		this.bottom = this.top + size.height;
		this.initilized = true;
	}

	/**
	 * Возвращает флаг готовности получения координат из WebElement`а
	 * 
	 * @returns {fulfilled.opt_value|nm$_promise.ManagedPromise|Promise|!Thenable<T>}
	 */
	get initialize(){
		if( typeof this._initilized !== 'undefined' ){
			return this._initilized;
		}
		return promise.fulfilled(this.initilized);
	}

	/**
	 * Проверяет, содержит ли область точку с координатами x, y
	 *
	 * @param {type} x
	 * @param {type} y
	 * @returns {Boolean}
	 */
	contains(x, y){
		return (this.left <= x && this.right >= x)
			&& (this.top <= y && this.bottom >= y);
	}

	/**
	 * Координаты верхней левой точки
	 * @returns {nm$_region.Region.get location.regionAnonym$1}
	 */
	get location(){
		return {x: this.left, y: this.top};
	}

	/**
	 * Ширина области
	 * @returns {Number}
	 */
	get width(){
		return this.right - this.left;
	}

	/**
	 * Высота области
	 * @returns {Number}
	 */
	get height(){
		return this.bottom - this.top;
	}

	/**
	 * Объект с размером области
	 * @returns {nm$_region.Region.get size.regionAnonym$2}
	 */
	get size(){
		return {width: this.width, height: this.height};
	}

	/**
	 * Возвращает промисифицированный объект Region с координатами
	 * расположения WebElement`а
	 *
	 * @param {type} element
	 * @returns {nm$_promise.ManagedPromise|cb.promise|!ManagedPromise<R>}
	 */
	static fromWebElement(element){
		return promise.fulfilled(element).then( 
			el => el.getLocation().then(
				location => el.getSize().then( size => new Region(location, size) )
			)
		);
	}

	/**
	 * Возвращает объект Region с координатами
	 * расположения WebElement`а.
	 *
	 * Для провеки получения координат
	 * использовать #initilized
	 * или #initilize.then(...)
	 *
	 * @param {type} element
	 * @returns {nm$_region.Region}
	 */
	static regionWebElement(element){
		return new Region(element.getLocation(), element.getSize());
	}

};

