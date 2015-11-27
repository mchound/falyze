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
    action: function (state, props) {
        var allTeams = this.state.store.import.teams,
            allAliases = this.state.store.import.aliases,
            teamsAndAliases = allTeams.concat(allAliases),
            countryId = this.state.store.import.country.id,
            matchTeams = __unique(state.store.import.matches.map((m) => m.homeTeam).concat(state.store.import.matches.map((m) => m.awayTeam))),
            newTeams = matchTeams.filter((t) => !allTeams.find((ta) => ta.name === t) && !allAliases.find((a) => a.alias === t)).map((t, i) => ({ nr: i, name: t })),
            existing = allTeams.filter((t) => matchTeams.indexOf(t.name) > -1).map((t) => ({ id: t.id, name: t.name })).concat(
                allAliases.filter((a) => matchTeams.indexOf(a.alias) > -1).map((a) => ({ id: a.id, name: a.alias, aliasFor: allTeams.find((t) => a.teamId === t.id)}))
            );
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
                        {model.existing.map((t, i) => {
                            return ( <tr key={t.id}><td>{i + 1}</td><td>{t.name}</td><td>{!!t.aliasFor ? t.aliasFor.name : null}</td></tr> )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
});