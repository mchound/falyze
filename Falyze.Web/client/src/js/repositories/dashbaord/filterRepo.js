var Lean = require('../../lean.v2/lean'),
    Ajax = require('../../utils/ajax'),
    Actions = require('../../actions/actions').dashboard,
    DashboardRepo = require('./dashboardRepo');

module.exports = Lean.createRepository({
    alias: 'filter',
    model: {
        filters: Lean.observable({})
    },
    initialize: function () {
        DashboardRepo.model.filters.observe(this.onFiltersChange.bind(this));
    },
    onFiltersChange: function (visibleFilters) {
        var filters = this.model.filters.get(),
            visibleFilterNames = visibleFilters.map((f) => f.name);
        for (var filter in filters) {
            if (visibleFilterNames.indexOf(filter) > -1) {
                filters[filter].active = true;
            }
            else {
                filters[filter].active = false;
            }
        }
        this.model.filters.set(filters);
    }
});