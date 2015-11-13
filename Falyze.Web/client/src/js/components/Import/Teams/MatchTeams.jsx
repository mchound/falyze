var React = require('react'),
    Lean = require('../../../lean/lean'),
    
    __unique = require('lodash/array/unique'),
    __intersection = require('lodash/array/intersection'),
    __xor = require('lodash/array/xor'),
    __without = require('lodash/array/without'),

    Ajax = require('../../../lean/store/ajax'),
    
    NewTeam = require('./NewTeam.jsx'),

    ImportStore = require('../../../stores/Import/ImportStore');

module.exports = Lean.createController({
    getInitialState: function(){
        return {
            existing: [],
            newTeams: []
        }
    },
    stores: [ImportStore],
    shouldRender: function(state){
        return state.store.import.matches.length > 0;
    },
    action: function () {
        var teamsAndAliases = this.state.store.import.teams.map((t) => t.name).concat(this.state.store.import.aliases.map((a) => a.alias)),
            countryId = this.state.store.import.country.id,
            matchTeams = __unique(this.state.store.import.matches, (m) => m.homeTeam).map((m) => m.homeTeam),
            newTeams = matchTeams.filter((t) => teamsAndAliases.indexOf(t) === -1).map((t, i) => ({nr: i, name: t})),
            existing = matchTeams.filter((t) => teamsAndAliases.indexOf(t) > -1);
        return {
            existing: existing,
            newTeams: newTeams
        };
    },
    view: function (model, state, props, q) {
        return (
            <div data-am-import-teams>
                <h2>New teams</h2>
                <table className="teams mb">
                    <tbody>
                        {q.map(model.newTeams, NewTeam, 'nr', {})}
                    </tbody>
                </table>
                <h2>Existing teams</h2>
                <table className="teams mb">
                    <tbody>
                        {model.existing.map((t, i) => { return (
                            <tr key={i}><td>{i + 1}</td><td>{t}</td></tr>
                        )})}
                    </tbody>
                </table>
            </div>
        );
    }
});