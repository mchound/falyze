var React = require('react');

var SelectItem = React.createClass({
    onClick: function () {
        this.props.onClick(this.props.item);
    },
    render: function () {
        return (
            <li data-value={this.props.item.value} className={!!this.props.item.selected ? 'item selected' : 'item'} onClick={this.onClick}>
                {this.props.item.text}
            </li>
        );
    }
});

module.exports = SelectItem;