/**
 * Component
 *
 * @param {Object?} _props
 */
function Component (_props) {
	var props = _props;
	var state = this.state;

	this.refs = null;
	this._tree = null;

	// props
	if (this.props === void 0) {
		if (props === object || props === void 0 || props === null) {
			props = {};
		}
		this.props = props;
	}
	// state
	if (state === void 0) {
		this.state = state = this.getInitialState !== void 0 ? dataBoundary(this, 1, props) : {};
	}
	this._state = state;
}

/**
 * Component Prototype
 *
 * @type {Object}
 */
var ComponentPrototype = {
	setState: {value: setState},
	forceUpdate: {value: forceUpdate},
	UUID: {value: 2}
};

Component.prototype = Object.create(null, ComponentPrototype);
ComponentPrototype.UUID.value = 1;

/**
 * Extend Class
 *
 * @param  {Class} type
 * @param  {Object} proto
 */
function extendClass (type, proto) {
	if (proto.constructor !== type) {
		Object.defineProperty(proto, 'constructor', {value: type});
	}
	Object.defineProperties(proto, ComponentPrototype);
}

/**
 * setState
 *
 * @param {Object} state
 * @param {Function=} callback
 */
function setState (state, callback) {
	var nextState;
	var prevState;
	var owner;

	if (state === void 0 || state === null) {
		return;
	}
	nextState = state;
	prevState = this._state = this.state;

	if (typeof nextState === 'function') {
		nextState = callbackBoundary(this, nextState, prevState, 0);

		if (nextState === void 0 || nextState === null) {
			return;
		}
	}

	if (nextState.constructor === Promise) {
		owner = this;
		nextState.then(function (value) {
			owner.setState(value);
		});
	} else {
		this.state = updateState({}, prevState, nextState);
		this.forceUpdate(callback);
	}
}

/**
 * forceUpdate
 *
 * @param {Function=} callback
 */
function forceUpdate (callback) {
	var older = this._tree;

	if (older === null || older.async !== 0 || older.node === null) {
		return;
	}
	patch(older, older, 1, older);

	if (callback !== void 0 && typeof callback === 'function') {
		callbackBoundary(this, callback, this.state, 1);
	}
}

/**
 * Update State
 *
 * @param  {Object} state
 * @param  {Object} prevState
 * @param  {Object} nextState
 * @return {Object}
 */
function updateState (state, prevState, nextState) {
	for (var name in prevState) {
		state[name] = prevState[name];
	}
	for (var name in nextState) {
		state[name] = nextState[name];
	}
	return state;
}

/**
 * shouldUpdate
 *
 * @param  {Tree} older
 * @param  {Tree} _newer
 * @param  {Number} group
 * @param  {Tree} ancestor
 * @return {Tree?}
 */
function shouldUpdate (older, _newer, group, ancestor) {
	var type = older.type;
	var owner = older.owner;
	var nextProps = _newer.props;
	var prevProps = older.props;
	var recievedProps;
	var defaultProps;
	var prevState;
	var nextState;
	var nextProps;
	var prevProps;
	var newer;
	var host;
	var tag;

	if (owner === null || older.async !== 0) {
		return;
	}
	older.async = 1;

	if (group === 1) {
		nextState = owner.state;
		prevState = owner._state;
	} else {
		nextState = nextProps;
		prevState = prevProps;
	}

	if ((recievedProps = nextProps !== object) === true) {
		if (type.propTypes !== void 0) {
			propTypes(type, nextProps);
		}
		if (owner.componentWillReceiveProps !== void 0) {
			dataBoundary(owner, 0, nextProps);
		}
		defaultProps = older.type.defaultProps;

		if (defaultProps !== void 0) {
			merge(defaultProps, nextProps);
		}
	}

	if (
		owner.shouldComponentUpdate !== void 0 &&
		updateBoundary(owner, 0, nextProps, nextState) === false
	) {
		older.async = 0;
	} else {
		if (recievedProps === true) {
			(group === 1 ? owner : older).props = nextProps;
		}
		if (owner.componentWillUpdate !== void 0) {
			updateBoundary(owner, 1, nextProps, nextState);
		}

		newer = shape(renderBoundary(group === 1 ? owner : older, group), older);

		if ((tag = newer.tag) !== older.tag) {
			newer = updateHost(older, newer, ancestor, tag);
		}
		if (owner.componentDidUpdate !== void 0) {
			updateBoundary(owner, 2, prevProps, prevState);
		}
		return older.async === 2 ? void 0 : (older.async = 0, newer);
	}
}

/**
 * Update Host
 *
 * @param  {Tree} older
 * @param  {Tree} newer
 * @param  {Tree} ancestor
 * @param  {String?} tag
 */
function updateHost (older, newer, ancestor, tag) {
	var host;
	var owner;
	var type;
	var group;

	if (tag !== null) {
		return exchange(older, newer, 0, older);
	}

	if ((host = older.host) !== null) {
		owner = host.owner;
		type = newer.type;

		if (owner === type || (owner instanceof type)) {
			return patch(host, newer, host.group, ancestor);
		}
	}
	exchange(older, newer, 2, older);
	refresh(older);
}

/**
 * PropTypes
 *
 * @param {Function|Class} type
 * @param {Object} props
 */
function propTypes (type, props) {
	var validators = type.propTypes;
	var display = type.name;
	var result;

	for (var name in validators) {
		if (result = validators[name](props, name, display)) {
			console.error(result);
		}
	}
}