var React = require('react');

var Spinner = React.createClass({
    render: function () {
        return (
            <div data-am-loader>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
            </div>
        );
    }
});

module.exports = Spinner;