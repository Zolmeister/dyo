/**
 * @return {number}
 */
export var now = Date.now

/**
 * @type {object}
 */
export var math = Math

/**
 * @return {number}
 */
export var random = math.random

/**
 * @param {number}
 * @return {number}
 */
export var abs = math.abs

/**
 * @constructor
 * @param {number}
 */
export var array = Array

/**
 * @constructor
 * @param {number}
 */
export var object = Object

/**
 * @param {object}
 * @return {Array<string>}
 */
export var keys = object.keys

/**
 * @param {(object|function)?}
 * @param {object}
 * @return {object}
 */
export var create = object.create

/**
 * @param {(object|function)}
 * @param {object?} a
 * @return {(object|function)}
 */
export var define = object.defineProperties

/**
 * @param {string?}
 * @return {(symbol|number)}
 */
export var symbol = typeof Symbol === 'function' ? Symbol : random

/**
 * @type {(symbol|string)}
 */
export var iterator = symbol.iterator || '@@iterator'

/**
 * @return {object}
 */
export function registry () {
	return typeof WeakMap === 'function' ? new WeakMap() : weakmap()
}

/**
 * @param {function} callback
 * @return {object}
 */
export function publish (callback) {
	return typeof Promise === 'function' ? new Promise(callback) : promise(callback)
}

/**
 * @param {function} callback
 * @param {number} duration
 * @return {number}
 */
export function timeout (callback, duration) {
	return setTimeout(callback, duration | 0)
}

/**
 * @param {function} callback
 * @return {number}
 */
export function request (callback) {
	return typeof requestAnimationFrame === 'function' ? requestAnimationFrame(callback) : setTimeout(callback, 16)
}

/**
 * @return {object}
 */
export function deadline () {
	return publish(request)
}

/**
 * @param {number} value
 * @return {number}
 */
export function hash (value) {
	return -((-(value + 1)) >>> 0) + 1
}

/**
 * @throws {Error}
 * @param {string} message
 */
export function invariant (message) {
	throw new Error(message)
}

/**
 * @param {string} message
 */
export function report (message) {
	console.error(message)
}

/*
 * @param {*} value
 * @return {boolean}
 */
export function fetchable (value) {
	return value && typeof value.blob === 'function' && typeof value.json === 'function'
}

/**
 * @param {*} value
 * @return {boolean}
 */
export function thenable (value) {
	return value && typeof value.then === 'function'
}

/**
 * @param {object} value
 * @param {boolean}
 */
export function iterable (value) {
	return typeof value[iterator] === 'function'
}

/**
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 */
export function is (a, b) {
	return a === b ? (a !== 0 || 1/a === 1/b) : (a !== a && b !== b)
}

/**
 * @param {object} value
 * @param {*} key
 * @return {boolean}
 */
export function has (value, key) {
	return object.hasOwnProperty.call(value, key)
}

/**
 * @param {function} value
 * @param {object} props
 * @param {object} proto
 * @return {function}
 */
export function extend (value, props, proto) {
	return proto ? define(value, {prototype: {value: create(proto, props)}}) : define(value.prototype, props), value
}

/**
 * @param {object} a
 * @param {object} b
 * @return {object}
 */
export function assign (a, b) {
	for (var key in b) {
		a[key] = b[key]
	}

	return a
}

/**
 * @param {object} a
 * @param {object} b
 * @return {object}
 */
export function defaults (a, b) {
  for (var key in b) {
    if (a[key] === undefined) {
      a[key] = b[key]
    }
  }

  return a
}

/**
 * @param {object} a
 * @param {object} b
 * @return {boolean}
 */
export function compare (a, b) {
	if (a !== b) {
		for (var key in a) {
			if (!has(b, key)) {
				return true
			}
		}

		for (var key in b) {
			if (!is(a[key], b[key])) {
				return true
			}
		}
	}

	return false
}

/**
 * @param {function} callback
 * @param {*?} value
 * @param {number} index
 */
export function each (callback, value, index) {
	if (value != null) {
		if (typeof value === 'object') {
			if (value.length > -1) {
				for (var i = 0; i < value.length; ++i) {
					if (each(callback, value[i], i + index) != null) {
						break
					}
				}
			} else if (typeof value[iterator] === 'function') {
				for (var i = index, j = value[iterator](), k = j.next(); !k.done; ++i) {
					if (each(callback, k.value, i + index) == null) {
						k = j.next()
					} else {
						break
					}
				}
			} else {
				return callback(value, index)
			}
		} else {
			return callback(value, index)
		}
	}
}

/**
 * @param {*} value
 * @param {function} fulfilled
 * @param {function?} rejected
 * @return {Promise?}
 */
export function resolve (value, fulfilled, rejected) {
	return value.then(function (value) {
		return fetchable(value) ? resolve(value.json(), fulfilled, rejected) : fulfilled(value)
	}, rejected)
}

/**
 * @param {function} callback
 */
export function promise (callback) {
	function execute (value) {
		try {
			for (var i = 0, entries = execute.entries, value = execute.value = value; i < entries.length; i++) {
				entries[i](value)
			}
		} finally {
			execute.entries = []
			execute.fulfill++
		}
	}

	try {
		return assign(execute, {then: function (callback) {
			return promise(function (resolve) {
				execute.entries.push(function (value) {
					resolve(callback(value))
				})

				if (execute.fulfill) {
					execute(execute.value)
				}
			})
		}, entries: [], fulfill: 0})
	} finally {
		callback(execute)
	}
}

/**
 * @return {object}
 */
export function weakmap () {
	return {
		key: symbol(),
		has: function (k) { return has(k, this.key) },
		get: function (k) { return k[this.key] },
		set: function (k, v) { return k[this.key] = v, this }
	}
}

/**
 * @return {string}
 */
export function environment () {
	try {
		return typeof process !== 'object' ? '' : typeof process.env !== 'object' ? process.env : process.env.NODE_ENV + ''
	} catch (error) {
		return ''
	}
}
