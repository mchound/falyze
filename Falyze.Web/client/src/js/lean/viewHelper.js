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
        return function (item, i) {
            props.key = !key ? i : item[key];
            props.item = item;
            return React.createElement(component, props);
        }
    },
    map: function(items, component, key, props){
        return items.map(this.itemMapper(component, key, props));
    },
    hide: function(expression){
        return !!expression ? 'hidden' : null;
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