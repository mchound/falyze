var React = require('react'),
    Lean = require('../../lean/lean'),

    FilterStore = require('../../stores/FilterStore'),

    Actions = require('../../actions/Actions'),

    Utils = require('../../utils/Utils');

module.exports = Lean.createController({
    stores: [FilterStore],
    onClick: function(){
        Actions.Filter.update.dispatch({
            name: this.props.filter,
            configuration: {
                visible: !Utils.Filter.isVisible(FilterStore, this.props.filter)
            }
        });
    },
    action: function (state, props) {
        return {
            title: props.title,
            selected: Utils.Filter.isVisible(FilterStore, props.filter)
        };
    },
    view: function (model, state, props) {
        return (
            <div className={model.selected ? 'add selected' : 'add'}>
                <i className="icon-selected icon-check"></i>
                <button className="btn-add" onClick={this.onClick}>{props.btnText || props.title}</button>
                <i className="icon-add icon-plus"></i>
                <i className="icon-remove icon-minus"></i>
            </div>
        );
    }
});

