var _assign = require('lodash/object/assign'),
    Observable = require('../observable');

function observe(observable, callback) {
    if (observable.constructor === Object) {
        for(var p in observable){
            observe(observable[p], callback);
        }
    }
    else if (observable.constructor === Observable) {
        observable.observe(callback);
    }
}

function mute(observable, callback) {
    if (observable.constructor === Object) {
        for (var p in observable) {
            observe(observable[p], callback);
        }
    }
    else if (observable.constructor === Observable) {
        observable.mute(callback);
    }
}

function getReadableModel(model, result) {
    var res = result || {};
    if (model.constructor === Object) {
        for (var p in model) {
            res[p] = getReadableModel(model[p]);
        }
    }
    else if (model.constructor === Observable) {
        return model.get();
    }
    else {
        return model;
    }
    return res;
}

function repository(options) {

    if (!options || !options.model) {
        throw new Error('When creating a repository, model property must be included in options argument');
    }

    if (!options || !options.alias) {
        throw new Error('When creating a repository, alias property must be included in options argument');
    }

    var

    _settings = {},

    _keywords = ['model', 'initialize', 'observe', 'mute', 'getModel', 'get', 'settings'];

    _assign(_settings, options.settings || {});

    this.alias = options.alias;
    this.model = options.model;

    if (!!options.initialize && options.initialize.constructor === Function) {
        options.initialize.call(this);
    }

    for (var o in options) {
        if (_keywords.indexOf(o) === -1) {
            this[o] = options[o];
        }
    }
}

repository.prototype.observe = function (callback) {
    observe(this.model, callback);
}

repository.prototype.mute = function (callback) {
    mute(this.model, callback);
}

repository.prototype.reactOn = function (action, callback) {
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
    else if(!!callback && callback.constructor !== Function && !!this[localCallbackName] && this[localCallbackName].constructor !== Function){
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

repository.prototype.getModel = function () {
    return getReadableModel(this.model);
}

module.exports = repository;