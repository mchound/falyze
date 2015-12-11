var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    DashboardRepo = require('../../../repositories/dashbaord/dashboardRepo');

var filterComponents = {
    position: { component: require('./rangefilter/rangefilter.jsx'), props: { displayName: 'Position filter' } },
    points: { component: require('./rangefilter/rangefilter.jsx'), props: { displayName: 'Points filter' } },
    goalsFor: { component: require('./rangefilter/rangefilter.jsx'), props: { displayName: 'Goals for filter' } },
    goalsAgainst: { component: require('./rangefilter/rangefilter.jsx'), props: { displayName: 'Goals against filter' } },
    goalDiff: { component: require('./rangefilter/rangefilter.jsx'), props: { displayName: 'Goal diff filter' } },
    round: { component: require('./rangefilter/rangefilter.jsx'), props: { displayName: 'Round filter' } },
};

function _getComponents(){
    var filters = DashboardRepo.model.filters.get(),
        components = [];
    for (var i = 0; i < filters.length; i++) {
        var props = filterComponents[filters[i].name].props;
        props.key = filters[i].name;
        props.filterName = filters[i].name;
        components.push(React.createElement(filterComponents[filters[i].name].component, props));
    }
    return components;
}

module.exports = Lean.createComponent({
    displayName: 'FilterList',
    repositories: [DashboardRepo],
    controller: function (state, props) {
        return {
            filters: _getComponents()
        }
    },
    index: function (model, state, props, q) {
        return (
            <ul className="filters">
                {model.filters}
            </ul>
        );
}
});