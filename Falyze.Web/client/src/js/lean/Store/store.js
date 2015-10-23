var __assign = require('lodash/object/assign'),
	__clone = require('lodash/lang/cloneDeep'),
	__toArray = require('lodash/lang/toarray');

function _createKey(settings, storeKey) {
    // No object is passed, this is not supported
    if (arguments.length < 3) {
        throw new Error('Store create key: Invalid argument exception. Undefined can not be added or updated to store');
    }
        // No key passed, autogenerate key turned off and key not found in object
    else if (arguments.length === 3 && !settings.autoGenerateKey && arguments[2][settings.key] === undefined) {
        throw new Error('Store create key: Invalid object passed. Object must contain key property ' + settings.key + '. Or set autoGenerateKey=true in the store settings ');
    }
        // No key passed but key exists in object or autoGenerateKey is active.
    else if (arguments.length === 3 && (arguments[2][settings.key] !== undefined || settings.autoGenerateKey)) {
        return settings.autoGenerateKey ? storeKey : arguments[2][settings.key];
    }
    else {
        return arguments[2];
    }
}

function _getKey(settings) {
    if (arguments.length === 2) {
        return arguments[1][settings.key];
    }
    else if (arguments.length === 3) {
        return arguments[1];
    }
}

function _get(store, key) {
    if (key === undefined || key === null) {
        return store;
    }
    else if (key.constructor !== String && key.constructor !== Number) {
        throw new Error('Invalid argument exception. Key must be of type String or Number');
    }
    else {
        return store[key];
    }
}

function _add(store, settings, key, obj) {
    if (store[key] !== undefined) {
        throw new Error('Store add: Invalid key. Object with key ' + key + ' is already present in the store. Did you mean update?');
    }
    else {
        store[key] = obj;

        if (settings.autoGenerateKey) {
            obj[settings.key] = key;
        }

        return {
            key: key,
            value: store[key]
        };
    }
}

function _update(store, key, obj) {
    if (store[key] === undefined) {
        throw new Error('Store update: Not found exception. Object with key ' + key + ' was not present in the store');
    }
    else {
        store[key] = obj;
        return {
            key: key,
            value: store[key]
        };
    }
}

function _remove(store, key) {
    if (store[key] === undefined) {
        throw new Error('Store remove: Not found exception. Object with key ' + key + ' was not present in the store');
    }
    else {
        var clone = __clone(store[key]);
        delete store[key];
        return {
            key: key,
            value: clone
        };
    }
}

function _clear(store) {
    for (var key in store) {
        delete store[key];
    }
}

function baseStore(options) {
    var

    _store = {},

    _storeAutoKey = 0,

    _default = {
        key: 'id',
        autoGenerateKey: false
    },

    _settings = __assign(_default, options);

    this.get = function (key) {
        return _get(_store, key);
    }

    this.add = function () {
        var _key = _createKey.apply(this, [_settings, _storeAutoKey++].concat(__toArray(arguments)));
        return _add(_store, _settings, _key, arguments.length === 2 ? arguments[1] : arguments[0]);
    }

    this.update = function () {
        var _key = _getKey.apply(this, [_settings].concat(__toArray(arguments)));
        return _update(_store, _key, arguments.length === 2 ? arguments[1] : arguments[0]);
    }

    this.remove = function (key) {
        if (key.constructor === Array) {
            var removed = [];
            for (var i = 0; i < key.length; i++) {
                removed.push(_remove(_store, key[i]));
            }
            return removed;
        }
        return _remove(_store, key);
    }

    this.clear = function () {
        _clear(_store);
    }
}

module.exports = baseStore;