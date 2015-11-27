var React = require('react'),
    Lean = require('../../../lean.v2/lean');

module.exports = Lean.createComponent({
    getInitialState: function () {
        return {
            deleteRequested: false
        };
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.visible) {
            this.setState({ deleteRequested: false });
        }
    },
    shouldRender: function(state, props){
        return props.visible;
    },
    controller: function (state, props) {
        return {

        }
        return {
            attrs: props.visible ? 'show' : 'hidden'
        }
    },
    index: function (model, state, props, q) {
        return (
            <div data-am-editpanel="">
                <div className="overlay" onClick={props.onClose}></div>
                <div className="header actions">
                    <h2 className="title">{props.title}</h2>
                    <button data-am-button="icon" className={q.hide(!props.onDelete, null, 'icon-lg icon')} onClick={this.changeState.bind(this, {deleteRequested: true})}><i className="icon-trash"></i></button>
                </div>

                <form data-am-form onSubmit={props.onSubmit} className={q.hide(state.deleteRequested)}>
                    {props.children}
                    <div className="btn-group center fill-2 mb">
                        <button type="button" data-am-button="" onClick={props.onClose}>Cancel</button>
                        <button type="submit" data-am-button="green">Save</button>
                    </div>
                    <p className={q.hide(!props.error, null, 'error')}>{props.error}</p>
                </form>

                <div className={q.hide(!state.deleteRequested)}>
                    <p className="mb">Do you really want to delete this item?</p>
                    <div className="btn-group fill-2">
                        <button data-am-button="red" onClick={props.onDelete}>Confirm</button>
                        <button data-am-button="" onClick={this.changeState.bind(this, {deleteRequested: false})}>Cancel</button>
                    </div>
                </div>

            </div>
        );
    }
});