var Store = require('./store'),
    __assign = require('lodash/object/assign'),
    __toArray = require('lodash/lang/toarray'),
    common = require('./common');

function MemStore(options) {

    var

	_callbackId = 0,

	_callbacks = {},

	_keywords = ['settings', 'get', 'on', 'off', 'actOn'],

	_default = {
	    key: 'id',
	    autoGenerateKey: false
	},

	_settings = __assign(_default, options.settings || {}),

    _store = new Store(options.settings),

    _privateInterface = {
        get: function (key) {
            return _store.get(key);
        },
        add: function () {
            var result = _privateInterface.silent.add.apply(this, arguments);
            common.notify(_callbacks, result.key, result.value);
            return result;
        },
        update: function () {
            var result = _privateInterface.silent.update.apply(this, arguments);
            common.notify(_callbacks, result.key, result.value);
            return result;
        },
        remove: function (key) {
            var result = _privateInterface.silent.remove(key);
            common.notify(_callbacks, result.key, result.value);
            return result;
        },
        silent: {
            add: function () {
                return _store.add.apply(this, __toArray(arguments));
            },
            update: function () {
                return _store.update.apply(this, __toArray(arguments));
            },
            remove: function (key) {
                return _store.remove(key);
            }
        }
    };

    this.get = _privateInterface.get;

    this.on = function () {
        common.on.apply(this, [_callbacks, _callbackId++].concat(__toArray(arguments)));
    }

    this.actOn = function (action, callback) {
        var callbackName = 'on' + action.alias.substring(0, 1).toUpperCase() + action.alias.slice(1);
        if (callback === undefined && options[callbackName] === undefined) {
            return;
        }
        else if (!!callback) {
            action.on(callback.bind(_privateInterface, _privateInterface));
        }
        else {
            action.on(options[callbackName].bind(_privateInterface, _privateInterface));
        }
    }

    this.off = common.off.bind(this, _callbacks);

    for (var p in options) {
        if (_keywords.indexOf(p) === -1) {
            this[p] = options[p];
        }
        else if (p !== 'settings') {
            throw new Error(p + ' is a reserved keyword but is used in store options for store ' + options.alias || '');
        }
    }

    if (!!options && !!options.initialize) {
        options.initialize.call(this, _privateInterface);
    }
};

module.exports = MemStore;