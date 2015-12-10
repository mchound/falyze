var _clone = require('lodash/lang/clone');

function observable(initial) {
    var

    _value = initial,

    _listeners = {},

    _id = 0,

    _notify = function (oldVal, newVal) {
        for (var l in _listeners) {
            _listeners[l].call(this, newVal, oldVal);
        }
    };

    this.get = function () {
        return _value;
    }

    this.set = function (val) {
        var old = !!_value ? (_value.constructor === Object ? _clone(_value) : _value) : _value;
        _value = val;
        _notify(old, val);
    }

    this.lurkSet = function (val) {
        _value = val;
    }

    this.observe = function (callback) {
        _listeners[_id++] = callback;
    }

    this.mute = function (callback) {
        for (var l in _listeners) {
            if (_listeners[l] === callback) {
                delete _listeners[l];
            }
        }
    }
}



module.exports = observable;