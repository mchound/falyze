var action = require('./action'),
    component = require('./component'),
    repository = require('./repository/repository'),
    serverRepository = require('./repository/serverRepository'),
    observable = require('./observable'),
    injector = require('./injector');

var lean = {
    createAction: function (aliases) {
        var _actions = {};
        if (aliases.constructor === String) {
            _actions[aliases] = new action(aliases);
        }
        else if (aliases.constructor === Array) {
            for (var i = 0; i < aliases.length; i++) {
                _actions[aliases[i]] = new action(aliases[i]);
            }
        }
        else {
            throw new Error('Argument exception. Argument must be of type String or Array');
        }
        return _actions;
    },
    createComponent: function (options) {
        return new component(options);
    },
    createRepository: function (options) {
        return new repository(options);
    },
    createServerRepository: function (options) {
        return new serverRepository(options);
    },
    observable: function (initial) {
        return new observable(initial);
    },
    inject: injector
};

module.exports = lean;