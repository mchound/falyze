var React = require('react'),
    Lean = require('../../lean/lean'),

    Actions = require('../../actions/Actions'),

    Utils = require('../../utils/Utils'),

    FilterStore = require('../../stores/FilterStore');

module.exports = Lean.createController({
    stores: [FilterStore],
    onToggleViewClick: function () {
        var filter = Utils.Filter.get(this.store.filter, this.props.filter);
        Actions.Filter.update.dispatch({
            name: this.props.filter,
            configuration: {
                maximized: !!filter ? !filter.maximized : true
            }
        });
    },
    onRemoveClick: function () {
        var filter = Utils.Filter.get(this.store.filter, this.props.filter);
        Actions.Filter.update.dispatch({
            name: this.props.filter,
            configuration: {
                visible: false
            }
        });
    },
    onOrderChangeClick: function (direction) {
        var filter = Utils.Filter.get(this.store.filter, this.props.filter);
        Actions.Filter.update.dispatch({
            name: this.props.filter,
            configuration: {
                order: filter.order + direction
            }
        });
    },
    shouldRender: function (state, props) {
        return !!state.store.filter.filters[props.filter] && !!state.store.filter.filters[props.filter].visible;
    },
    action: function (state, props) {
        var filter = Utils.Filter.get(this.store.filter, this.props.filter);
        return {
            title: props.title,
            iconClass: !!filter && filter.maximized ? 'icon-resize-small' : 'icon-resize-full',
            titleClass: !!filter && !!filter.maximized ? 'title maximized' : 'title minimized',
            canMoveUp: Utils.Filter.canMoveUp(this.store.filter, props.filter),
            canMoveDown: Utils.Filter.canMoveDown(this.store.filter, props.filter)
        };
    },
    view: function (model, state, props, q) {
        return (
            <div className={model.titleClass}>
                <div className="header">
                    <h3>{model.title}</h3>
                </div>
                <div className="tools">
                    {q.if(model.canMoveUp, (
                        <button data-am-button="icon thin on-light" onClick={this.onOrderChangeClick.bind(this, -1)}><i className="icon-up-thin"></i></button>
                    ))}
                    {q.if(model.canMoveDown, (
                        <button data-am-button="icon thin on-light" onClick={this.onOrderChangeClick.bind(this, 1)}><i className="icon-down-thin"></i></button>
                    ))}
                    <button data-am-button="icon thin on-light" onClick={this.onToggleViewClick}><i className={model.iconClass}></i></button>
                    <button data-am-button="icon thin on-light" onClick={this.onRemoveClick}><i className="icon-cancel"></i></button>
                </div>
            </div>
        );
    }
});