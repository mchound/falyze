var React = require('react');

function _inject(components) {
    for (let c in components) {
        let nodes = document.querySelectorAll('[data-lean-component="' + c + '"]');
        let component = components[c];
        for (let i = 0; i < nodes.length; i++) {
            let propsString = nodes[i].getAttribute('data-lean-props');
            let props = !!propsString ? JSON.parse(propsString) : null;
            React.render(React.createElement(component, props), nodes[i]);
        }
    }
}

module.exports = function (components) {
    if (document.readyState != 'complete') {
        window.addEventListener('load', _inject.bind(this, components));
    }
    else {
        _inject(components);
    }
};