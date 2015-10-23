var React = require('react'),
    Lean = require('../../lean/lean'),

    Select = require('../common/Select/Select.jsx'),

    CountryStore = require('../../stores/CountryStore'),
    MatchStore = require('../../stores/MatchStore'),
    PrerequisiteStore = require('../../stores/PrerequisiteStore'),

    Actions = require('../../actions/Actions');

var CountrySelect = Lean.createController({
    displayName: 'CountrySelect',
    stores: [CountryStore, MatchStore, PrerequisiteStore],
    onChange: function(selected){
        Actions.Prerequisites.changeCountry.dispatch(selected[0] || null);
    },
    shouldRender: function (state) {
        return state.store.country !== undefined;
    },
    action: function (state, props) {
        var countries = state.store.country.map(function (country) {
            return {
                value: country.id,
                text: country.name,
                selected: !!state.store.prerequisite.country && country.id === state.store.prerequisite.country.value,
                sortBy: country.name
            };
        });

        return {
            countries: countries,
            disabled: this.store.match.status === 'pending'
        }
    },
    view: function (model, state, props, q) {
        return (
          <Select items={model.countries} disabled={model.disabled} defaultText="Select Country" onChange={this.onChange} />
        );
    }
});

module.exports = CountrySelect;