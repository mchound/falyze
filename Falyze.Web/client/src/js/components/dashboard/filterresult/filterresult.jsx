var React = require('react'),
    Lean = require('../../../lean.v2/lean'),
    
    Ajax = require('../../../utils/ajax'),

    DashboardRepo = require('../../../repositories/dashbaord/dashboardRepo'),
    FilterRepo = require('../../../repositories/dashbaord/filterRepo');

function _createFilterModel() {
    var filters = FilterRepo.model.filters.get(),
        model = {};

    model.country = DashboardRepo.model.country.get().id;
    model.leagues = DashboardRepo.model.leagues.get().map((l) => l.id);
    model.seasons = DashboardRepo.model.seasons.get().map((s) => s.id);
    model.team1 = {};
    model.team2 = {};

    for (var filter in filters) {
        if (filters[filter].active && filters[filter].team1.active) {
            model.team1[filter + 'filter'] = {
                min: filters[filter].team1.min,
                max: filters[filter].team1.max || 999,
                table: filters[filter].team1.side
            }
        }
        if (filters[filter].active && filters[filter].team2.active) {
            model.team2[filter + 'filter'] = {
                min: filters[filter].team2.min,
                max: filters[filter].team2.max || 999,
                table: filters[filter].team2.side
            }
        }
    }

    return model;
}

module.exports = Lean.createComponent({
    displayName: 'FilterResult',
    repositories: [DashboardRepo, FilterRepo],
    onClick: function(){
        var filterModel = _createFilterModel();
        
        Ajax.post('/api/dashboard/stats', filterModel,
            function (resp) {
                console.log(resp);
            },
            function (xhr) {
                console.log(arguments);
            }
        );

    },
    controller: function () {

    },
    index: function (model, state, props, q) {
        return (
            <div>
                <button data-am-button="green" onClick={this.onClick}>Get results!<i className="icon-charts-line"></i></button>
            </div>  
        );
    }
})