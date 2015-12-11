var React = require('react');

var RadioCheck = React.createClass({
    getInitialState: function () {
        return {
            selectedValue: this.props.defaultValue
        }
    },
    onClick: function(option){
        this.setState({ selectedValue: option.value });
        if (!!this.props.onChange) {
            this.props.onChange(option.value);
        }
    },
    render: function () {
        return (
            <div data-am-radiocheck>
                <ul className="options">
                    {this.props.options.map((o) => { return (
                        <li key={o.value} className={this.state.selectedValue === o.value ? 'selected option' : 'option'} onClick={this.onClick.bind(this, o)}>{o.text}</li>
                    )})}
                </ul>
            </div>
        );
    }
});

module.exports = RadioCheck;