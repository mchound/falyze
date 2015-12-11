var React = require('react');

function _fadeOut(node) {
    node.style.transition = 'opacity 500ms, height 1ms 500ms';
    node.style.opacity = 0;
    node.style.height = 0;
}

module.exports = function (identifier, type, callback) {
    var node = document.querySelector('[data-lean-component="' + identifier + '"]');
    if (!node) {
        return;
    }

    switch (type) {
        case 'fadeOut':
            _fadeOut(node);
            setTimeout(function () {
                React.unmountComponentAtNode(node);
                callback();
            }, 500);
            break;
        default:
            React.unmountComponentAtNode(node);
    }
}