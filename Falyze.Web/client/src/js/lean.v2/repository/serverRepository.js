var Observable = require('../observable'),
    repository = require('./repository'),
    _assign = require('lodash/object/assign'),
    _indexBy = require('lodash/collection/indexBy'),
    Ajax = require('../../utils/ajax');

function _internalAjax(repo, endpoint, onComplete) {
    var

    _onSuccess = function (method, entities) {
        onComplete.call();
        if (method === 'GET') {
            repo.model.set(_indexBy(entities, 'id'));
        }
        else if (method === 'PUT' || method === 'POST') {
            var model = repo.model.get();
            model[entities.id] = entities; // Single
            repo.model.set(model);
        }
        else if (method === 'POST-MANY') {
            var model = repo.model.get();
            entities.forEach((e) => { model[e.id] = e });
            repo.model.set(model);
        }
        // Delete
        else {
            var model = repo.model.get();
            delete model[entities];
            repo.model.set(model);
        }

        // Callbacks
        if (!!_cbSuccess && _cbSuccess.constructor === Function) {
            _cbSuccess.call(this, entities);
        }
        else if (!!_cbSuccess) {
            console.log(_cbSuccess);
        }
    },

    _onError = function (xhr) {
        onComplete.call();
        if (!!_cbError && _cbError.constructor === Function) {
            _cbError.call(this, xhr);
        }
        else if (!!_cbError) {
            console.log(_cbError);
        }
    },

    _then = function () {
        var self = this;
        this.then = function (cb) {
            _cbSuccess = cb;
            return self;
        }
        this.error = function (cb) {
            _cbError = cb;
            return self;
        }
    },

    _cbSuccess,
    _cbError;

    this.get = function (url) {
        Ajax.get((endpoint || '') + url, _onSuccess.bind(this, 'GET'), _onError);
        return new _then();
    }

    this.post = function (url, data, onSuccess, onError) {
        Ajax.post((endpoint || '') + url, data, _onSuccess.bind(this, 'POST'), _onError);
        return new _then();
    }

    this.postMany = function (url, data, onSuccess, onError) {
        Ajax.post((endpoint || '') + url, data, _onSuccess.bind(this, 'POST-MANY', data), _onError);
        return new _then();
    }

    this.put = function (url, data, onSuccess, onError) {
        Ajax.put((endpoint || '') + url, data, _onSuccess.bind(this, 'PUT'), _onError);
        return new _then();
    }
    
    this.remove = function (url, onSuccess, onError) {
        Ajax.remove((endpoint || '') + url, _onSuccess.bind(this, 'DELETE'), _onError);
        return new _then();
    }
}

function serverRepository(options) {
    if (!options || !options.alias) {
        throw new Error('When creating a server repository, alias property must be included in options argument');
    }

    var

    _keywords = ['model', 'initialize', 'observe', 'mute', 'getModel', 'get', 'settings'],

    _settings = {},

    _pendingRequests = 0,

    _internalRepository = new repository({
        alias: options.alias, model: new Observable({})
    }),

    _onRequestComplete = function () {
        _pendingRequests--;
    };

    _assign(_settings, options.settings || {});

    this.alias = options.alias;
    this.model = _internalRepository.model;

    for (var o in options) {
        if (_keywords.indexOf(o) === -1) {
            this[o] = options[o];
        }
    }

    this.observe = _internalRepository.observe;

    this.mute = _internalRepository.mute;

    this.getModel = function () {
        var model = _internalRepository.getModel();
        if (!!model) {
            return Object.keys(model).map((o) => model[o]);
        }
    }

    this.server = {
        get: function (url) {
            _pendingRequests++;
            return new _internalAjax(_internalRepository, _settings.endpoint, _onRequestComplete).get(url || '');
        },
        post: function (data, url) {
            _pendingRequests++;
            return new _internalAjax(_internalRepository, _settings.endpoint, _onRequestComplete).post(url || '', data);
        },
        put: function (data, url) {
            _pendingRequests++;
            return new _internalAjax(_internalRepository, _settings.endpoint, _onRequestComplete).put(url || '', data);
        },
        remove: function (url) {
            _pendingRequests++;
            return new _internalAjax(_internalRepository, _settings.endpoint, _onRequestComplete).remove(url || '');
        }
    }

    this.isPending = function () {
        return _pendingRequests > 0;
    }

    if (!!options.initialize && options.initialize.constructor === Function) {
        options.initialize.call(this);
    }
}

serverRepository.prototype.reactOn = function (action, callback) {
    var localCallbackName = 'on' + action.alias.substring(0, 1).toUpperCase() + action.alias.slice(1);
    if (!callback && !this[localCallbackName]) {
        throw new Error('No callback specified when trying to act on action: ' + action.alias + ' for store: ' + this.alias);
    }
    else if (!!callback && !this[localCallbackName] && callback.constructor !== Function) {
        throw new Error('Callback is not a function when tryin got act on action: ' + action.alias + ' for store: ' + this.alias);
    }
    else if (!callback && !!this[localCallbackName] && this[localCallbackName].constructor !== Function) {
        throw new Error('Callback is not a function when tryin got act on action: ' + action.alias + ' for store: ' + this.alias);
    }
    else if (!!callback && callback.constructor !== Function && !!this[localCallbackName] && this[localCallbackName].constructor !== Function) {
        throw new Error('Callback is not a function when tryin got act on action: ' + action.alias + ' for store: ' + this.alias);
    }
    else {
        if (!!callback) {
            action.on(callback);
        }
        if (!!this[localCallbackName]) {
            action.on(this[localCallbackName]);
        }
    }
    throw new Error('Unspecified error when tryin got act on action: ' + action.alias + ' for store: ' + this.alias);
}

serverRepository.prototype.subscribeTo = function (observable, callback) {
    observable.observe(callback.bind(this));
}

module.exports = serverRepository;