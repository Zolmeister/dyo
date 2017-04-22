/**
 * ## Constants
 */
var version = '7.0.0';
var noop = function () {};
var array = [];
var object = {};
var browser = global.window !== void 0;
var Promise = global.Promise || noop;
var schedule = global.requestIdleCallback || global.requestAnimationFrame || setTimeout;

/**
 * ## Element Flag
 *
 * 1: text
 * 2: element
 * 3: error
 *
 * ## Element Group
 *
 * 0: Element
 * 1: Function
 * 2: Component
 *
 * ## Element Shape
 *
 * tag: node tag {String}
 * type: node type {Function|Class|String}
 * props: node properties {Object?}
 * attrs: node attributes {Object?}
 * children: node children {Array<Tree>}
 * key: node key {Any}
 * flag: node flag {Number}
 * xmlns: node xmlns namespace {String?}
 * owner: node component {Component?}
 * node: node DOM reference {Node?}
 * group: node ground {Number}
 * host: node host component(composites) {Component?}
 * async: node work state {Number} 0: ready, 1:blocked, 2:pending
 * yield: coroutine {Function?}
 * parent: host parent
 */

/**
 * ## Component Shape
 *
 * _older: current tree {Tree?}
 * _async: component async, tracks async lifecycle methods flag {Number}
 * _state: previous cached state {Object}
 * _pending: pending cached state {Object}
 *
 * props: current props {Object}
 * state: current state {Object}
 * refs: refs {Object?}
 * setState: method {Function}
 * forceUpdate: method {Function}
 */
