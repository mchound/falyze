var MemStore = require('./Store/memStore'),
    ServerStore = require('./Store/serverStore'),
	action = require('./action'),
    controller = require('./controller'),
    injector = require('./Injector'),
    connector = require('./connector'),
    __toArray = require('lodash/lang/toArray');

var Lean = {
    createStore: function (options) {
        return new MemStore(options);
    },
    createServerStore: function (options) {
        return new ServerStore(options);
    },
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
    createController: function (options) {
        return new controller(options);
    },
    inject: injector,
    connectDom: function(context, connectors){
        var nodes = context.querySelectorAll('[data-lean-dom-connector]');
        var _connectors = [];
        __toArray(nodes).forEach(function (node) {
            var domSelector = node.getAttribute('data-lean-dom-connector');
            _connectors.push(new connector(domSelector, node, connectors[domSelector]));
        });
        return _connectors;
    }
};

module.exports = Lean;