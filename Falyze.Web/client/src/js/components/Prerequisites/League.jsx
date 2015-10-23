var React = require('react'),
    Lean = require('../../lean/lean'),

    Select = require('../common/Select/Select.jsx'),

    LeagueStore = require('../../stores/LeagueStore'),
    PrerequisiteStore = require('../../stores/PrerequisiteStore'),
    MatchStore = require('../../stores/MatchStore'),

    Actions = require('../../actions/Actions');

var LeagueSelect = Lean.createController({
    displayName: 'LeagueSelect',
    stores: [LeagueStore, PrerequisiteStore, MatchStore],
    onChange: function (selected) {
        Actions.Prerequisites.changeLeague.dispatch(selected);
    },
    shouldRender: function (state) {
        return state.store.league !== undefined;
    },
    action: function (state, props) {
        var selectedCountry = state.store.prerequisite.country || {};
        var leagues = state.store.league.filter((league) => league.countryId === selectedCountry.value);

        var leagueItems = leagues.map(function (league) {
            var selected = !!state.store.prerequisite.leagues && !!state.store.prerequisite.leagues.filter((l) => l.value === league.id).length
            return {
                value: league.id,
                text: league.name,
                selected:  selected,
                sortBy: league.level
            };
        }.bind(this));

        return {
            leagues: leagueItems,
            disabled: leagueItems.length === 0 || this.store.match.status === 'pending'
        };
    },
    view: function (model, state, props, q) {
        return (
          <Select items={model.leagues} defaultText="Select League" ref="leagues" multiple={true} showCount={true} entityPluralName="leagues" disabled={model.disabled} onChange={this.onChange} />
        );
    }
});

module.exports = LeagueSelect;