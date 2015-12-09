var React = require('react');

module.exports = React.createClass({
    validate: function () {
        var valid = true;
        for (var ref in this.refs) {
            valid = this.refs[ref].validate() && valid;
        }
        return valid;
    },
    reset: function () {
        this.props.children.forEach((c) => c.reset());
    },
    render: function () {
        var children = !this.props.children ? [] : !this.props.children.length ? [this.props.children] : this.props.children;
        return (
            <div data-am-validationgroup>
                {children.map(function(child, i){
                    return React.cloneElement(child, {key: i, ref: child.ref});
                }.bind(this))}
            </div>
        );
    }
});