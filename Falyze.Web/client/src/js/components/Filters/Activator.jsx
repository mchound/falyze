var React = require('react'),
    Lean = require('../../lean/lean'),

    FilterStore = require('../../stores/FilterStore'),

    Actions = require('../../actions/Actions');

module.exports = Lean.createController({
    stores: [FilterStore],
    onChange: function(){
        var filter = this.state.store.filter.filters[this.props.filter];
        Actions.Filter.update.dispatch({
            name: this.props.filter,
            configuration: {
                active: !filter.active
            }
        });
    },
    action: function (state, props) {
        var filter = state.store.filter.filters[props.filter];
        return {
            active: !!filter && filter.active
        }
    },
    view: function (model, state, props) {
        return (
            <div>
                <input type="checkbox" checked={model.active} onChange={this.onChange} />
            </div>
        );
    }
});