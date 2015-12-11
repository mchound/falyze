var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    DashboardRepo = require('../../../repositories/dashbaord/dashboardRepo');

function _getFilterIndex(filter) {
    var filters = DashboardRepo.model.filters.get();
    for (var i = 0; i < filters.length; i++) {
        if(filters[i].name === filter){
            return i;
        }
    }
    return -1;
}

module.exports = Lean.createComponent({
    displayName: 'FilterItem',
    repositories: [DashboardRepo],
    onClick: function(){
        var filters = this.state.repo.dashboard.filters,
            index = _getFilterIndex(this.props.filter);
        if (index === -1) {
            filters.push({ name: this.props.filter });
        }
        else {
            filters.splice(index, 1);
        }
        DashboardRepo.model.filters.set(filters);
    },
    controller: function (state, props) {
        return {
            className: _getFilterIndex(props.filter) > -1 ? 'nav-item selected' : 'nav-item'
        }
    },
    index: function (model, state, props, q) {
        return (
            <li className={model.className}>
                <i className="checked icon-check"></i><button className="link" onClick={this.onClick}>{props.label}</button>
            </li>
        );
    }
});