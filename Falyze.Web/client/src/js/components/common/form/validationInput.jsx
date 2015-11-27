var React = require('react');

module.exports = React.createClass({
    getInitialState: function(){
        return {
            val: this.props.value,
            valid: true
        };
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({ val: nextProps.value });
    },
    get: function(){
        return this.state.val;
    },
    set: function(val){
        this.setState({ val: val });
    },
    reset: function(){
        this.setState({ valid: true });
    },
    validate: function () {
        var valid = true;
        if (this.props.required && (!this.state.val || this.state.val === '')) {
            valid = false;
        }
        if (!!this.props.pattern && !this.props.pattern.test(!this.state.val ? '' : this.state.val.toString())) {
            valid = false;
        }
        this.setState({ valid: valid });
        return valid;
    },
    onChange: function(){
        this.setState({ val: this.refs.input.getDOMNode().value });
    },
    render: function (model, state, props) {
        var label = null,
            error = null;
        if (!!this.props.label && this.props.label !== '') {
            label = (<label>{this.props.label}</label>);
        }
        if (!this.state.valid && !!this.props.errorMessage) {
            error = (<span className="error-message">{this.props.errorMessage}</span>)
        }
        return (
            <div className={this.state.valid ? this.props.cssClass : (this.props.cssClass || '') + ' error'}>
                {label}
                <input ref="input" value={this.state.val} onChange={this.onChange} />
                {error}
            </div>  
        );
    }
});