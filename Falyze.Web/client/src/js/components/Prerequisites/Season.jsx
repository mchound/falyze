var React = require('react'),
    Lean = require('../../lean/lean'),

    Select = require('../common/Select/Select.jsx'),

    SeasonStore = require('../../stores/SeasonStore'),
    PrerequisiteStore = require('../../stores/PrerequisiteStore'),
    MatchStore = require('../../stores/MatchStore'),

    Actions = require('../../actions/Actions');

var LeagueSelect = Lean.createController({
    displayName: 'SeasonSelect',
    stores: [SeasonStore, PrerequisiteStore, MatchStore],
    onChange: function (selected) {
        Actions.Prerequisites.changeSeason.dispatch(selected);
    },
    shouldRender: function (state) {
        return state.store.season !== undefined;
    },
    action: function (state, props) {
        var selectedCountry = state.store.prerequisite.country || {};
        var seasons = state.store.season.filter((season) => season.countryId === selectedCountry.value).sort((a, b) => a.startYear - b.startYear);
        
        var seasonItems = seasons.map(function (season) {
            var selected = !!state.store.prerequisite.leagues && !!state.store.prerequisite.seasons.filter((s) => s.value === season.id).length
            return {
                value: season.id,
                text: season.name,
                selected: selected,
                sortBy: season.startYear
            };
        }.bind(this));

        return {
            seasons: seasonItems,
            disabled: seasonItems.length === 0 || this.store.match.status === 'pending'
        };
    },
    view: function (model, state, props, q) {
        return (
          <Select items={model.seasons} defaultText="Select Seasons" ref="seasons" multiple={true} showCount={true} entityPluralName="seasons" disabled={model.disabled} onChange={this.onChange} />
        );
    }
});

module.exports = LeagueSelect;