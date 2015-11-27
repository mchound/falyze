var Store = require('./store'),
    __assign = require('lodash/object/assign'),
    __toArray = require('lodash/lang/toarray'),
    common = require('./common'),
    Ajax = require('../../utils/ajax');

function ServerStore(options) {

    if (!options || !options.settings || !options.settings.controller) {
        throw new Error('Controller must be defined in server store options');
    }

    var

    _this = this,

	_callbackId = 0,

	_callbacks = {},

	_keywords = ['settings', 'get', 'on', 'off', 'actOn'],

	_default = {
	    key: 'id',
	    autoGenerateKey: false
	},

	_settings = __assign(_default, options.settings || {}),

    _store = new Store(options.settings),

    _serverGet = function (suffix, data) {
        _this.status = 'pending';
        common.notify(_callbacks, null, null);
        
        var onSuccess = function (items) {
            if (items.constructor === Array) {
                items.forEach(function (item) {
                    _store.add(item[_settings.key], item);
                });
            }
            else if (items.constructor === Object) {
                for (var p in items) {
                    var existing = _store.get(p);
                    if (existing === undefined) {
                        _store.add(p, items[p]);
                    }
                    else {
                        _store.update(p, items[p]);
                    }                        
                }
            }
            _this.status = 'waiting';
            common.notify(_callbacks, null, items);
        };

        var onError = function () {
            console.log(arguments);
            _this.status = 'error';
            common.notify(_callbacks, null, null);
        };

        if (!data) {
            Ajax.get(_settings.controller + suffix, onSuccess, onError);
        }
        else {
            Ajax.post(_settings.controller + suffix, onSuccess, onError);
        }
    },

    _privateInterface = {
        get: function (key) {
            var store = _store.get();
            if (Object.keys(store).length === 0) return undefined;
            if (!!key) return store[key];
            else if (!!_settings.getMethod && _settings.getMethod.toLowerCase() === 'object') {
                return store;
            }
            else {
                return Object.keys(store).map(function (key) {
                    return store[key];
                });
            }
        },
        add: function (obj) {
            Ajax.post(
                _settings.controller,
                obj,
                function (added) {
                    var key = added[_settings.key];
                    _privateInterface.silent.add(key, added);
                    common.notify(_callbacks, key, added);
                },
                function () {
                    console.log(arguments);
                }
            );
        },
        update: function (obj) {
            Ajax.put(
                _settings.controller,
                obj,
                function (updated) {
                    var key = updated[_settings.key];
                    _privateInterface.silent.update(updated);
                    common.notify(_callbacks, key, updated);
                },
                function () {
                    console.log(arguments);
                }
            );
        },
        remove: function (key) {
            Ajax.remove(
                _settings.controller + key,
                function (deleted) {
                    _privateInterface.silent.remove(key);
                    common.notify(_callbacks, key, deleted);
                },
                function () {
                    console.log(arguments);
                }
            );
        },
        clear: function(){
            _privateInterface.silent.clear();
            common.notify(_callbacks, null);
        },
        fetch: _serverGet,
        local: {
            add: function () {
                var added = _privateInterface.silent.add.apply(this, __toArray(arguments));
                common.notify(_callbacks, null, added);
                return added;
            },
            update: function () {
                var updated = _privateInterface.silent.update.apply(this, __toArray(arguments));
                common.notify(_callbacks, null, updated);
                return updated;
            },
            remove: function () {
                var removed = _privateInterface.silent.remove.apply(this, __toArray(arguments));
                common.notify(_callbacks, null, removed);
                return removed;
            }
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
            },
            clear: function () {
                _store.clear();
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

    this.status = 'waiting';

    for (var p in options) {
        if (_keywords.indexOf(p) === -1) {
            this[p] = options[p];
        }
        else if (p !== 'settings') {
            throw new Error(p + ' is a reserved keyword but is used in store options for store ' + options.alias || '');
        }
    }

    if (!!options && !!options.initialize) {
        options.initialize.call(this, _privateInterface, { get: _serverGet });
    }
}

module.exports = ServerStore;