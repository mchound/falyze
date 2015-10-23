var React = require('react'),
    Lean = require('../../lean/lean'),
    PrerequisiteStore = require('../../stores/PrerequisiteStore'),
    MatchStore = require('../../stores/MatchStore'),
    Actions = require('../../actions/Actions');

module.exports = Lean.createController({
    displayName: 'PrerequisiteConfirm',
    stores: [PrerequisiteStore, MatchStore],
    onClick: function () {
        Actions.Prerequisites.confirm.dispatch({
            country: this.state.store.prerequisite.country.value,
            leagues: this.state.store.prerequisite.leagues.map((l) => l.value),
            seasons: this.state.store.prerequisite.seasons.map((s) => s.value)
        });
    },
    action: function (state) {
        return {
            enabled:    state.store.prerequisite.country !== null &&
                        !!state.store.prerequisite.leagues.length &&
                        state.store.prerequisite.seasons.length &&
                        this.store.match.status === 'waiting'
        };
    },
    view: function (model) {
        return (
            <button data-am-button="green" className="stretch-h" onClick={this.onClick} disabled={!model.enabled}><i className="icon-check"></i>Confirm</button>
        );
    }
});