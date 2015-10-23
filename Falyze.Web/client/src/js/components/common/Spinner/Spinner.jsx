var React = require('react');

var Spinner = React.createClass({
    render: function () {
        return (
            <div className={'spinner ' + this.props.color || ''}>
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        );
    }
});

module.exports = Spinner;