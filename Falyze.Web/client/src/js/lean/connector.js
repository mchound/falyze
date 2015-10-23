var __toArray = require('lodash/lang/toArray'),
    dom = require('./dom/dom');



module.exports = function (domSelector, domNode, options) {
    var
    _this = this;

    this.store = {};
    this.storeData = {};
    this.dom = new dom(domNode);

    var storeCallback = function (store) {
        _this.storeData[store.alias] = store.get();
        _this.onStoreUpdate(store);
    }

    options.stores.forEach(function (store) {
        this.store[store.alias] = store;
        this.storeData[store.alias] = store.get();
        if (document.readyState === 'complete') {
            store.on(storeCallback.bind(this, store));
        }
        else {
            window.addEventListener('load', function () {
                store.on(storeCallback.bind(this, store));
            });
        }
    }.bind(this));

    for (var o in options) {
        this[o] = options[o];
    }

    var init = function () {
        options.initialize.call(_this);
    }

    if (document.readyState === 'complete') {
        init();
    }
    else {
        window.addEventListener('load', init);
    }
}

