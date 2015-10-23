module.exports = {
    notify: function (callbacks, key, obj) {
        for (var c in callbacks) {
            var cb = callbacks[c];
            if (cb.keys === undefined || cb.keys.indexOf(key) > -1) {
                cb.callback(obj);
            }
        }
    },
    on: function (callbacks, id) {
        if (arguments.length < 3) {
            return;
        }
            // Callback without property filter
        else if (arguments.length === 3 && arguments[2].constructor === Function) {
            callbacks[id] = {
                callback: arguments[2]
            };
        }
            // Callback with property filter meaning this will only be notified when certian keys been added, updated or deleted
        else if (arguments.length === 4 && arguments[2].constructor === Array && arguments[3].constructor === Function) {
            callbacks[id] = {
                callback: arguments[3],
                keys: arguments[2]
            };
        }
    },
    off: function _off(callbacks, callback) {
        for (var c in callbacks) {
            if (callbacks[c].callback == callback) {
                delete callbacks[c];
            }
        }
    }
}