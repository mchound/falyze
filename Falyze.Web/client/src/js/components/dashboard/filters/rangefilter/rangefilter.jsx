var React = require('react'),
    Lean = require('../../../../lean.v2/lean'),
    
    RadioCheck = require('../../../common/radiocheck/radiocheck.jsx'),
    Range = require('../../../common/range/range.jsx'),

    FilterRepo = require('../../../../repositories/dashbaord/filterRepo'),
    DashboardRepo = require('../../../../repositories/dashbaord/dashboardRepo');

function _getFilter(name) {
    var filters = FilterRepo.model.filters.get(),
        filter = filters[name];
    if (!filter) {
        filters[name] = {
            active: true,
            team1: {active: true, side: 0},
            team2: { active: true, side: 0 }
        };
        return filters[name];
    }
    return filter;
}

module.exports = Lean.createComponent({
    displayName: 'RangeFilter',
    onRangeChange: function(team, range){
        var filters = FilterRepo.model.filters.get(),
            teamName = 'team' + team,
            filter = _getFilter(this.props.filterName);
        filter[teamName].min = range.min;
        filter[teamName].max = range.max;
        FilterRepo.model.filters.set(filters);
    },
    onSideChange: function(team, side){
        var filters = FilterRepo.model.filters.get(),
            teamName = 'team' + team,
            filter = _getFilter(this.props.filterName);
        filter[teamName].side = side;
        FilterRepo.model.filters.set(filters);
    },
    controller: function (state, props) {
        var filter = _getFilter(this.props.filterName);
        return {
            homeAwayOptions: [{ text: 'Home', value: 1 }, { text: 'None', value: 0 }, { text: 'Away', value: 2 }],
            team1Side: !!filter ? filter.team1.side : 0,
            team2Side: !!filter ? filter.team2.side : 0,
            team1DefaultMin: !!filter ? filter.team1.min : undefined,
            team1DefaultMax: !!filter ? filter.team1.max : undefined,
            team2DefaultMin: !!filter ? filter.team2.min : undefined,
            team2DefaultMax: !!filter ? filter.team2.max : undefined
        };
    },
    index: function (model, state, props, q) {
        return (
            <li data-am-filter="position">
                <div className="row">
                    <div className="col-sm-12">
                        <div data-am-card="light">
                            <header className="header">{props.displayName}</header>
                            <section className="body">
                                <div className="mb"><Range min={0} max={999} onChange={this.onRangeChange.bind(this, 1)} defaultMin={model.team1DefaultMin} defaultMax={model.team1DefaultMax} /></div>
                                <RadioCheck options={model.homeAwayOptions} onChange={this.onSideChange.bind(this, 1)} defaultValue={model.team1Side} />
                            </section>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div data-am-card="light">
                            <header className="header">{props.displayName}</header>
                            <section className="body">
                                <div className="mb"><Range min={0} max={999} onChange={this.onRangeChange.bind(this, 2)} defaultMin={model.team2DefaultMin} defaultMax={model.team2DefaultMax} /></div>
                                <RadioCheck options={model.homeAwayOptions} onChange={this.onSideChange.bind(this, 2)} defaultValue={model.team2Side} />
                            </section>
                        </div>
                    </div>
                </div>
            </li>
        );
}
});