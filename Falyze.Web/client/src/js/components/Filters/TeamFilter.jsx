var React = require('react'),
    Lean = require('../../lean/lean'),
    
    Actions = require('../../actions/Actions'),

    Select = require('../common/Select/Select.jsx'),

    FilterStore = require('../../stores/FilterStore'),
    TeamStore = require('../../stores/TeamStore');

module.exports = Lean.createController({
    stores: [TeamStore, FilterStore],
    onChange: function(selected){
        Actions.Filter.updateTeam.dispatch({
            team: this.props.team,
            filter: {
                name: 'teamFilter',
                configuration: {
                    teamId: !!selected.length ? selected[0].value : null
                }
            }
        });
    },
    shouldRender: function(state){
        return (state.store.team !== undefined);
    },
    action: function (state) {
        var thisTeamFilter = !!state.store.filter.filters.teamFilter ? state.store.filter.filters.teamFilter[this.props.team] : {};
        var otherTeamFilter = !!state.store.filter.filters.teamFilter ? state.store.filter.filters.teamFilter[this.props.team === 'team1' ? 'team2' : 'team1'] : {};
        return {
            teams: state.store.team.filter((t) => !otherTeamFilter || t.id !== otherTeamFilter.teamId).
                map((t) => ({
                    value: t.id,
                    text: t.name,
                    selected: !!thisTeamFilter && thisTeamFilter.teamId === t.id,
                    sortBy: t.name
                }))
        };
    },
    view: function (model, state, props) {
        return (
            <div data-am-teamfilter>
                <Select items={model.teams} disabled={false} defaultText="Select Team" onChange={this.onChange} notifyElementSelector={props.notifyElementSelector} />
            </div>
        );
    }
});