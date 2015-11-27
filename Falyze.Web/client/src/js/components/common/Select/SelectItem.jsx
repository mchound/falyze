var React = require('react');

var SelectItem = React.createClass({
    onClick: function () {
        this.props.onClick(this.props.item);
    },
    render: function () {
        
        if (!!this.props.item.selected) {
            return (
                <li data-value={this.props.item.value} className="item selected" onClick={this.onClick}>
                    <i className="selected-icon icon-check"></i>
                    {this.props.item.text}
                </li>
            );
        }
        else {
            return (
                <li data-value={this.props.item.value} className="item" onClick={this.onClick}>
                    {this.props.item.text}
                </li>
            );
        }
    }
});

module.exports = SelectItem;