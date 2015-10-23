var React = require('react');

module.exports = {
    toDelimited: function(obj){
        var props = [];
        for (var p in obj) {
            if (obj[p]) {
                props.push(p);
            }
        }
        return props.join(' ');
    },
    itemMapper: function (component, key, props) {
        return function (item) {
            props.key = item[key];
            props.item = item;
            return React.createElement(component, props);
        }
    },
    if: function (condition, jsx) {
        if (condition) {
            return jsx;
        }
        else {
            return null;
        }
    }
}